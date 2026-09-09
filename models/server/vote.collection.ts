
import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { tablesDB } from "./config";

export default async function createVoteTable() {

    // Create table
    await tablesDB.createTable(
        db,
        voteCollection,
        voteCollection,
        [
            Permission.read("any"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]
    );

    console.log("Vote table created");

    // Create columns
    await Promise.all([

        // User who voted
        tablesDB.createVarcharColumn(
            db,
            voteCollection,
            "userId",
            50,
            true
        ),

        // Question being voted on
        tablesDB.createVarcharColumn(
            db,
            voteCollection,
            "questionId",
            50,
            false
        ),

        // Answer being voted on
        tablesDB.createVarcharColumn(
            db,
            voteCollection,
            "answerId",
            50,
            false
        ),

        // 1 = upvote
        // -1 = downvote
        tablesDB.createIntegerColumn(
            db,
            voteCollection,
            "value",
            true,
            -1,
            1
        ),
    ]);

    console.log("Vote columns created");

    // Create indexes
    // await Promise.all([

    //     // Find votes made by a user
    //     tablesDB.createIndex(
    //         db,
    //         voteCollection,
    //         "userId_index",
    //         "key",
    //         ["userId"]
    //     ),

    //     // Find votes for a question
    //     tablesDB.createIndex(
    //         db,
    //         voteCollection,
    //         "questionId_index",
    //         "key",
    //         ["questionId"]
    //     ),

    //     // Find votes for an answer
    //     tablesDB.createIndex(
    //         db,
    //         voteCollection,
    //         "answerId_index",
    //         "key",
    //         ["answerId"]
    //     ),

    //     // Useful for checking whether a user
    //     // has already voted on a question
    //     tablesDB.createIndex(
    //         db,
    //         voteCollection,
    //         "user_question_index",
    //         "key",
    //         ["userId", "questionId"]
    //     ),

    //     // Useful for checking whether a user
    //     // has already voted on an answer
    //     tablesDB.createIndex(
    //         db,
    //         voteCollection,
    //         "user_answer_index",
    //         "key",
    //         ["userId", "answerId"]
    //     ),
    // ]);

    // console.log("Vote indexes created");
}
