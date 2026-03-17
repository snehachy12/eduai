// components/ui/stat-card.tsx
"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  iconBg: string;
  delay?: number;
}

export function StatCard({ label, value, change, trend, icon, iconBg, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="stat-card"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg)}>{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{value}</div>
      {change && (
        <div className={cn("flex items-center gap-1 text-xs font-medium",
          trend === "up" ? "text-emerald-600 dark:text-emerald-400" :
          trend === "down" ? "text-red-500 dark:text-red-400" :
          "text-gray-400"
        )}>
          {trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> :
           trend === "down" ? <TrendingDown className="w-3.5 h-3.5" /> :
           <Minus className="w-3.5 h-3.5" />}
          {change}
        </div>
      )}
    </motion.div>
  );
}
