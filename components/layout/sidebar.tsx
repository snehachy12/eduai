// components/layout/sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Calendar, BookOpen, Brain,
  MessageCircle, Settings, ChevronRight, GraduationCap, User
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { section: "Main", items: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "students", label: "Students", icon: Users, href: "/students" },
    { id: "profile", label: "Student Profile", icon: User, href: "/profile" },
  ]},
  { section: "Academics", items: [
    { id: "attendance", label: "Attendance", icon: Calendar, href: "/attendance" },
    { id: "assignments", label: "Assignments", icon: BookOpen, href: "/assignments", badge: 4 },
    { id: "ai-insights", label: "AI Insights", icon: Brain, href: "/ai-insights" },
  ]},
  { section: "Communication", items: [
    { id: "messages", label: "Messages", icon: MessageCircle, href: "/messages", badge: 2 },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ]},
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300",
      collapsed ? "w-[68px]" : "w-[220px]"
    )}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-4 h-4" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">EduAI</div>
              <div className="text-[10px] text-gray-400 leading-tight">Student Evaluation</div>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-4">
        {NAV_ITEMS.map(({ section, items }) => (
          <div key={section}>
            {!collapsed && (
              <div className="px-2 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{section}</div>
            )}
            <div className="space-y-0.5">
              {items.map(({ id, label, icon: Icon, href, badge }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link key={id} href={href} title={collapsed ? label : undefined}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 relative cursor-pointer",
                        active
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-white" : "text-gray-400 dark:text-gray-500")} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{label}</span>
                          {badge && (
                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center", active ? "bg-white/20 text-white" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400")}>
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && badge && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{badge}</span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-2.5 py-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">SK</div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">Sarah Kumar</div>
              <div className="text-[10px] text-gray-400 truncate">Class Teacher · 8A</div>
            </div>
          )}
          {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />}
        </div>
      </div>
    </aside>
  );
}
