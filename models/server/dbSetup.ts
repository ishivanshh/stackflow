import { db } from "../name";

import createAnswerTable from "./answer.collection";
import createQuestionTable from "./question.collection";
import createCommentTable from "./comment.collection";
import createVoteTable from "./vote.collection";

import { tablesDB } from "./config";

export default async function getOrCreateDb() {

    try {

        // Check if database already exists
        await tablesDB.get(db);

        console.log("Database connected");

    } catch (error) {

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

        } catch (error) {

            console.log(
                "Error creating database:",
                error
            );
        }
    }

    return tablesDB;
}
