// app/students/page.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, Grid, List } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StudentCard } from "@/components/dashboard/student-card";
import { MOCK_STUDENTS } from "@/data/mock";
import { getStatusBadgeClass, getStatusLabel, getAttendanceColor, getScoreColor, cn } from "@/lib/utils";
import type { StudentStatus } from "@/types";

const FILTERS: { label: string; value: StudentStatus | "all" }[] = [
  { label: "All Students", value: "all" },
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
  { label: "At Risk", value: "at-risk" },
  { label: "Critical", value: "critical" },
];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StudentStatus | "all">("all");
  const [view, setView] = useState<"grid" | "list">("list");

  const filtered = MOCK_STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.section.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout title="Students">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">All Students</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{MOCK_STUDENTS.length} students across 6 sections</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)} className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border", filter === f.value ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary/50")}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <button onClick={() => setView("list")} className={cn("p-2 transition-colors", view === "list" ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-400")}>
              <List className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setView("grid")} className={cn("p-2 transition-colors", view === "grid" ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-400")}>
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((s, i) => <StudentCard key={s.id} student={s} index={i} />)}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card-base overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      {["Student", "Class", "Attendance", "Avg Score", "Homework", "Risk", "Status", ""].map(h => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => (
                      <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: s.avatarColor }}>{s.initials}</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</div>
                              <div className="text-[10px] text-gray-400">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-500 dark:text-gray-400">{s.section}</td>
                        <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: getAttendanceColor(s.attendance) }}>{s.attendance}%</td>
                        <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: getScoreColor(s.avgScore) }}>{s.avgScore}%</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(s.homeworkCompleted / s.homeworkTotal) * 100}%`, background: "#6366F1" }} />
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{s.homeworkCompleted}/{s.homeworkTotal}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-14 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${s.riskScore}%`, background: s.riskScore >= 70 ? "#EF4444" : s.riskScore >= 40 ? "#F59E0B" : "#10B981" }} />
                            </div>
                            <span className="text-xs text-gray-500">{s.riskScore}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn("text-xs", getStatusBadgeClass(s.status))}>{getStatusLabel(s.status)}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <a href={`/profile`} className="text-xs text-primary font-medium hover:underline whitespace-nowrap">View →</a>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-gray-400">
                  <Filter className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No students match your search</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
