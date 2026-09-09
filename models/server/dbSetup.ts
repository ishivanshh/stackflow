import { db } from "../name";

import createAnswerTable from "./answer.collection";
import createQuestionTable from "./question.collection";
import createCommentTable from "./comment.collection";
import createVoteTable from "./vote.collection";

import { tablesDB } from "./config";

let setupAttempted = false;

export default async function getOrCreateDb() {
    if (setupAttempted) {
        return tablesDB;
    }

    setupAttempted = true;

    try {

        // Check if database already exists
        await tablesDB.get(db);

        console.log("Database connected");

    } catch {

        try {

            // Create database
            await tablesDB.create(
                db,
                db
            );

            console.log("Database created");

            // Create all tables
            await Promise.all([
                createQuestionTable(),
                createAnswerTable(),
                createCommentTable(),
                createVoteTable(),
            ]);

            console.log("All tables created");

        } catch (error: unknown) {
            const errorType =
                typeof error === "object" && error !== null && "type" in error
                    ? String(error.type)
                    : "";

            if (errorType === "additional_resource_not_allowed") {
                console.warn(
                    `Database "${db}" is not available and this Appwrite project has reached its database limit. Create or select an existing database, then update models/name.ts.`
                );
            } else {
                console.error("Error creating database:", error);
            }
        }
    }

    return tablesDB;
}
