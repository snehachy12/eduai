// app/attendance/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, AlertTriangle, Save } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { MOCK_STUDENTS } from "@/data/mock";
import { cn, getAttendanceColor } from "@/lib/utils";
import type { AttendanceStatus } from "@/types";

const SECTIONS = ["All", "8A", "8B", "8C"];

const MONTHLY_DATA = [
  { section: "8A", attendance: 89 },
  { section: "8B", attendance: 82 },
  { section: "8C", attendance: 91 },
  { section: "9A", attendance: 76 },
  { section: "9B", attendance: 84 },
];

export default function AttendancePage() {
  const [section, setSection] = useState("All");
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(MOCK_STUDENTS.map(s => [s.id, s.attendance >= 80 ? "present" : "absent"]))
  );
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : prev[id] === "absent" ? "late" : "present"
    }));
    setSaved(false);
  };

  const filtered = MOCK_STUDENTS.filter(s => section === "All" || s.section === section);
  const presentCount = Object.values(attendance).filter(v => v === "present").length;
  const absentCount = Object.values(attendance).filter(v => v === "absent").length;
  const lateCount = Object.values(attendance).filter(v => v === "late").length;

  const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ReactNode; cls: string }> = {
    present: { label: "Present", icon: <CheckCircle className="w-3.5 h-3.5" />, cls: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
    absent: { label: "Absent", icon: <XCircle className="w-3.5 h-3.5" />, cls: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" },
    late: { label: "Late", icon: <Clock className="w-3.5 h-3.5" />, cls: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  };

  return (
    <DashboardLayout title="Attendance">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Attendance Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Saturday, 14 March 2026</p>
          </div>
          <button
            onClick={() => setSaved(true)}
            className={cn("btn-primary flex items-center gap-2 text-sm", saved && "bg-emerald-500 hover:bg-emerald-600")}
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Attendance"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Present Today" value={presentCount} change={`${Math.round((presentCount / MOCK_STUDENTS.length) * 100)}%`} trend="up" icon={<CheckCircle className="w-4 h-4 text-emerald-600" />} iconBg="bg-emerald-50 dark:bg-emerald-900/20" />
          <StatCard label="Absent Today" value={absentCount} change={`${Math.round((absentCount / MOCK_STUDENTS.length) * 100)}%`} trend="down" icon={<XCircle className="w-4 h-4 text-red-500" />} iconBg="bg-red-50 dark:bg-red-900/20" />
          <StatCard label="Late Arrivals" value={lateCount} change="This morning" trend="neutral" icon={<Clock className="w-4 h-4 text-amber-500" />} iconBg="bg-amber-50 dark:bg-amber-900/20" />
          <StatCard label="Chronic Absent" value={MOCK_STUDENTS.filter(s => s.attendance < 75).length} change="Below 75%" trend="down" icon={<AlertTriangle className="w-4 h-4 text-red-500" />} iconBg="bg-red-50 dark:bg-red-900/20" />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Mark attendance */}
          <div className="lg:col-span-2 card-base p-5">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex-1">Mark Attendance</h3>
              <div className="flex gap-1.5">
                {SECTIONS.map(s => (
                  <button key={s} onClick={() => setSection(s)} className={cn("px-3 py-1 rounded-xl text-xs font-semibold transition-all border", section === s ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700")}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
              <span>Click to cycle:</span>
              {(["present", "absent", "late"] as AttendanceStatus[]).map(s => (
                <span key={s} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px]", statusConfig[s].cls)}>
                  {statusConfig[s].icon}{statusConfig[s].label}
                </span>
              ))}
            </div>
            <div className="space-y-1">
              {filtered.map((s, i) => {
                const st = attendance[s.id];
                const cfg = statusConfig[st];
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: s.avatarColor }}>{s.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</div>
                      <div className="text-[10px] text-gray-400">{s.section} · Overall {s.attendance}%</div>
                    </div>
                    <button
                      onClick={() => toggle(s.id)}
                      className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95", cfg.cls)}
                    >
                      {cfg.icon}{cfg.label}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Section overview */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Section Overview</h3>
              <div className="space-y-3.5">
                {MONTHLY_DATA.map(({ section: sec, attendance: pct }) => (
                  <div key={sec}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 dark:text-gray-400">Grade {sec}</span>
                      <span className="font-semibold" style={{ color: getAttendanceColor(pct) }}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: getAttendanceColor(pct) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Absence alerts */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Absence Alerts</h3>
              <div className="space-y-2.5">
                {MOCK_STUDENTS.filter(s => s.attendance < 80).map(s => (
                  <div key={s.id} className="flex items-center gap-2.5 py-2.5 px-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-red-700 dark:text-red-400">{s.name}</div>
                      <div className="text-[10px] text-red-500 dark:text-red-400/70">{s.attendance}% — needs attention</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trend chart */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Monthly Trend</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={MONTHLY_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
                  <XAxis dataKey="section" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[60, 100]} />
                  <Tooltip formatter={(v) => [`${v}%`, "Attendance"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Bar dataKey="attendance" fill="#6366F1" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
