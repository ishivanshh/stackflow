import Link from "next/link";
import { MagicCard } from "@/components/magicui/magic-card";

export default function AuthShell({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow: string;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#071017] px-5 py-28 text-[#e7ebee] sm:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(73,201,184,0.14),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(242,183,5,0.1),transparent_30%)]" />
            <div className="relative mx-auto grid min-h-[calc(100vh-14rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
                <section className="hidden lg:block">
                    <Link href="/" className="inline-flex items-center gap-3 text-xl font-bold tracking-tight">
                        <span className="h-3 w-3 rotate-45 rounded-[2px] bg-[#f2b705] shadow-[0_0_22px_rgba(242,183,5,0.6)]" />
                        Stack<span className="text-[#49c9b8]">Flow</span>
                    </Link>
                    <div className="mt-24 max-w-xl">
                        <p className="mb-5 text-sm uppercase tracking-[0.28em] text-[#49c9b8]">{eyebrow}</p>
                        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white xl:text-7xl">
                            {title}
                        </h1>
                        <p className="mt-7 max-w-md text-lg leading-8 text-[#91a0aa]">{description}</p>
                    </div>
                    <div className="mt-24 flex items-center gap-3 text-sm text-[#71808b]">
                        <span className="h-px w-12 bg-[#f2b705]" />
                        Ask clearly. Answer generously.
                    </div>
                </section>

                <section>
                    <Link href="/" className="mb-10 inline-flex items-center gap-3 text-lg font-bold lg:hidden">
                        <span className="h-3 w-3 rotate-45 rounded-[2px] bg-[#f2b705]" />
                        Stack<span className="text-[#49c9b8]">Flow</span>
                    </Link>
                    <MagicCard
                        className="rounded-3xl p-8 sm:p-10"
                        borderColor="rgba(73,201,184,0.65)"
                        spotlightColor="rgba(73,201,184,0.12)"
                    >
                        {children}
                    </MagicCard>
                </section>
            </div>
        </main>
    );
}