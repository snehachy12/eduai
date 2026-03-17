// components/dashboard/activity-feed.tsx
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ACTIVITIES = [
  { id: 1, text: 'Assignment "Chapter 5 Math" submitted by Riya Mehta', time: "10 mins ago", color: "bg-primary" },
  { id: 2, text: "Arjun Kumar marked absent — 3rd time this week", time: "1 hour ago", color: "bg-amber-400" },
  { id: 3, text: "AI Alert: Vikram Singh attendance critically low (61%)", time: "2 hours ago", color: "bg-red-400" },
  { id: 4, text: "Parent message from Mrs. Patel — replied", time: "3 hours ago", color: "bg-emerald-400" },
  { id: 5, text: "Science test results uploaded for Grade 8A", time: "Yesterday", color: "bg-purple-400" },
  { id: 6, text: "Neha Patel completed all 22 assignments this term", time: "Yesterday", color: "bg-emerald-400" },
];

export function ActivityFeed() {
  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
        <button className="text-xs text-primary font-medium hover:underline">View all</button>
      </div>
      <div className="space-y-0">
        {ACTIVITIES.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0"
          >
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5">
              <div className={cn("w-2 h-2 rounded-full", item.color)} />
              {i < ACTIVITIES.length - 1 && <div className="w-px flex-1 min-h-[20px] bg-gray-100 dark:bg-gray-800" />}
            </div>
            <div className="flex-1 pb-1">
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{item.text}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
