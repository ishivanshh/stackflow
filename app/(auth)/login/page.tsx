"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Meteors } from "@/components/ui/meteors"
function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [formData, setFormData] = React.useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!formData.email || !formData.password){
            setError("Please enter your email and password.");
            return;
        }

        setIsLoading(true);
        setError("");

        const loginResponse = await login(formData.email, formData.password);
        if(loginResponse.error){
            setError(loginResponse.error.message);
        } else {
            router.replace(searchParams.get("next") || "/questions/ask");
        }

        setIsLoading(false);
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-4 py-28 text-white">
            <Meteors number={50} />
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
                        <p className="mt-2 text-sm text-zinc-500">Enter your details to sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}
                        <label className="block text-sm font-medium text-zinc-300" htmlFor="email">
                            Email
                            <input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500" />
                        </label>
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-sm font-medium text-zinc-300" htmlFor="password">Password</label>
                                <a href="mailto:hello@codeflow.dev?subject=Password%20reset" className="text-xs text-zinc-500 transition hover:text-white">Forgot password?</a>
                            </div>
                            <input id="password" name="password" type="password" placeholder="At least 8 characters" value={formData.password} onChange={handleChange} required className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-medium text-white transition hover:text-zinc-300">Create account</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default LoginPage;
