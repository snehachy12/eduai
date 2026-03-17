// components/layout/navbar.tsx
"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Sun, Moon, Monitor, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  title?: string;
  role: "teacher" | "parent";
  onRoleChange: (role: "teacher" | "parent") => void;
}

export function Navbar({ title = "Dashboard", role, onRoleChange }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const NOTIFICATIONS = [
    { id: 1, text: "Vikram Singh — Critical attendance alert", time: "5m ago", type: "danger", read: false },
    { id: 2, text: "New message from Mrs. Patel", time: "12m ago", type: "primary", read: false },
    { id: 3, text: "AI insight: Class avg improved by 3%", time: "1h ago", type: "success", read: true },
    { id: 4, text: "Assignment 'Lab Report' due tomorrow", time: "2h ago", type: "warning", read: true },
  ];

  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const typeColors: Record<string, string> = {
    danger: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    primary: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-5 gap-4 flex-shrink-0 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 flex-1 max-w-xs">
        <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search students, assignments..."
          className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 w-full"
          aria-label="Search"
        />
      </div>

      {/* Page title */}
      <h1 className="text-base font-semibold text-gray-900 dark:text-white hidden sm:block flex-1">{title}</h1>

      {/* Role toggle */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {(["teacher", "parent"] as const).map((r) => (
          <button
            key={r}
            onClick={() => onRoleChange(r)}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold transition-all capitalize",
              role === r ? "bg-primary text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
          className="relative w-8 h-8 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center notif-pulse">{unread}</span>
          )}
        </button>
        <AnimatePresence>
          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
                <span className="text-xs text-primary cursor-pointer">Mark all read</span>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className={cn("px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors", !n.read && "bg-indigo-50/50 dark:bg-indigo-900/10")}>
                  <div className="flex items-start gap-2.5">
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                    {n.read && <div className="w-1.5 h-1.5 flex-shrink-0" />}
                    <div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark")}
        className="w-8 h-8 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : theme === "light" ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
          className="flex items-center gap-2 cursor-pointer group"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold">SK</div>
          <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors hidden sm:block" />
        </button>
        <AnimatePresence>
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Sarah Kumar</div>
                <div className="text-xs text-gray-400">sarah.kumar@school.edu</div>
              </div>
              {[
                { icon: User, label: "My Profile" },
                { icon: Settings, label: "Settings" },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <LogOut className="w-4 h-4" />Log out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
