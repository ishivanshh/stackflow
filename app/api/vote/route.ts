import { Query } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";

import { db, answerCollection, questionCollection, voteCollection } from "@/models/name";
import { tablesDB } from "@/models/server/config";

const REPUTATION_CHANGE = 10;

export async function POST(request: NextRequest) {

    try {

        // Grab data
        const {
            votedById,
            voteStatus,
            type,
            typeId
        } = await request.json();

        // Validate data
        if (!votedById || !voteStatus || !type || !typeId) {
            return NextResponse.json(
                {
                    error: "votedById, voteStatus, type and typeId are required"
                },
                {
                    status: 400
                }
            );
        }

        // Validate vote status
        if (!["upvoted", "downvoted"].includes(voteStatus)) {
            return NextResponse.json(
                {
                    error: "voteStatus must be either upvoted or downvoted"
                },
                {
                    status: 400
                }
            );
        }

        // Validate type
        if (!["question", "answer"].includes(type)) {
            return NextResponse.json(
                {
                    error: "type must be either question or answer"
                },
                {
                    status: 400
                }
            );
        }

        // Select the collection based on the type
        const targetCollection =
            type === "question"
                ? questionCollection
                : answerCollection;

        // Find the question or answer
        const targetResponse = await tablesDB.getRow(
            db,
            targetCollection,
            typeId
        );

        const target = targetResponse as any;

        // Find existing vote
        const response = await tablesDB.listRows(
            db,
            voteCollection,
            [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById),
            ]
        );

        const existingVote = response.rows[0] as any;

        // Same vote means remove the vote and reverse its reputation effect
        if (existingVote && existingVote.voteStatus === voteStatus) {

            const reputationChange =
                voteStatus === "upvoted"
                    ? -REPUTATION_CHANGE
                    : REPUTATION_CHANGE;

            await tablesDB.updateRow(
                db,
                targetCollection,
                typeId,
                {
                    reputation: Math.max(
                        0,
                        (target.reputation || 0) + reputationChange
                    )
                }
            );

            await tablesDB.deleteRow(
                db,
                voteCollection,
                existingVote.$id
            );

            return NextResponse.json(
                {
                    message: "Vote removed",
                    reputation: Math.max(
                        0,
                        (target.reputation || 0) + reputationChange
                    )
                },
                {
                    status: 200
                }
            );
        }

        // Different vote means change the vote and reverse the old effect
        if (existingVote) {

            const oldReputationChange =
                existingVote.voteStatus === "upvoted"
                    ? -REPUTATION_CHANGE
                    : REPUTATION_CHANGE;

            const newReputationChange =
                voteStatus === "upvoted"
                    ? REPUTATION_CHANGE
                    : -REPUTATION_CHANGE;

            const reputationChange =
                oldReputationChange + newReputationChange;

            const updatedTarget = await tablesDB.updateRow(
                db,
                targetCollection,
                typeId,
                {
                    reputation: Math.max(
                        0,
                        (target.reputation || 0) + reputationChange
                    )
                }
            );

            const updatedVote = await tablesDB.updateRow(
                db,
                voteCollection,
                existingVote.$id,
                {
                    voteStatus
                }
            );

            return NextResponse.json(
                {
                    vote: updatedVote,
                    reputation: (updatedTarget as any).reputation
                },
                {
                    status: 200
                }
            );
        }

        // New upvote increases reputation
        // New downvote decreases reputation
        const reputationChange =
            voteStatus === "upvoted"
                ? REPUTATION_CHANGE
                : -REPUTATION_CHANGE;

        const updatedTarget = await tablesDB.updateRow(
            db,
            targetCollection,
            typeId,
            {
                reputation: Math.max(
                    0,
                    (target.reputation || 0) + reputationChange
                )
            }
        );

        // Create new vote
        const newVote = await tablesDB.createRow(
            db,
            voteCollection,
            crypto.randomUUID(),
            {
                type,
                typeId,
                votedById,
                voteStatus
            }
        );

        return NextResponse.json(
            {
                vote: newVote,
                reputation: (updatedTarget as any).reputation
            },
            {
                status: 201
            }
        );

    } catch (error: any) {

        console.error("Error handling vote:", error);

        return NextResponse.json(
            {
                error: error?.message || "Error handling vote"
            },
            {
                status: error?.code || 500
            }
        );
    }
}
