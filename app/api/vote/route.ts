import { Query } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";

import { db, voteCollection } from "@/models/name";
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

        // User has already voted
        if (response.rows.length > 0) {

            const existingVote = response.rows[0];

            // Same vote → remove vote
            if (existingVote.voteStatus === voteStatus) {

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

            // Different vote → change vote
            const updatedVote = await tablesDB.updateRow(
                db,
                voteCollection,
                existingVote.$id,
                {
                    voteStatus: voteStatus
                }
            );

            return NextResponse.json(
                updatedVote,
                {
                    status: 200
                }
            );
        }

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
            newVote,
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
