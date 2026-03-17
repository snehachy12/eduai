// app/assignments/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Upload, CheckCircle, Clock, AlertCircle, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { MOCK_ASSIGNMENTS, MOCK_STUDENTS } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { AssignmentStatus } from "@/types";

const STATUS_CONFIG: Record<AssignmentStatus, { label: string; badge: string; icon: React.ReactNode }> = {
  completed: { label: "Completed", badge: "badge-success", icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> },
  pending: { label: "Pending", badge: "badge-warning", icon: <Clock className="w-3.5 h-3.5 text-amber-500" /> },
  late: { label: "Late", badge: "badge-danger", icon: <AlertCircle className="w-3.5 h-3.5 text-red-500" /> },
};

const FILTER_TABS: { label: string; value: AssignmentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Late", value: "late" },
];

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<AssignmentStatus | "all">("all");
  const [showUpload, setShowUpload] = useState(false);

  const filtered = MOCK_ASSIGNMENTS.filter(a => filter === "all" || a.status === filter);

  const counts = {
    completed: MOCK_ASSIGNMENTS.filter(a => a.status === "completed").length,
    pending: MOCK_ASSIGNMENTS.filter(a => a.status === "pending").length,
    late: MOCK_ASSIGNMENTS.filter(a => a.status === "late").length,
  };

  return (
    <DashboardLayout title="Assignments">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Assignments & Homework</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track, upload and manage all class assignments</p>
          </div>
          <button onClick={() => setShowUpload(!showUpload)} className="btn-primary flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" /> Upload Assignment
          </button>
        </div>

        {/* Upload form */}
        {showUpload && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-base p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">New Assignment</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Title</label>
                <input className="input-base" placeholder="Assignment title..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Subject</label>
                <select className="input-base">
                  {["Mathematics", "Science", "English", "Social Science", "Hindi"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Grade / Section</label>
                <select className="input-base">
                  {["Grade 8A", "Grade 8B", "Grade 8C", "All Grade 8"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Due Date</label>
                <input type="date" className="input-base" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Description</label>
                <textarea rows={2} className="input-base resize-none" placeholder="Assignment instructions..." />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn-primary text-sm px-5">Create Assignment</button>
              <button onClick={() => setShowUpload(false)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-4 py-2 transition-colors">Cancel</button>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Completed" value={counts.completed} change={`${Math.round((counts.completed / MOCK_ASSIGNMENTS.length) * 100)}% completion`} trend="up" icon={<CheckCircle className="w-4 h-4 text-emerald-600" />} iconBg="bg-emerald-50 dark:bg-emerald-900/20" />
          <StatCard label="Pending" value={counts.pending} change="Awaiting submission" trend="neutral" icon={<Clock className="w-4 h-4 text-amber-600" />} iconBg="bg-amber-50 dark:bg-amber-900/20" />
          <StatCard label="Late / Overdue" value={counts.late} change="Needs attention" trend="down" icon={<AlertCircle className="w-4 h-4 text-red-500" />} iconBg="bg-red-50 dark:bg-red-900/20" />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Assignments list */}
          <div className="lg:col-span-2 card-base p-5">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex-1">All Assignments</h3>
              <div className="flex gap-1.5">
                {FILTER_TABS.map(f => (
                  <button key={f.value} onClick={() => setFilter(f.value)} className={cn("px-3 py-1 rounded-xl text-xs font-semibold transition-all border", filter === f.value ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700")}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filtered.map((a, i) => {
                const cfg = STATUS_CONFIG[a.status];
                const pct = Math.round((a.submittedCount / a.totalCount) * 100);
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: a.iconBg }}>{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{a.title}</span>
                        <span className={cn("text-[10px]", cfg.badge)}>{cfg.label}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 mb-2">{a.subject} · {a.grade} · Due {a.dueDate}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: a.status === "completed" ? "#10B981" : a.status === "late" ? "#EF4444" : "#6366F1" }} />
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{a.submittedCount}/{a.totalCount} submitted</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {cfg.icon}
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <Filter className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-400">No assignments match this filter</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: pending students */}
          <div className="space-y-5">
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Students with Pending Homework</h3>
              <div className="space-y-3">
                {MOCK_STUDENTS.filter(s => s.homeworkCompleted < s.homeworkTotal).map((s, i) => {
                  const pending = s.homeworkTotal - s.homeworkCompleted;
                  return (
                    <div key={s.id} className="flex items-center gap-2.5 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: s.avatarColor }}>{s.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{s.name}</div>
                        <div className="text-[10px] text-gray-400">{s.section}</div>
                      </div>
                      <span className={cn("text-[10px]", pending >= 4 ? "badge-danger" : "badge-warning")}>
                        {pending} pending
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Completion summary */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Completion by Subject</h3>
              <div className="space-y-3">
                {[
                  { subject: "Science", pct: 95, color: "#10B981" },
                  { subject: "Hindi", pct: 88, color: "#06B6D4" },
                  { subject: "English", pct: 80, color: "#8B5CF6" },
                  { subject: "Mathematics", pct: 67, color: "#6366F1" },
                  { subject: "Social Sci.", pct: 59, color: "#F59E0B" },
                ].map(({ subject, pct, color }) => (
                  <div key={subject} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-20 flex-shrink-0">{subject}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right" style={{ color }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
