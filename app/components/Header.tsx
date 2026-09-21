"use client";
import React from "react";
import Link from "next/link";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";

export default function Header() {
    const { user } = useAuthStore();

    const navItems = [
        {
            name: "Home",
            link: "/",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Questions",
            link: "/questions",
            icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
    ];

    if (user)
        navItems.push({
            name: "Profile",
            link: `/users/${user.$id}/${slugify(user.name)}`,
            icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });
        navItems.push({
            name: "Blogs",
            link: `/blogs`,
            icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
        });

    return (
        <div className="relative w-full">
            <Link
                href="/"
                className="relative left-6 top-10 z-50 flex h-10 items-center text-lg font-semibold tracking-[0.2em] text-white"
            >
                YOURSPACE
            </Link>
            <FloatingNav navItems={navItems} />
        </div>
    );
}
