export type BlogStatus = "draft" | "published";

export interface Blog {
    $id: string;
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    extraContent?: string;
    tags?: string;
    status: BlogStatus;
    createdAt: string;
    updatedAt: string;
    $permissions?: string[];
}

export interface BlogInput {
    title: string;
    content: string;
    slug?: string;
    coverImage?: string;
    extraContent?: string;
    tags?: string[];
    status?: BlogStatus;
}

export interface BlogUpdateInput {
    title?: string;
    content?: string;
    slug?: string;
    coverImage?: string;
    extraContent?: string;
    tags?: string[];
    status?: BlogStatus;
}