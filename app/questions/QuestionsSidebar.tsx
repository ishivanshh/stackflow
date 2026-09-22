import Link from "next/link";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { tablesDB, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { normalizeTags } from "@/utils/tags";
import slugify from "@/utils/slugify";
import { Query } from "node-appwrite";

type QuestionRow = {
    $id: string;
    title: string;
    authorId: string;
    tags?: string | string[];
};

type UserSummary = {
    id: string;
    name: string;
    questions: number;
    answers: number;
};

export default async function QuestionsSidebar() {
    const [questionRows, answerRows] = await Promise.all([
        tablesDB.listRows(db, questionCollection, [
            Query.orderDesc("$createdAt"),
            Query.limit(100),
        ]),
        tablesDB.listRows(db, answerCollection, [Query.limit(100)]),
    ]);

    const questions = questionRows.rows as unknown as QuestionRow[];
    const answers = answerRows.rows as Array<{ authorId?: string }>;

    const tagCounts = new Map<string, number>();
    for (const question of questions) {
        for (const tag of normalizeTags(question.tags)) {
            tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
        }
    }
    const popularTags = [...tagCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    const trending = (await Promise.all(
        questions.slice(0, 10).map(async question => {
            const [answerCount, voteCount] = await Promise.all([
                tablesDB.listRows(db, answerCollection, [
                    Query.equal("questionId", question.$id),
                    Query.limit(1),
                ]),
                tablesDB.listRows(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", question.$id),
                    Query.limit(1),
                ]),
            ]);

            return {
                question,
                answers: answerCount.total,
                votes: voteCount.total,
            };
        })
    ))
        .sort((a, b) => b.answers + b.votes - (a.answers + a.votes))
        .slice(0, 5);

    const activity = new Map<string, { questions: number; answers: number }>();
    for (const question of questions) {
        const stats = activity.get(question.authorId) ?? { questions: 0, answers: 0 };
        stats.questions += 1;
        activity.set(question.authorId, stats);
    }
    for (const answer of answers) {
        if (!answer.authorId) continue;
        const stats = activity.get(answer.authorId) ?? { questions: 0, answers: 0 };
        stats.answers += 1;
        activity.set(answer.authorId, stats);
    }

    const activeUsers = (await Promise.all(
        [...activity.entries()]
            .sort((a, b) =>
                b[1].questions + b[1].answers - (a[1].questions + a[1].answers)
            )
            .slice(0, 5)
            .map(async ([id, stats]): Promise<UserSummary | null> => {
                try {
                    const user = await users.get<UserPrefs>(id);
                    return { id, name: user.name, ...stats };
                } catch {
                    return null;
                }
            })
    )).filter((user): user is UserSummary => user !== null);

    return (
        <aside className="grid gap-3 md:grid-cols-2 lg:sticky lg:top-28 lg:self-start" aria-label="Question insights">
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-base font-semibold text-white">Popular Tags</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                    {popularTags.map(([tag, count]) => (
                        <Link key={tag} href={`/questions?tag=${encodeURIComponent(tag)}`} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-orange-400/60 hover:text-orange-300">
                            #{tag} <span className="text-neutral-600">{count}</span>
                        </Link>
                    ))}
                    {popularTags.length === 0 && <p className="text-sm text-neutral-500">No tags yet.</p>}
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                    <h2 className="text-base font-semibold text-white">Trending Questions</h2>
                    <div className="mt-3 divide-y divide-white/10">
                        {trending.map(({ question, answers, votes }) => (
                            <Link
                                key={question.$id}
                                href={`/questions/${question.$id}/${slugify(question.title)}`}
                                className="block py-3 first:pt-0 last:pb-0"
                            >
                                <p className="line-clamp-2 text-sm leading-5 text-neutral-300 transition hover:text-orange-300">{question.title}</p>
                                <p className="mt-1 text-xs text-neutral-600">{answers} answers · {votes} votes</p>
                            </Link>
                        ))}
                        {trending.length === 0 && <p className="text-sm text-neutral-500">No questions yet.</p>}
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-base font-semibold text-white">Most Active Users</h2>
                <div className="mt-4 space-y-4">
                    {activeUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between gap-3">
                            <Link href={`/users/${user.id}/${user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`} className="min-w-0 truncate text-sm font-medium text-orange-300 hover:text-orange-200">
                                {user.name}
                            </Link>
                            <div className="shrink-0 text-right text-[11px] leading-4 text-neutral-500">
                                <p>{user.questions} questions</p>
                                <p>{user.answers} answers</p>
                            </div>
                        </div>
                    ))}
                    {activeUsers.length === 0 && <p className="text-sm text-neutral-500">No activity yet.</p>}
                </div>
            </section>
        </aside>
    );
}