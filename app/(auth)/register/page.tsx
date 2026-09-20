"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/store/Auth";
import { Meteors } from "@/components/ui/meteors"

function RegisterPage(){
    const { createAccount, login } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!formData.firstName || !formData.lastName || !formData.email || !formData.password){
            setError("Please fill out all the required fields.");
            return;
        }
        if (formData.password.length < 8) {
            setError("Your password must be at least 8 characters.");
            return;
        }

        setIsLoading(true)
        setError("")

        const response = await createAccount(
            `${formData.firstName} ${formData.lastName}`,
            formData.email,
            formData.password
        )

        if(response.error){
            setError(response.error!.message)
        } else {
            const loginResponse = await login(formData.email, formData.password)

            if(loginResponse.error){
                setError(loginResponse.error!.message)
            } else {
                router.replace("/questions/ask");
            }
        }

        setIsLoading(() => false)


    }



    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-4 py-28 text-white">
              <Meteors number={50} />
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight">Create an account</h1>
                        <p className="mt-2 text-sm text-zinc-500">Enter your details to create your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block text-sm font-medium text-zinc-300" htmlFor="firstName">
                                First name
                                <input id="firstName" name="firstName" type="text" placeholder="Shivansh" value={formData.firstName} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500" />
                            </label>
                            <label className="block text-sm font-medium text-zinc-300" htmlFor="lastName">
                                Last name
                                <input id="lastName" name="lastName" type="text" placeholder="Saxena" value={formData.lastName} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500" />
                            </label>
                        </div>
                        <label className="block text-sm font-medium text-zinc-300" htmlFor="email">
                            Email
                            <input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500" />
                        </label>
                        <label className="block text-sm font-medium text-zinc-300" htmlFor="password">
                            Password
                            <input id="password" name="password" type="password" placeholder="At least 8 characters" value={formData.password} onChange={handleChange} required minLength={8} className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500" />
                        </label>
                        <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
                            {isLoading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-white hover:text-zinc-300">Login in</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default RegisterPage;


