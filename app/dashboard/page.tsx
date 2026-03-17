// app/dashboard/page.tsx
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardRouter() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.replace("/login"); return; }

    const role = (session.user as any)?.role;
    if (role === "teacher") router.replace("/teacher/dashboard");
    else if (role === "parent") router.replace("/parent/dashboard");
    else router.replace("/login");
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading your dashboard...</p>
      </div>
    </div>
  );
}