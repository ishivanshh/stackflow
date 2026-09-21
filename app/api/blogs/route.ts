import { NextRequest, NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";
import { getAuthenticatedUser } from "@/lib/appwrite/blogAuth";
import {
    BlogServiceError,
    createBlog,
    deleteBlog,
    getBlogById,
    getBlogBySlug,
    getCurrentUserBlogs,
    getPublishedBlogs,
    publishBlog,
    saveBlogAsDraft,
    updateBlog,
} from "@/lib/appwrite/services/blogService";
import type { BlogInput, BlogUpdateInput } from "@/types/blog";

function errorResponse(error: unknown) {
    if (error instanceof BlogServiceError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof AppwriteException) {
        return NextResponse.json({ error: error.message }, { status: error.code || 500 });
    }
    if (error instanceof Error && error.message === "Authentication required") {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Blog API error:", error);
    return NextResponse.json({ error: "An unexpected blog error occurred" }, { status: 500 });
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const id = searchParams.get("id");
        const slug = searchParams.get("slug");
        const mine = searchParams.get("mine") === "true";

        if (id || slug || mine) {
            const user = mine || !id && !slug && request.headers.has("authorization")
                ? await getAuthenticatedUser(request)
                : undefined;
            if (mine) return NextResponse.json(await getCurrentUserBlogs(user!.$id));
            if (id) return NextResponse.json(await getBlogById(id, user?.$id));
            return NextResponse.json(await getBlogBySlug(slug!, user?.$id));
        }

        return NextResponse.json(await getPublishedBlogs());
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        const body = await request.json() as BlogInput;
        return NextResponse.json(await createBlog(body, user.$id), { status: 201 });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        const body = await request.json() as BlogUpdateInput & { blogId?: string; action?: "publish" | "draft" };
        if (!body.blogId) return NextResponse.json({ error: "blogId is required" }, { status: 400 });

        if (body.action === "publish") return NextResponse.json(await publishBlog(body.blogId, user.$id));
        if (body.action === "draft") return NextResponse.json(await saveBlogAsDraft(body.blogId, user.$id));
        const { blogId, ...input } = body;
        return NextResponse.json(await updateBlog(blogId, input, user.$id));
    } catch (error) {
        return errorResponse(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        const body = await request.json() as { blogId?: string };
        if (!body.blogId) return NextResponse.json({ error: "blogId is required" }, { status: 400 });
        await deleteBlog(body.blogId, user.$id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return errorResponse(error);
    }
}