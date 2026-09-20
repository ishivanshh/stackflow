"use client";

import QuestionForm from "@/components/QuestionForm";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function AskQuestionPage() {
    const { hydrated, user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if (hydrated && !user) {
            router.replace("/login?next=/questions/ask");
        }
    }, [hydrated, user, router]);

    if (!hydrated || !user) return null;

    return (
        <main className="block pb-20 pt-32">
            <div className="container mx-auto px-4">
                <h1 className="mb-10 mt-4 text-2xl">Ask a public question</h1>
                <div className="flex flex-wrap md:flex-row-reverse">
                    <div className="w-full md:w-1/3" />
                    <div className="w-full md:w-2/3">
                        <QuestionForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
