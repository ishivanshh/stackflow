import { ID, Query } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";

import { db, answerCollection, questionCollection, voteCollection } from "@/models/name";
import { tablesDB } from "@/models/server/config";

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
        await tablesDB.getRow(
            db,
            targetCollection,
            typeId
        );

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

        const existingVote = response.rows[0] as unknown as {
            $id: string;
            voteStatus: "upvoted" | "downvoted";
        } | undefined;

        // Same vote means remove the vote.
        if (existingVote && existingVote.voteStatus === voteStatus) {
            await tablesDB.deleteRow(
                db,
                voteCollection,
                existingVote.$id
            );

            return NextResponse.json(
                {
                    message: "Vote removed"
                },
                {
                    status: 200
                }
            );
        }

        // Different vote means switch the existing vote.
        if (existingVote) {
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
                    vote: updatedVote
                },
                {
                    status: 200
                }
            );
        }

        // Create new vote
        const newVote = await tablesDB.createRow(
            db,
            voteCollection,
            ID.unique(),
            {
                type,
                typeId,
                votedById,
                voteStatus
            }
        );

        return NextResponse.json(
            {
                vote: newVote
            },
            {
                status: 201
            }
        );

    } catch (error: unknown) {

        console.error("Error handling vote:", error);

        const message = error instanceof Error ? error.message : "Error handling vote";
        const statusCode =
            typeof error === "object" && error !== null && "code" in error &&
            typeof error.code === "number"
                ? error.code
                : 500;

        return NextResponse.json(
            {
                error: message
            },
            {
                status: statusCode
            }
        );
    }
}
