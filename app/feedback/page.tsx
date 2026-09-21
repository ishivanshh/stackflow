"use client";

import Link from "next/link";
import { ArrowLeft, Check, Send } from "lucide-react";
import React from "react";

const fieldClassName =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/10";

export default function FeedbackPage() {
    const [submitted, setSubmitted] = React.useState(false);
    const [rating, setRating] = React.useState(0);

    if (submitted) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black px-4 pb-24 pt-32 text-white">
                <div className="w-full max-w-xl rounded-2xl border border-orange-400/25 bg-neutral-950 p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-400 text-black">
                        <Check className="size-7" />
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">Feedback received</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight">Thank you for helping us improve.</h1>
                    <p className="mt-4 text-sm leading-6 text-neutral-400">Your thoughts are now part of the next version of YOURSPACE.</p>
                    <Link href="/" className="mt-8 inline-flex rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400">Return home</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black px-4 pb-24 pt-32 text-white sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-orange-300">
                    <ArrowLeft className="size-4" />
                    Back to YOURSPACE
                </Link>
                <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-950/80 p-6 shadow-2xl shadow-black/30 sm:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">Help shape the next release</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Tell us what you think.</h1>
                    <p className="mt-4 text-sm leading-6 text-neutral-400">Three quick answers are enough. We read every response.</p>

                    <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }} className="mt-10 space-y-7">
                        <div>
                            <label htmlFor="topic" className="text-sm font-medium text-neutral-200">1. What is your feedback topic or short description?</label>
                            <input id="topic" required className={fieldClassName} placeholder="For example: blog writing experience" />
                        </div>
                        <div>
                            <label htmlFor="details" className="text-sm font-medium text-neutral-200">2. Tell us more about it.</label>
                            <textarea id="details" required rows={5} className={`${fieldClassName} resize-y`} placeholder="What worked, what felt difficult, or what should we change?" />
                        </div>
                        <fieldset>
                            <legend className="text-sm font-medium text-neutral-200">3. How would you rate YOURSPACE out of 5?</legend>
                            <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Rating out of five">
                                {[1, 2, 3, 4, 5].map(value => (
                                    <button key={value} type="button" aria-label={`${value} out of 5`} aria-pressed={rating === value} onClick={() => setRating(value)} className={`flex size-11 items-center justify-center rounded-xl border text-sm font-semibold transition ${rating === value ? "border-orange-400 bg-orange-500 text-black" : "border-white/10 text-neutral-400 hover:border-orange-400/60 hover:text-orange-300"}`}>
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                        <button type="submit" disabled={!rating} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40">
                            <Send className="size-4" />
                            Submit feedback
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}