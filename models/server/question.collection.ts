import { Permission } from "node-appwrite";
import { db, questionCollection } from "../name";
import { tablesDB } from "./config";

export default async function createQuestionTable() {

    // Create table
    await tablesDB.createTable(
        db,
        questionCollection,
        questionCollection,
        [
            Permission.read("any"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]
    );

    console.log("Question table created");

    // Create columns
    await Promise.all([

        // title
        tablesDB.createVarcharColumn(
            db,
            questionCollection,
            "title",
            100,
            true
        ),

        // content
        tablesDB.createTextColumn(
            db,
            questionCollection,
            "content",
            true
        ),

        // authorId
        tablesDB.createVarcharColumn(
            db,
            questionCollection,
            "authorId",
            50,
            true
        ),

        // tags
        tablesDB.createVarcharColumn(
            db,
            questionCollection,
            "tags",
            50,
            true,
        ),

        // attachmentId
        tablesDB.createVarcharColumn(
            db,
            questionCollection,
            "attachmentId",
            50,
            false
        ),
    ]);

    console.log("Question columns created");

    // Create indexes
    // await Promise.all([

    //     tablesDB.createIndex(
    //         db,
    //         questionCollection,
    //         "authorId_index",
    //         "key",
    //         ["authorId"]
    //     ),

    //     tablesDB.createIndex(
    //         db,
    //         questionCollection,
    //         "tags_index",
    //         "key",
    //         ["tags"]
    //     ),

    //     tablesDB.createIndex(
    //         db,
    //         questionCollection,
    //         "title_search",
    //         "fulltext",
    //         ["title"]
    //     ),
    // ]);

    console.log("Question indexes created");
}