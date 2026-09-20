"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/store/Auth";


function RegisterPage(){
    const { createAccount, login } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // collection of data 
        const formData = new FormData(e.currentTarget)
        const firstname = formData.get("firstname");
        const lastname = formData.get("lastname");
        const email = formData.get("email");
        const password = formData.get("password");

        if(!firstname || !lastname || !email || !password){
            setError("Please fill out all the required fields.");
            return;
        }
        if (password.toString().length < 8) {
            setError("Your password must be at least 8 characters.");
            return;
        }

        setIsLoading(true)
        setError("")

        const response = await createAccount(
            `${firstname} ${lastname}`,
            email?.toString(),
            password?.toString()
        )

        if(response.error){
            setError(response.error!.message)
        } else {
            const loginResponse = await login(email.toString() , password.toString())

            if(loginResponse.error){
                setError(loginResponse.error!.message)
            } else {
                router.replace("/questions/ask");
            }
        }

        setIsLoading(() => false)


    }



    return (
        <main className="min-h-screen bg-[#10161d] text-[#e7ebee]">
            <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1.1fr_0.9fr]">
                <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:order-1">
                    <div className="w-full max-w-md">
                        <Link href="/" className="mb-12 inline-flex items-center gap-3 text-lg font-bold">
                            <span className="h-3 w-3 rotate-45 rounded-[2px] bg-[#f2b705]" />
                            StackFlow
                        </Link>
                        <div className="mb-8">
                            <p className="mb-3 text-sm font-medium text-[#49c9b8]">Join the conversation</p>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Create your account</h1>
                            <p className="mt-3 text-[#93a1ac]">Ask better questions. Find better answers.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="block text-sm font-medium" htmlFor="firstname">
                                    First name
                                    <input
                                        id="firstname"
                                        name="firstname"
                                        type="text"
                                        autoComplete="given-name"
                                        required
                                        placeholder="Ada"
                                        className="mt-2 w-full rounded-lg border border-[#2a3540] bg-[#161e27] px-4 py-3 text-[#e7ebee] outline-none transition placeholder:text-[#65727d] focus:border-[#49c9b8] focus:ring-2 focus:ring-[#49c9b8]/20"
                                    />
                                </label>
                                <label className="block text-sm font-medium" htmlFor="lastname">
                                    Last name
                                    <input
                                        id="lastname"
                                        name="lastname"
                                        type="text"
                                        autoComplete="family-name"
                                        required
                                        placeholder="Lovelace"
                                        className="mt-2 w-full rounded-lg border border-[#2a3540] bg-[#161e27] px-4 py-3 text-[#e7ebee] outline-none transition placeholder:text-[#65727d] focus:border-[#49c9b8] focus:ring-2 focus:ring-[#49c9b8]/20"
                                    />
                                </label>
                            </div>
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
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                    placeholder="At least 8 characters"
                                    className="mt-2 w-full rounded-lg border border-[#2a3540] bg-[#161e27] px-4 py-3 text-[#e7ebee] outline-none transition placeholder:text-[#65727d] focus:border-[#49c9b8] focus:ring-2 focus:ring-[#49c9b8]/20"
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-lg bg-[#f2b705] px-5 py-3 font-semibold text-[#1a1400] transition hover:bg-[#ffc61a] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? "Creating account..." : "Create account"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-[#93a1ac]">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-[#f2b705] hover:text-[#ffc61a]">
                                Log in
                            </Link>
                        </p>
                    </div>
                </section>

                <section className="order-first hidden flex-col justify-between border-r border-[#2a3540] p-10 lg:order-2 lg:flex">
                    <div className="self-end rounded-full border border-[#2a3540] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#93a1ac]">
                        Developers helping developers
                    </div>
                    <div className="self-end max-w-md">
                        <div className="mb-6 h-16 w-16 rotate-45 border border-[#f2b705]/60 bg-[#f2b705]/10" />
                        <h2 className="text-5xl font-bold leading-tight tracking-tight">Build a better answer together.</h2>
                        <p className="mt-6 leading-7 text-[#93a1ac]">
                            Find your people, share what you know, and turn the next stuck moment into a solved problem.
                        </p>
                    </div>
                    <p className="self-end text-sm text-[#93a1ac]">A place to get unstuck.</p>
                </section>
            </div>
        </main>
    )
}

export default RegisterPage;


