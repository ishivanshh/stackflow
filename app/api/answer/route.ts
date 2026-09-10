import { answerCollection, db } from "@/models/name";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import {UserPrefs} from "@/store/Auth";
import { tablesDB, users } from "@/models/server/config";

// updating the answer to respective user
export async function POST(request: NextRequest) {

    try {

        const {
            questionId,
            answer,
            authorId
        } = await request.json();

        // Validate input
        if (!questionId || !answer || !authorId) {
            return NextResponse.json(
                {
                    error: "questionId, answer and authorId are required"
                },
                {
                    status: 400
                }
            );
        }

        // Create answer row
        const response = await tablesDB.createRow(
            db,
            answerCollection,
            ID.unique(),
            {
                content: answer,
                authorId: authorId,
                questionId: questionId
            }
        );

        // Increase author reputation
        const prefs = await users.getPrefs<UserPrefs>(authorId);

        await users.updatePrefs(
            authorId,
            {
                reputation: Number(prefs.reputation || 0) + 1
            }
        );

        return NextResponse.json(
            response,
            {
                status: 201
            }
        );

    } catch (error: any) {

        console.error("Error creating answer:", error);

        return NextResponse.json(
            {
                error: error?.message || "Error creating answer"
            },
            {
                status: error?.code || 500
            }
        );
    }
}


// deleting the answer 
export async function DELETE(request: NextRequest) {

    try {

        const {
            answerId,
            authorId
        } = await request.json();

        // Validate input
        if (!answerId || !authorId) {
            return NextResponse.json(
                {
                    error: "answerId and authorId are required"
                },
                {
                    status: 400
                }
            );
        }

        // Get answer before deleting it
        const answer = await tablesDB.getRow(
            db,
            answerCollection,
            answerId
        );

        // Make sure the user owns the answer
        if (answer.authorId !== authorId) {
            return NextResponse.json(
                {
                    error: "You are not allowed to delete this answer"
                },
                {
                    status: 403
                }
            );
        }

        // Delete answer
        await tablesDB.deleteRow(
            db,
            answerCollection,
            answerId
        );

        // Decrease author's reputation
        const prefs = await users.getPrefs<UserPrefs>(
            authorId
        );

        await users.updatePrefs(
            authorId,
            {
                reputation: Math.max(
                    0,
                    Number(prefs.reputation || 0) - 1
                )
            }
        );

        return NextResponse.json(
            {
                message: "Answer deleted successfully"
            },
            {
                status: 200
            }
        );

    } catch (error: any) {

        console.error("Error deleting answer:", error);

        return NextResponse.json(
            {
                error: error?.message || "Error deleting answer"
            },
            {
                status: error?.code || 500
            }
        );
    }
}
