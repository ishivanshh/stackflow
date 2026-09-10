import { Permission } from "node-appwrite";
import { db, answerCollection } from "../name";
import { tablesDB } from "./config";

export default async function createAnswerTable() {

    let tableCreated = false;

    try {
        await tablesDB.getTable(db, answerCollection);
    } catch (error: unknown) {
        if (
            typeof error !== "object" ||
            error === null ||
            !("code" in error) ||
            error.code !== 404
        ) {
            throw error;
        }

        await tablesDB.createTable(
            db,
            answerCollection,
            answerCollection,
            [
                Permission.read("any"),
                Permission.create("users"),
                Permission.update("users"),
                Permission.delete("users"),
            ]
        );

        tableCreated = true;
    }

    if (!tableCreated) {
        console.log("Answer table already exists");
        return;
    }

    console.log("Answer table created");

    // Create columns
    await Promise.all([

        // Answer content
        tablesDB.createTextColumn(
            db,
            answerCollection,
            "content",
            true
        ),

        // Author ID
        tablesDB.createVarcharColumn(
            db,
            answerCollection,
            "authorId",
            50,
            true
        ),

        // Question ID
        tablesDB.createVarcharColumn(
            db,
            answerCollection,
            "questionId",
            50,
            true
        ),
    ]);

    console.log("Answer columns created");

    // Create indexes
    // await Promise.all([

    //     // Find all answers written by a user
    //     tablesDB.createIndex(
    //         db,
    //         answerCollection,
    //         "authorId_index",
    //         "key",
    //         ["authorId"]
    //     ),

    //     // Find all answers belonging to a question
    //     tablesDB.createIndex(
    //         db,
    //         answerCollection,
    //         "questionId_index",
    //         "key",
    //         ["questionId"]
    //     ),
    // ]);

    // console.log("Answer indexes created");
}

