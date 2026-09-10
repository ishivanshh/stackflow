import { Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { tablesDB } from "./config";

export default async function getOrCreateCommentTable() {

    try {

        await tablesDB.getTable(
            db,
            commentCollection
        );

        console.log("Comment table already exists");

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
            commentCollection,
            commentCollection,
            [
                Permission.read("any"),
                Permission.create("users"),
                Permission.update("users"),
                Permission.delete("users"),
            ]
        );

        console.log("Comment table created");

        // create columns...
        await Promise.all([

        // Comment content
        tablesDB.createTextColumn(
            db,
            commentCollection,
            "content",
            true
        ),

        // Author ID
        tablesDB.createVarcharColumn(
            db,
            commentCollection,
            "authorId",
            50,
            true
        ),

        // Question ID
        tablesDB.createVarcharColumn(
            db,
            commentCollection,
            "questionId",
            50,
            false
        ),

        // Answer ID
        tablesDB.createVarcharColumn(
            db,
            commentCollection,
            "answerId",
            50,
            false
        ),
    ]);

    console.log("Comment columns created");

    }
}