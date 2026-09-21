"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/Auth";

const publicPaths = new Set(["/login", "/register"]);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const session = useAuthStore((state) => state.session);
  const verifySession = useAuthStore((state) => state.VerifySession);
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = publicPaths.has(pathname);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    verifySession().finally(() => setVerified(true));
  }, [hydrated, verifySession]);

  useEffect(() => {
    if (!hydrated || !verified) return;

    if (!session && !isPublicPath) {
      const next = pathname === "/" ? "/" : pathname;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (session && isPublicPath) {
      router.replace("/");
    }
  }, [hydrated, isPublicPath, pathname, router, session, verified]);

  if (!hydrated || !verified || (!session && !isPublicPath)) return null;

  return children;
}