
import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { tablesDB } from "./config";

export default async function createVoteTable() {

    let tableCreated = false;

    try {
        await tablesDB.getTable(db, voteCollection);
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
            voteCollection,
            voteCollection,
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
        console.log("Vote table already exists");
        return;
    }

    console.log("Vote table created");

    // Create columns
    await Promise.all([

        // Type of entity being voted on
        // "question" or "answer"
        tablesDB.createVarcharColumn(
            db,
            voteCollection,
            "type",
            20,
            true
        ),

        // ID of the question or answer
        tablesDB.createVarcharColumn(
            db,
            voteCollection,
            "typeId",
            50,
            true
        ),

        // User who voted
        tablesDB.createVarcharColumn(
            db,
            voteCollection,
            "votedById",
            50,
            true
        ),

        // "upvoted" or "downvoted"
        tablesDB.createVarcharColumn(
            db,
            voteCollection,
            "voteStatus",
            20,
            true
        ),
    ]);

    console.log("Vote columns created");

    // Create indexes
}
