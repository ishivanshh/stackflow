import { Account, Client, type Models } from "node-appwrite";
import type { NextRequest } from "next/server";
import env from "@/app/env";

export async function getAuthenticatedUser(request: NextRequest): Promise<Models.User<Models.Preferences>> {
    const authorization = request.headers.get("authorization");
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
        throw new Error("Authentication required");
    }

    const client = new Client()
        .setEndpoint(env.appwrite.endpoint)
        .setProject(env.appwrite.projectId)
        .setJWT(token);

    return new Account(client).get<Models.Preferences>();
}