import "server-only";

import { ID, Permission, Query, Role, type Models } from "node-appwrite";
import { tablesDB } from "@/models/server/config";
import { blogCollection, db } from "@/models/name";
import { sampleBlogs } from "@/lib/blogSampleData";
import createBlogTable from "@/models/server/blog.collection";
import slugify from "@/utils/slugify";
import { serializeBlogTags } from "@/utils/blogTags";
import type { Blog, BlogInput, BlogStatus, BlogUpdateInput } from "@/types/blog";

const blogTable = blogCollection;

export class BlogServiceError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number
    ) {
        super(message);
        this.name = "BlogServiceError";
    }
}

type BlogRow = Models.Row & Partial<Blog>;

const permissionsFor = (userId: string, status: BlogStatus) => [
    ...(status === "published" ? [Permission.read(Role.any())] : []),
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
];

async function ensureBlogTable() {
    await createBlogTable();
}

const isOwner = (blog: BlogRow, userId: string) =>
    blog.$permissions?.some(permission => permission.includes(`user:${userId}`)) ?? false;

const toBlog = (row: BlogRow): Blog => ({
    $id: row.$id,
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    content: String(row.content ?? ""),
    ...(row.coverImage ? { coverImage: String(row.coverImage) } : {}),
    ...(row.extraContent ? { extraContent: String(row.extraContent) } : {}),
    ...(row.tags ? { tags: String(row.tags) } : {}),
    status: row.status === "published" ? "published" : "draft",
    createdAt: String(row.createdAt ?? ""),
    updatedAt: String(row.updatedAt ?? ""),
    $permissions: row.$permissions,
});

const validateText = (value: string | undefined, field: string) => {
    if (!value?.trim()) {
        throw new BlogServiceError(`${field} is required`, 400);
    }
};

async function assertUniqueSlug(slug: string, ignoredId?: string) {
    const result = await tablesDB.listRows(db, blogTable, [
        Query.equal("slug", slug),
        Query.limit(2),
    ]);

    if (result.rows.some(row => row.$id !== ignoredId)) {
        throw new BlogServiceError("A blog with this slug already exists", 409);
    }
}

async function getRow(blogId: string): Promise<BlogRow> {
    await ensureBlogTable();
    try {
        return await tablesDB.getRow(db, blogTable, blogId) as BlogRow;
    } catch (error: unknown) {
        if (error && typeof error === "object" && "code" in error && error.code === 404) {
            throw new BlogServiceError("Blog not found", 404);
        }
        throw error;
    }
}

async function getOwnedRow(blogId: string, userId: string) {
    const blog = await getRow(blogId);
    if (!isOwner(blog, userId)) {
        throw new BlogServiceError("You are not allowed to modify this blog", 403);
    }
    return blog;
}

export async function createBlog(input: BlogInput, userId: string): Promise<Blog> {
    validateText(input.title, "title");
    validateText(input.content, "content");

    const status = input.status ?? "draft";
    const slug = slugify(input.slug?.trim() || input.title);
    await assertUniqueSlug(slug);

    const now = new Date().toISOString();
    const row = await tablesDB.createRow(
        db,
        blogTable,
        ID.unique(),
        {
            title: input.title.trim(),
            slug,
            content: input.content,
            ...(input.coverImage ? { coverImage: input.coverImage.trim() } : {}),
            ...(input.extraContent ? { extraContent: input.extraContent } : {}),
            ...(input.tags ? { tags: serializeBlogTags(input.tags) } : {}),
            status,
            createdAt: now,
            updatedAt: now,
        },
        permissionsFor(userId, status)
    );

    return toBlog(row as BlogRow);
}

export async function getBlogById(blogId: string, userId?: string): Promise<Blog> {
    const row = await getRow(blogId);
    if (row.status !== "published" && (!userId || !isOwner(row, userId))) {
        throw new BlogServiceError("Blog not found", 404);
    }
    return toBlog(row);
}

export async function getBlogBySlug(slug: string, userId?: string): Promise<Blog> {
    await ensureBlogTable();
    const result = await tablesDB.listRows(db, blogTable, [
        Query.equal("slug", slug),
        Query.limit(1),
    ]);
    const row = result.rows[0] as BlogRow | undefined;
    if (!row || (row.status !== "published" && (!userId || !isOwner(row, userId)))) {
        throw new BlogServiceError("Blog not found", 404);
    }
    return toBlog(row);
}

export async function getPublishedBlogs(): Promise<Blog[]> {
    await ensureBlogTable();
    const result = await tablesDB.listRows(db, blogTable, [
        Query.equal("status", "published"),
        Query.orderDesc("createdAt"),
    ]);
    return result.total === 0 ? sampleBlogs : result.rows.map(row => toBlog(row as BlogRow));
}

export async function getCurrentUserBlogs(userId: string): Promise<Blog[]> {
    await ensureBlogTable();
    const result = await tablesDB.listRows(db, blogTable, [Query.orderDesc("updatedAt")]);
    return result.rows
        .filter(row => isOwner(row as BlogRow, userId))
        .map(row => toBlog(row as BlogRow));
}

export async function updateBlog(
    blogId: string,
    input: BlogUpdateInput,
    userId: string
): Promise<Blog> {
    const existing = await getOwnedRow(blogId, userId);
    const title = input.title?.trim() || String(existing.title ?? "");
    const content = input.content ?? String(existing.content ?? "");
    const slug = slugify(input.slug?.trim() || title);
    const status = input.status ?? (existing.status === "published" ? "published" : "draft");

    validateText(title, "title");
    validateText(content, "content");
    await assertUniqueSlug(slug, blogId);

    const row = await tablesDB.updateRow(
        db,
        blogTable,
        blogId,
        {
            title,
            slug,
            content,
            ...(input.coverImage !== undefined ? { coverImage: input.coverImage } : {}),
            ...(input.extraContent !== undefined ? { extraContent: input.extraContent } : {}),
            ...(input.tags !== undefined ? { tags: serializeBlogTags(input.tags) ?? "[]" } : {}),
            status,
            createdAt: existing.createdAt,
            updatedAt: new Date().toISOString(),
        },
        permissionsFor(userId, status)
    );

    return toBlog(row as BlogRow);
}

export async function deleteBlog(blogId: string, userId: string): Promise<void> {
    await getOwnedRow(blogId, userId);
    await tablesDB.deleteRow(db, blogTable, blogId);
}

export async function publishBlog(blogId: string, userId: string): Promise<Blog> {
    return updateBlog(blogId, { status: "published" }, userId);
}

export async function saveBlogAsDraft(blogId: string, userId: string): Promise<Blog> {
    return updateBlog(blogId, { status: "draft" }, userId);
}