// app/dashboard/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, CalendarCheck, BookOpen, AlertTriangle,
  User, Clock, Star, FileText
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { AIInsightsPanel } from "@/components/dashboard/ai-insight-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { MOCK_STUDENTS, MOCK_STATS, MOCK_AI_INSIGHTS } from "@/data/mock";
import { getStatusBadgeClass, getStatusLabel, getAttendanceColor, getScoreColor, cn } from "@/lib/utils";
import Link from "next/link";

function TeacherDashboard() {
  const { teacher } = MOCK_STATS;
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={teacher.totalStudents} change="↑ 8 this term" trend="up" icon={<Users className="w-4 h-4 text-indigo-600" />} iconBg="bg-indigo-50 dark:bg-indigo-900/20" delay={0} />
        <StatCard label="Avg Attendance" value={`${teacher.avgAttendance}%`} change="↑ 2% this month" trend="up" icon={<CalendarCheck className="w-4 h-4 text-emerald-600" />} iconBg="bg-emerald-50 dark:bg-emerald-900/20" delay={0.05} />
        <StatCard label="Assignments Pending" value={teacher.pendingAssignments} change="6 overdue" trend="down" icon={<BookOpen className="w-4 h-4 text-amber-600" />} iconBg="bg-amber-50 dark:bg-amber-900/20" delay={0.1} />
        <StatCard label="At-Risk Students" value={teacher.atRiskStudents} change="↑ 2 new alerts" trend="down" icon={<AlertTriangle className="w-4 h-4 text-red-500" />} iconBg="bg-red-50 dark:bg-red-900/20" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Students table */}
        <div className="lg:col-span-2 card-base p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Students</h3>
            <Link href="/students" className="text-xs text-primary font-medium hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {["Student", "Class", "Attendance", "Avg Score", "Status"].map(h => (
                    <th key={h} className="pb-3 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_STUDENTS.slice(0, 5).map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: s.avatarColor }}>{s.initials}</div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{s.section}</td>
                    <td className="py-3 pr-4 text-sm font-semibold" style={{ color: getAttendanceColor(s.attendance) }}>{s.attendance}%</td>
                    <td className="py-3 pr-4 text-sm font-semibold" style={{ color: getScoreColor(s.avgScore) }}>{s.avgScore}%</td>
                    <td className="py-3">
                      <span className={cn("text-[10px]", getStatusBadgeClass(s.status))}>{getStatusLabel(s.status)}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <AIInsightsPanel insights={MOCK_AI_INSIGHTS.slice(0, 3)} compact />
          <ActivityFeed />
        </div>
      </div>
    </>
  );
}

function ParentDashboard() {
  const { parent } = MOCK_STATS;
  const student = MOCK_STUDENTS[0];
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Child" value={parent.childName} change={parent.grade} trend="neutral" icon={<User className="w-4 h-4 text-indigo-600" />} iconBg="bg-indigo-50 dark:bg-indigo-900/20" delay={0} />
        <StatCard label="Attendance" value={`${parent.attendance}%`} change="Good standing" trend="up" icon={<CalendarCheck className="w-4 h-4 text-emerald-600" />} iconBg="bg-emerald-50 dark:bg-emerald-900/20" delay={0.05} />
        <StatCard label="Homework Done" value={`${parent.homeworkDone}/${parent.homeworkTotal}`} change="4 pending" trend="down" icon={<FileText className="w-4 h-4 text-amber-600" />} iconBg="bg-amber-50 dark:bg-amber-900/20" delay={0.1} />
        <StatCard label="Avg Score" value={`${parent.avgScore}%`} change="↑ 3% vs last term" trend="up" icon={<Star className="w-4 h-4 text-purple-600" />} iconBg="bg-purple-50 dark:bg-purple-900/20" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Subject performance */}
        <div className="card-base p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Subject Performance — Riya Mehta</h3>
          <div className="space-y-3.5">
            {student.subjects.map((subj) => (
              <div key={subj.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">{subj.name}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full progress-animate" style={{ width: `${subj.score}%`, background: subj.color }} />
                </div>
                <span className="text-xs font-semibold w-8 text-right" style={{ color: subj.color }}>{subj.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI insights for parent */}
        <AIInsightsPanel insights={MOCK_AI_INSIGHTS.filter(i => i.studentId === "s1" || !i.studentId).slice(0, 3)} compact />
      </div>

      {/* Teacher feedback */}
      <div className="card-base p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Latest Teacher Feedback</h3>
          <span className="text-xs text-gray-400 ml-auto">12 March 2026</span>
        </div>
        <blockquote className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-2 border-primary pl-4 py-1">
          "{student.teacherFeedback}"
        </blockquote>
        <p className="text-xs text-gray-400 mt-2">— Mrs. Sarah Kumar, Class Teacher 8A</p>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const [role, setRole] = useState<"teacher" | "parent">("teacher");

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-5">
        {/* Role selector */}
        <div className="flex items-center gap-3">
          <h1 className="page-title flex-1">
            {role === "teacher" ? "Teacher Dashboard" : "Parent Dashboard"}
          </h1>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5 border border-gray-200 dark:border-gray-700">
            {(["teacher", "parent"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn("px-4 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize",
                  role === r ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                )}
              >
                {r === "teacher" ? "👩‍🏫 Teacher" : "👪 Parent"} View
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={role}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {role === "teacher" ? <TeacherDashboard /> : <ParentDashboard />}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
