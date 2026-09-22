"use client";

import Link from "next/link";
import { ArrowLeft, ImagePlus, LoaderCircle, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import RTE from "@/components/RTE";
import { useAuthStore } from "@/store/Auth";
import Footer from "@/app/components/Footer";
import { ID } from "appwrite";
import { storage } from "@/models/client/config";
import { attachmentBucket } from "@/models/name";

const inputClassName =
    "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/10";

export default function WriteBlogPage() {
    const router = useRouter();
    const jwt = useAuthStore(state => state.jwt);
    const user = useAuthStore(state => state.user);
    const [title, setTitle] = React.useState("");
    const [subheading, setSubheading] = React.useState("");
    const [content, setContent] = React.useState("");
    const [coverFile, setCoverFile] = React.useState<File | null>(null);
    const [coverPreview, setCoverPreview] = React.useState("");
    const [tags, setTags] = React.useState("");
    const [error, setError] = React.useState("");
    const [saving, setSaving] = React.useState<"published" | "draft" | null>(null);

    const submit = async (status: "published" | "draft") => {
        if (!title.trim() || !content.trim()) {
            setError("Add a title and some content before saving.");
            return;
        }

        if (!jwt || !user) {
            setError("Your session has expired. Please sign in again.");
            return;
        }

        setSaving(status);
        setError("");

        try {
            let coverImage = "";
            if (coverFile) {
                const storageSetup = await fetch("/api/storage/ensure", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                if (!storageSetup.ok) {
                    const setupError = await storageSetup.json();
                    throw new Error(setupError.error || "Unable to prepare image storage");
                }

                const uploadedFile = await storage.createFile(attachmentBucket, ID.unique(), coverFile);
                coverImage = storage.getFileView(attachmentBucket, uploadedFile.$id).toString();
            }

            const response = await fetch("/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    extraContent: subheading,
                    ...(coverImage ? { coverImage } : {}),
                    tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
                    status,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Unable to save blog");

            router.push(`/blogs/${data.slug}`);
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Unable to save blog");
        } finally {
            setSaving(null);
        }
    };

    return (
        <>
            <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[80rem]">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <Link href="/blogs" className="mb-5 inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-orange-300">
                            <ArrowLeft className="size-4" />
                            Back to blogs
                        </Link>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">Writer&apos;s room</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Make something worth reading.</h1>
                    </div>
                    <span className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-500 sm:inline-flex">Drafts are private</span>
                </div>

                <form
                    onSubmit={event => {
                        event.preventDefault();
                        void submit("published");
                    }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 shadow-2xl shadow-black/30"
                >
                    <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-12">
                        <div className="space-y-8">
                            <div>
                                <label htmlFor="title" className="mb-2 block text-sm font-medium text-neutral-200">Title</label>
                                <input
                                    id="title"
                                    value={title}
                                    onChange={event => setTitle(event.target.value)}
                                    placeholder="A clear, memorable title"
                                    className="w-full bg-transparent text-3xl font-semibold tracking-tight text-white outline-none placeholder:text-neutral-700 sm:text-5xl"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="subheading" className="mb-2 block text-sm font-medium text-neutral-200">Subheading</label>
                                <input
                                    id="subheading"
                                    value={subheading}
                                    onChange={event => setSubheading(event.target.value)}
                                    placeholder="Give readers a reason to keep going"
                                    className={inputClassName}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-200">Content</label>
                                <div className="overflow-hidden rounded-xl border border-white/10 bg-white text-black [&_.w-md-editor]:!min-h-[360px] [&_.w-md-editor-text]:!min-h-[360px]">
                                    <RTE
                                        value={content}
                                        onChange={(value: string | undefined) => setContent(value || "")}
                                        height={360}
                                        preview="edit"
                                    />
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
                            <div>
                                <label htmlFor="coverImage" className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-200">
                                    <ImagePlus className="size-4 text-orange-400" />
                                    Cover picture
                                </label>
                                <input
                                    id="coverImage"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    onChange={event => {
                                        const file = event.target.files?.[0] || null;
                                        setCoverFile(file);
                                        setCoverPreview(file ? URL.createObjectURL(file) : "");
                                    }}
                                    className={inputClassName}
                                />
                                <p className="mt-2 text-xs leading-5 text-neutral-600">PNG, JPG, WEBP, or GIF. The file is uploaded to Appwrite Storage.</p>
                                {coverPreview && (
                                    <div
                                        className="mt-4 aspect-video overflow-hidden rounded-xl border border-white/10 bg-neutral-900 bg-cover bg-center"
                                        style={{ backgroundImage: `url("${coverPreview}")` }}
                                        role="img"
                                        aria-label="Cover preview"
                                    >
                                        <span className="sr-only">Cover preview</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="tags" className="mb-2 block text-sm font-medium text-neutral-200">Tags</label>
                                <input
                                    id="tags"
                                    value={tags}
                                    onChange={event => setTags(event.target.value)}
                                    placeholder="nextjs, appwrite, javascript"
                                    className={inputClassName}
                                />
                                <p className="mt-2 text-xs leading-5 text-neutral-600">Separate tags with commas.</p>
                            </div>

                            <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-4 text-sm leading-6 text-neutral-400">
                                <p className="font-medium text-orange-300">A note before you publish</p>
                                <p className="mt-1">Published posts are visible to everyone. Drafts stay visible only to you.</p>
                            </div>
                        </aside>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
                        <p role="alert" className="min-h-5 text-sm text-red-400">{error}</p>
                        <div className="flex flex-col-reverse gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => void submit("draft")}
                                disabled={saving !== null}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-neutral-200 transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving === "draft" ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Save draft
                            </button>
                            <button
                                type="submit"
                                disabled={saving !== null}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving === "published" ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
                                Publish blog
                            </button>
                        </div>
                    </div>
                </form>
                </div>
            </main>
            <Footer />
        </>
    );
}