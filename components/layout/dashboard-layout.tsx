// components/layout/dashboard-layout.tsx
"use client";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [role, setRole] = useState<"teacher" | "parent">("teacher");

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar title={title} role={role} onRoleChange={setRole} />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-5 lg:p-6 max-w-[1400px] mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
