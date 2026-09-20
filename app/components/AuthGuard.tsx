"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/Auth";

const publicPaths = new Set(["/login", "/register"]);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const session = useAuthStore((state) => state.session);
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = publicPaths.has(pathname);

  useEffect(() => {
    if (!hydrated) return;

    if (!session && !isPublicPath) {
      const next = pathname === "/" ? "/" : pathname;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (session && isPublicPath) {
      router.replace("/");
    }
  }, [hydrated, isPublicPath, pathname, router, session]);

  if (!hydrated || (!session && !isPublicPath)) return null;

  return children;
}