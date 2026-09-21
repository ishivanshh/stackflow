import { Permission } from "node-appwrite";
import { blogCollection, db } from "../name";
import { tablesDB } from "./config";

let setupPromise: Promise<void> | null = null;

async function setupBlogTable() {
    try {
        await tablesDB.getTable(db, blogCollection);
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
            blogCollection,
            blogCollection,
            [Permission.read("users")]
        );
        console.log("Blog table created");
    }

    const columns = [
        ["title", () => tablesDB.createTextColumn(db, blogCollection, "title", true)],
        ["slug", () => tablesDB.createTextColumn(db, blogCollection, "slug", true)],
        ["content", () => tablesDB.createTextColumn(db, blogCollection, "content", true)],
        ["coverImage", () => tablesDB.createTextColumn(db, blogCollection, "coverImage", false)],
        ["extraContent", () => tablesDB.createTextColumn(db, blogCollection, "extraContent", false)],
        ["tags", () => tablesDB.createTextColumn(db, blogCollection, "tags", false)],
        ["status", () => tablesDB.createTextColumn(db, blogCollection, "status", true)],
        ["createdAt", () => tablesDB.createDatetimeColumn(db, blogCollection, "createdAt", true)],
        ["updatedAt", () => tablesDB.createDatetimeColumn(db, blogCollection, "updatedAt", true)],
    ] as const;

    for (const [columnId, createColumn] of columns) {
        try {
            await tablesDB.getColumn(db, blogCollection, columnId);
        } catch (error: unknown) {
            if (
                typeof error !== "object" ||
                error === null ||
                !("code" in error) ||
                error.code !== 404
            ) {
                throw error;
            }
            await createColumn();
        }
    }

    console.log("Blog table and columns created");
}

export default function createBlogTable() {
    setupPromise ??= setupBlogTable();
    return setupPromise;
}