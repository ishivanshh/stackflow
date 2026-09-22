import { NextRequest, NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";
import { getAuthenticatedUser } from "@/lib/appwrite/blogAuth";
import createStorageBuckets from "@/models/server/storage.collection";

export async function POST(request: NextRequest) {
    try {
        await getAuthenticatedUser(request);
        await createStorageBuckets();
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message === "Authentication required") {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        if (error instanceof AppwriteException) {
            return NextResponse.json({ error: error.message }, { status: error.code || 500 });
        }
        console.error("Storage setup error:", error);
        return NextResponse.json({ error: "Unable to prepare storage" }, { status: 500 });
    }
}