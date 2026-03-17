// app/profile/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Phone, MapPin, TrendingUp, TrendingDown,
  Minus, BookOpen, Calendar, Star, MessageCircle, Edit3, Download
} from "lucide-react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AIInsightsPanel } from "@/components/dashboard/ai-insight-card";
import { MOCK_STUDENTS, MOCK_AI_INSIGHTS } from "@/data/mock";
import { getStatusBadgeClass, getStatusLabel, getAttendanceColor, getScoreColor, cn } from "@/lib/utils";

const student = MOCK_STUDENTS[0]; // Riya Mehta as default profile

const scoreHistory = [
  { month: "Aug", Math: 82, Science: 80, English: 83, SST: 78, Hindi: 88 },
  { month: "Sep", Math: 79, Science: 84, English: 84, SST: 75, Hindi: 89 },
  { month: "Oct", Math: 76, Science: 86, English: 85, SST: 72, Hindi: 90 },
  { month: "Nov", Math: 78, Science: 88, English: 85, SST: 72, Hindi: 91 },
];

const SUBJECT_COLORS: Record<string, string> = {
  Math: "#6366F1", Science: "#10B981", English: "#8B5CF6", SST: "#F59E0B", Hindi: "#06B6D4"
};

const TABS = ["Overview", "Performance", "Attendance", "Assignments", "Feedback"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <DashboardLayout title="Student Profile">
      <div className="space-y-5 max-w-5xl">
        {/* Back */}
        <Link href="/students" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 60%, #A855F7 100%)" }}
        >
          <div className="p-6 text-white">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-extrabold border-2 border-white/30 flex-shrink-0">
                {student.initials}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">{student.name}</h1>
                  <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/25">
                    {getStatusLabel(student.status)}
                  </span>
                </div>
                <p className="text-indigo-200 text-sm">{student.grade} · {student.section} · Roll No: {student.rollNo}</p>
                <p className="text-indigo-200 text-xs mt-0.5">Class Teacher: Mrs. Sarah Kumar</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                  <Download className="w-3.5 h-3.5" /> Report
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-6 pt-5 border-t border-white/20">
              {[
                { label: "Attendance", value: `${student.attendance}%`, color: "text-emerald-300" },
                { label: "Avg Score", value: `${student.avgScore}%`, color: "text-blue-200" },
                { label: "Homework", value: `${student.homeworkCompleted}/${student.homeworkTotal}`, color: "text-purple-200" },
                { label: "Risk Score", value: `${student.riskScore}%`, color: "text-amber-300" },
                { label: "Rank", value: "#12", color: "text-pink-200" },
                { label: "Term", value: "2025–26", color: "text-indigo-200" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <div className={`text-lg font-bold ${color}`}>{value}</div>
                  <div className="text-[10px] text-white/60 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn("px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap",
                activeTab === tab
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

          {activeTab === "Overview" && (
            <div className="grid lg:grid-cols-3 gap-5">
              {/* Contact info */}
              <div className="card-base p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Contact Info</h3>
                {[
                  { icon: Mail, label: "Email", value: student.email },
                  { icon: Phone, label: "Parent", value: student.parentName },
                  { icon: Mail, label: "Parent Email", value: student.parentEmail },
                  { icon: MapPin, label: "Section", value: `${student.grade} · ${student.section}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white mt-0.5">{value}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Link href="/messages" className="flex items-center justify-center gap-2 w-full btn-outline py-2 text-xs">
                    <MessageCircle className="w-3.5 h-3.5" /> Message Parent
                  </Link>
                </div>
              </div>

              {/* Subject scores */}
              <div className="card-base p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
                <div className="space-y-4">
                  {student.subjects.map((subj) => (
                    <div key={subj.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{subj.name}</span>
                        <div className="flex items-center gap-1.5">
                          {subj.trend === "up" ? <TrendingUp className="w-3 h-3 text-emerald-500" /> :
                           subj.trend === "down" ? <TrendingDown className="w-3 h-3 text-red-500" /> :
                           <Minus className="w-3 h-3 text-gray-400" />}
                          <span className="text-xs font-bold" style={{ color: subj.color }}>{subj.score}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${subj.score}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: subj.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI insights */}
              <AIInsightsPanel
                insights={MOCK_AI_INSIGHTS.filter(i => i.studentId === "s1" || !i.studentId).slice(0, 3)}
                compact
              />
            </div>
          )}

          {activeTab === "Performance" && (
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="card-base p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Score Trend (4 Months)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={scoreHistory} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[60, 100]} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #E2E8F0" }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {Object.entries(SUBJECT_COLORS).map(([key, color]) => (
                      <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card-base p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Latest Subject Scores</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={student.subjects.map(s => ({ name: s.name.split(" ")[0], score: s.score }))} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #E2E8F0" }} />
                    <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "Attendance" && (
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="card-base p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Attendance</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={student.attendanceHistory} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip formatter={(v) => [`${v}%`, "Attendance"]} contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #E2E8F0" }} />
                    <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                      {student.attendanceHistory.map((entry, i) => (
                        <rect key={i} fill={entry.percentage >= 90 ? "#10B981" : entry.percentage >= 75 ? "#6366F1" : "#F59E0B"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card-base p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Attendance Summary</h3>
                <div className="space-y-3">
                  {student.attendanceHistory.map(m => (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-8 flex-shrink-0">{m.month}</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${m.percentage}%`, background: m.percentage >= 90 ? "#10B981" : m.percentage >= 75 ? "#6366F1" : "#F59E0B" }} />
                      </div>
                      <span className="text-xs font-semibold w-10 text-right" style={{ color: m.percentage >= 90 ? "#10B981" : m.percentage >= 75 ? "#6366F1" : "#F59E0B" }}>{m.percentage}%</span>
                      <span className="text-xs text-gray-400 w-12 text-right">{m.present}/{m.total} days</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Overall Attendance</span>
                    <span className="font-bold" style={{ color: getAttendanceColor(student.attendance) }}>{student.attendance}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Assignments" && (
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Assignment History</h3>
              <div className="space-y-3">
                {[
                  { title: "Lab Report — Photosynthesis", subject: "Science", date: "Mar 14", status: "completed", score: 92 },
                  { title: "Hindi Vyakaran Chapter 3", subject: "Hindi", date: "Mar 13", status: "completed", score: 88 },
                  { title: "Chapter 5 — Quadratic Equations", subject: "Mathematics", date: "Mar 16", status: "pending", score: null },
                  { title: "Map Activity — River Systems", subject: "Social Science", date: "Mar 18", status: "pending", score: null },
                  { title: "Essay: My Favourite Season", subject: "English", date: "Mar 8", status: "completed", score: 85 },
                  { title: "Algebra Worksheet Set A", subject: "Mathematics", date: "Mar 5", status: "completed", score: 76 },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{a.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{a.subject} · Due {a.date}</div>
                    </div>
                    {a.score !== null && <span className="text-sm font-bold" style={{ color: getScoreColor(a.score) }}>{a.score}%</span>}
                    <span className={cn("text-xs",
                      a.status === "completed" ? "badge-success" :
                      a.status === "pending" ? "badge-warning" : "badge-danger"
                    )}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Feedback" && (
            <div className="space-y-4">
              <div className="card-base p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Teacher Feedback</h3>
                  <span className="text-xs text-gray-400 ml-auto">12 March 2026</span>
                </div>
                <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-3 border-primary pl-4 py-1 border-l-2">
                  "{student.teacherFeedback}"
                </blockquote>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold">SK</div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">Mrs. Sarah Kumar</div>
                    <div className="text-[10px] text-gray-400">Class Teacher · Grade 8A</div>
                  </div>
                </div>
              </div>
              <div className="card-base p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Add Feedback</h3>
                <textarea
                  rows={4}
                  placeholder="Write teacher feedback for this student..."
                  className="input-base resize-none text-sm"
                />
                <button className="btn-primary mt-3 text-xs px-4 py-2">Save Feedback</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
