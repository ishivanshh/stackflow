'use client';

import { useState } from "react";
import Link from "next/link";
import { MagicCard } from "@/components/ui/magic-card"


const links = {
  Community: [
    { label: "Questions", href: "/questions" },
    { label: "Ask a question", href: "/questions/ask" },
    { label: "React questions", href: "/questions?tag=Reactjs" },
    { label: "Home", href: "/" },
  ],
  Project: [
    { label: "Source on GitHub", href: "https://github.com/shivansh-saxena/stackflow" },
    { label: "Open issues", href: "https://github.com/shivansh-saxena/stackflow/issues" },
    { label: "Contributing guide", href: "https://github.com/shivansh-saxena/stackflow#contributing" },
    { label: "Code of conduct", href: "mailto:hello@codeflow.dev?subject=Code%20of%20conduct" },
  ],
  Support: [
    { label: "Read the README", href: "https://github.com/shivansh-saxena/stackflow#readme" },
    { label: "Report a bug", href: "mailto:hello@codeflow.dev?subject=Bug%20report" },
    { label: "Contact", href: "mailto:hello@codeflow.dev" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!valid || status === "sending") return;
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 400));
    setStatus("done");
    setEmail("");
  };

  return (
    <footer className="w-full bg-black text-neutral-400">
      <div className="mx-auto max-w-7xl px-8 pb-10 pt-16">
        {/* Contribute card */}
        <MagicCard>
        <div className="rounded-3xl bg-neutral-950/80 p-8 ring-1 ring-white/10 md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Yourspace is built by people like you.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-400">
                Every answered question, fixed bug, and reviewed pull request comes
                from someone who decided to help. Leave your email and we&apos;ll send
                you a handful of good first issues to start with — nothing else.
              </p>
            </div>

            <div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="w-full rounded-xl bg-black px-4 py-3 text-[15px] text-white placeholder-neutral-600 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!valid || status === "sending"}
                  className="shrink-0 rounded-xl bg-orange-500 px-6 py-3 text-[15px] font-semibold text-black transition hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === "sending" ? "Sending..." : "Count me in"}
                </button>
              </div>

              <p
                className={`mt-3 text-sm ${
                  status === "error" ? "text-red-400" : "text-neutral-500"
                }`}
              >
                {status === "done"
                  ? "Thanks, we will reach you shortly."
                  : status === "error"
                  ? "That didn't go through. Try again in a moment."
                  : "One email when there's something worth your time. Unsubscribe anytime."}
              </p>
            </div>
          </div>
        </div>
        </MagicCard>

        {/* Link columns */}
        <div className="mt-24 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              YOUR<span className="text-orange-500">SPACE</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
              A question board for developers who&apos;d rather explain it once,
              properly.
            </p>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <nav key={group} aria-label={group}>
              <h3 className="text-sm font-semibold text-white">{group}</h3>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith("/") ? (
                      <Link
                        href={item.href}
                        className="text-sm text-neutral-400 transition hover:text-orange-500"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                        className="text-sm text-neutral-400 transition hover:text-orange-500"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} YOURSPACE. Write whatever you want.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="mailto:hello@codeflow.dev?subject=Privacy%20question" className="text-neutral-500 hover:text-orange-500">
              Privacy
            </a>
            <a href="mailto:hello@codeflow.dev?subject=Terms%20question" className="text-neutral-500 hover:text-orange-500">
              Terms
            </a>
            <a
              href="mailto:shivanshsaxena248@gmail.com"
              className="text-neutral-500 hover:text-orange-500"
            >
              Mail
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}