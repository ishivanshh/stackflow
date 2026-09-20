"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";

function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // collect data
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email");
        const password = formData.get("password");

        if(!email || !password){
            setError("Please enter your email and password.");
            return;
        }

        setIsLoading(true);
        setError("");

        const loginResponse = await login(email.toString(), password.toString());
        if(loginResponse.error){
            setError(loginResponse.error.message);
        } else {
            router.replace("/questions/ask");
        }

        setIsLoading(false);
    };

    return (
        <main className="min-h-screen bg-[#10161d] text-[#e7ebee]">
            <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[0.9fr_1.1fr]">
                <section className="hidden flex-col justify-between border-r border-[#2a3540] p-10 lg:flex">
                    <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight">
                        <span className="h-3 w-3 rotate-45 rounded-[2px] bg-[#f2b705]" />
                        StackFlow
                    </Link>
                    <div>
                        <p className="mb-5 text-sm uppercase tracking-[0.2em] text-[#49c9b8]">Welcome back</p>
                        <h1 className="max-w-md text-5xl font-bold leading-tight tracking-tight">
                            Keep the good questions moving.
                        </h1>
                        <p className="mt-6 max-w-md leading-7 text-[#93a1ac]">
                            Return to the conversations, answers, and people helping you get unstuck.
                        </p>
                    </div>
                    <p className="text-sm text-[#93a1ac]">Ask clearly. Answer generously.</p>
                </section>

                <section className="flex items-center justify-center px-5 py-12 sm:px-10">
                    <div className="w-full max-w-md">
                        <Link href="/" className="mb-12 inline-flex items-center gap-3 text-lg font-bold lg:hidden">
                            <span className="h-3 w-3 rotate-45 rounded-[2px] bg-[#f2b705]" />
                            StackFlow
                        </Link>
                        <div className="mb-8">
                            <p className="mb-3 text-sm font-medium text-[#49c9b8]">Your workspace awaits</p>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Log in to StackFlow</h2>
                            <p className="mt-3 text-[#93a1ac]">Continue where you left off.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                                    {error}
                                </div>
                            )}
                            <label className="block text-sm font-medium" htmlFor="email">
                                Email address
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="you@example.com"
                                    className="mt-2 w-full rounded-lg border border-[#2a3540] bg-[#161e27] px-4 py-3 text-[#e7ebee] outline-none transition placeholder:text-[#65727d] focus:border-[#49c9b8] focus:ring-2 focus:ring-[#49c9b8]/20"
                                />
                            </label>
                            <label className="block text-sm font-medium" htmlFor="password">
                                Password
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="Enter your password"
                                    className="mt-2 w-full rounded-lg border border-[#2a3540] bg-[#161e27] px-4 py-3 text-[#e7ebee] outline-none transition placeholder:text-[#65727d] focus:border-[#49c9b8] focus:ring-2 focus:ring-[#49c9b8]/20"
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-lg bg-[#f2b705] px-5 py-3 font-semibold text-[#1a1400] transition hover:bg-[#ffc61a] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? "Logging in..." : "Log in"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-[#93a1ac]">
                            New to StackFlow?{" "}
                            <Link href="/register" className="font-semibold text-[#f2b705] hover:text-[#ffc61a]">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default LoginPage;
