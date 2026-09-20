import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { tablesDB, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const LatestQuestions = async () => {
    const questions = await tablesDB.listRows(db, questionCollection, [
        Query.orderDesc("$createdAt"),
    ]);
    console.log("Fetched Questions:", questions);

    questions.rows = await Promise.all(
        questions.rows.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                tablesDB.listRows(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
                tablesDB.listRows(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
            ]);

            return {
                ...ques,
                totalAnswers: answers.total,
                totalVotes: votes.total,
                author: {
                    $id: author.$id,
                    reputation: author.prefs.reputation,
                    name: author.name,
                },
            };
        })
    );

    console.log("Latest question")
    console.log(questions)
    return (
        <div className="space-y-6">
            {questions.rows.map(question => (
                    <QuestionCard key={question.$id} ques={JSON.parse(JSON.stringify(question))} />
            ))}
        </div>
    );
};

export default LatestQuestions;
