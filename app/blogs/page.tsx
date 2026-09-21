import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import Footer from "@/app/components/Footer";
import { getPublishedBlogs } from "@/lib/appwrite/services/blogService";
import { deserializeBlogTags } from "@/utils/blogTags";
import type { Blog } from "@/types/blog";
import { sampleBlogs } from "@/lib/blogSampleData";

const fallbackImages = [
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=85",
];

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function BlogImage({ blog, index, large = false }: { blog: Blog; index: number; large?: boolean }) {
    const image = blog.coverImage || fallbackImages[index % fallbackImages.length];

    return (
        <div
            className={`relative overflow-hidden bg-neutral-900 ${large ? "aspect-[16/10]" : "aspect-[16/9]"}`}
            style={{ backgroundImage: `url("${image}")`, backgroundPosition: "center", backgroundSize: "cover" }}
            role="img"
            aria-label={`${blog.title} cover image`}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        </div>
    );
}

function BlogMeta({ blog }: { blog: Blog }) {
    const tags = deserializeBlogTags(blog.tags).slice(0, 2);

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-neutral-500">
            <span className="font-medium text-orange-400">YOURSPACE community</span>
            <span aria-hidden="true">/</span>
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
            {tags.map(tag => (
                <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-neutral-400">
                    {tag}
                </span>
            ))}
        </div>
    );
}

function BlogCard({ blog, index, featured = false }: { blog: Blog; index: number; featured?: boolean }) {
    return (
        <article className={`group overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70 ${featured ? "lg:col-span-1" : ""}`}>
            <Link href={`/blogs/${blog.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
                <BlogImage blog={blog} index={index} large={featured} />
                <div className={`${featured ? "p-6 md:p-7" : "p-5"}`}>
                    <BlogMeta blog={blog} />
                    <h2 className={`mt-4 font-semibold tracking-tight text-white transition-colors group-hover:text-orange-300 ${featured ? "text-2xl leading-tight md:text-3xl" : "text-xl leading-snug"}`}>
                        {blog.title}
                    </h2>
                    <p className={`mt-3 line-clamp-3 text-sm leading-6 text-neutral-400 ${featured ? "md:text-base" : ""}`}>
                        {blog.content}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
                        Read story <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                </div>
            </Link>
        </article>
    );
}

export default async function BlogsPage() {
    let blogs: Blog[] = [];

    try {
        blogs = await getPublishedBlogs();
    } catch (error) {
        console.error("Unable to load published blogs:", error);
        blogs = sampleBlogs;
    }

    const featured = blogs[0];
    const latest = blogs.slice(1, 4);

    return (
        <>
            <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <header className="mb-12 flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">The community journal</p>
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Ideas worth sharing.</h1>
                            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-400 sm:text-lg">
                                Practical notes, hard-won lessons, and fresh perspectives from people building on the web.
                            </p>
                        </div>
                        <Link
                            href="/blogs/write"
                            className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                        >
                            <PenLine className="size-4" />
                            Write a blog
                        </Link>
                    </header>

                    {featured ? (
                        <>
                            <section className="grid gap-6 lg:grid-cols-3" aria-label="Featured blog">
                                <BlogCard blog={featured} index={0} featured />
                                <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
                                    {latest.map((blog, index) => (
                                        <BlogCard key={blog.$id} blog={blog} index={index + 1} />
                                    ))}
                                </div>
                            </section>

                            <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-neutral-500">Showing {Math.min(blogs.length, 4)} of {blogs.length} stories</p>
                                <nav className="flex items-center gap-2" aria-label="Blog pagination">
                                    <button aria-label="Previous page" disabled className="flex size-10 items-center justify-center rounded-full border border-white/10 text-neutral-600 disabled:cursor-not-allowed">
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    <span className="flex size-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-black" aria-current="page">1</span>
                                    <button aria-label="Next page" className="flex size-10 items-center justify-center rounded-full border border-white/10 text-neutral-300 transition hover:border-orange-400 hover:text-orange-300">
                                        <ChevronRight className="size-4" />
                                    </button>
                                </nav>
                            </div>
                        </>
                    ) : (
                        <section className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
                            <p className="text-xl font-medium text-white">The first story is waiting to be written.</p>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">Share what you have learned with the YOURSPACE community.</p>
                            <Link href="/blogs/write" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300">
                                Start writing <ArrowRight className="size-4" />
                            </Link>
                        </section>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}