"use client";

import { tablesDB } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

type VoteCount = { total: number };
type VoteRow = Models.Row & { voteStatus?: "upvoted" | "downvoted" };

const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}: {
    type: "question" | "answer";
    id: string;
    upvotes: VoteCount;
    downvotes: VoteCount;
    className?: string;
}) => {
    const [votedDocument, setVotedDocument] = React.useState<VoteRow | null>();
    const [voteResult, setVoteResult] = React.useState<number>(upvotes.total - downvotes.total);

    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            if (user) {
                const response = await tablesDB.listRows(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", id),
                    Query.equal("votedById", user.$id),
                ]);
                setVotedDocument(() => response.rows[0] || null);
            }
        })();
    }, [user, id, type]);

    const toggleVote = async (voteStatus: "upvoted" | "downvoted") => {
        if (!user) return router.push("/login");

        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus,
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

                        const previousStatus = votedDocument?.voteStatus;
                        const nextVote = (data.vote ?? data.data?.document ?? null) as VoteRow | null;
                        const change = !previousStatus
                                ? voteStatus === "upvoted" ? 1 : -1
                                : previousStatus === voteStatus
                                    ? voteStatus === "upvoted" ? -1 : 1
                                    : voteStatus === "upvoted" ? 2 : -2;

                        setVoteResult(current => current + change);
                        setVotedDocument(nextVote);
        } catch (error: unknown) {
            window.alert(error instanceof Error ? error.message : "Something went wrong");
        }
    };

    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument?.voteStatus === "upvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={() => toggleVote("upvoted")}
            >
                <IconCaretUpFilled />
            </button>
            <span>{voteResult}</span>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument?.voteStatus === "downvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={() => toggleVote("downvoted")}
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );
};

export default VoteButtons;
