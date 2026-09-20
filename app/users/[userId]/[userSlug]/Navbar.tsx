"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
    const { userId, userSlug } = useParams<{ userId: string; userSlug: string }>();
    const pathname = usePathname();
    const profilePath = `/users/${userId}/${userSlug}`;
    const links = [
        { href: profilePath, label: "Profile" },
        { href: `${profilePath}/questions`, label: "Questions" },
        { href: `${profilePath}/answers`, label: "Answers" },
        { href: `${profilePath}/votes`, label: "Votes" },
    ];

    return (
        <nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-neutral-200 pb-2 dark:border-white/10 sm:w-40 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            {links.map(link => {
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                            isActive
                                ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10"
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default Navbar;
