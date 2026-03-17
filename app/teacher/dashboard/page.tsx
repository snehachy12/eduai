"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, CalendarCheck, BookOpen, AlertTriangle,
  Bell, TrendingUp, TrendingDown, Plus, Search,
  BarChart2, Clock, ChevronRight, GraduationCap,
  BookMarked, MessageSquare, LogOut,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────
const attColor  = (v: number) => v >= 90 ? "#10b981" : v >= 75 ? "#f59e0b" : "#ef4444";
const scoreColor = (v: number) => v >= 80 ? "#10b981" : v >= 60 ? "#f59e0b" : "#ef4444";
const statusCls  = (s: string) => ({
  excellent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  good:      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "at-risk": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  critical:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
} as Record<string, string>)[s] ?? "bg-gray-100 text-gray-600";

function StatCard({ label, value, change, up, icon, iconBg, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-3 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
      </div>
      <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</div>
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${up ? "text-emerald-500" : "text-red-400"}`}>
        {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {change}
      </div>
    </motion.div>
  );
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Added to track active link
  
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.replace("/login"); return; }
    
    // Typecast safely assuming you set up next-auth.d.ts
    const role = (session.user as any)?.role;
    if (role !== "teacher") { router.replace("/parent/dashboard"); return; }

    fetch("/api/dashboard/teacher")
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error);
        return r.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [session, status, router]);

  if (!mounted || loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading teacher dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-sm text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="mt-4 text-xs text-red-500 underline">Back to login</button>
      </div>
    </div>
  );

  const { stats, students = [], recentActivity = [] } = data ?? {};
  const filtered = students.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.section?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 dark:text-white text-sm tracking-tight">EduAI</span>
            <span className="ml-auto text-[9px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-md uppercase">Teacher</span>
          </div>
        </div>

        {/* Teacher info */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: data?.profile?.avatarColor ?? "#6366f1" }}>
              {session?.user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0,2)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{session?.user?.name}</div>
              <div className="text-[10px] text-gray-400 truncate">{data?.profile?.schoolName}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { icon: BarChart2,     label: "Dashboard",   href: "/dashboard" },
            { icon: Users,         label: "Students",    href: "/students" },
            { icon: CalendarCheck, label: "Attendance",  href: "/attendance" },
            { icon: BookOpen,      label: "Assignments", href: "/assignments" },
            { icon: MessageSquare, label: "Messages",    href: "/messages" },
            { icon: Bell,          label: "Alerts",      href: "/alerts" },
          ].map(({ icon: Icon, label, href }) => {
            const isActive = pathname.startsWith(href); // Dynamically checks URL
            return (
              <Link key={label} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })} // Secure Sign Out
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-500 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 p-7 space-y-7">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {session?.user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Here's what's happening in your classroom today.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Students"      value={stats?.totalStudents ?? 0}       change="Enrolled this term"   up={true}  delay={0}    iconBg="bg-indigo-50 dark:bg-indigo-900/20"  icon={<Users        className="w-4 h-4 text-indigo-600"  />} />
          <StatCard label="Avg Attendance"      value={`${stats?.avgAttendance ?? 0}%`} change="vs last month"        up={true}  delay={0.07} iconBg="bg-emerald-50 dark:bg-emerald-900/20" icon={<CalendarCheck className="w-4 h-4 text-emerald-600"/>} />
          <StatCard label="Pending Assignments" value={stats?.pendingAssignments ?? 0}  change="6 overdue"            up={false} delay={0.14} iconBg="bg-amber-50 dark:bg-amber-900/20"    icon={<BookOpen     className="w-4 h-4 text-amber-600"   />} />
          <StatCard label="At-Risk Students"    value={stats?.atRiskStudents ?? 0}      change="Needs attention"      up={false} delay={0.21} iconBg="bg-red-50 dark:bg-red-900/20"        icon={<AlertTriangle className="w-4 h-4 text-red-500"    />} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Students table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
            className="col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <div className="flex-1">
                <h2 className="text-sm font-black text-gray-900 dark:text-white">My Students</h2>
                <p className="text-xs text-gray-400 mt-0.5">{students.length} enrolled</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="pl-8 pr-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 w-44 text-gray-700 dark:text-gray-300 placeholder-gray-400" />
              </div>
              <Link href="/students"
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Student
              </Link>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-semibold text-gray-400">
                  {search ? "No students match your search" : "No students yet"}
                </p>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                  {!search && "Add your first student to get started"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-gray-800/50">
                      {["Student","Section","Attendance","Avg Score","Status",""].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {filtered.map((s: any, i: number) => (
                      <motion.tr key={s._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.04 }}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                              style={{ background: s.avatarColor }}>{s.initials}</div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{s.name}</div>
                              <div className="text-[10px] text-gray-400">Code: {s.classCode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-medium text-gray-500">{s.section}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${s.attendance}%`, background: attColor(s.attendance) }} />
                            </div>
                            <span className="text-xs font-bold" style={{ color: attColor(s.attendance) }}>{s.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-black" style={{ color: scoreColor(s.avgScore) }}>{s.avgScore}%</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${statusCls(s.status)}`}>{s.status}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Activity feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-black text-gray-900 dark:text-white">Recent Activity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Latest classroom updates</p>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <Bell className="w-8 h-8 text-gray-200 dark:text-gray-700 mb-2" />
                  <p className="text-xs text-gray-400">No activity yet</p>
                </div>
              ) : (
                recentActivity.slice(0, 8).map((a: any, i: number) => {
                  const cfg: Record<string, { bg: string; icon: any }> = {
                    attendance: { bg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",  icon: CalendarCheck },
                    grade:      { bg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",           icon: BookMarked    },
                    message:    { bg: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",     icon: MessageSquare },
                    alert:      { bg: "bg-red-100 dark:bg-red-900/30 text-red-500",              icon: AlertTriangle },
                  };
                  const { bg, icon: Icon } = cfg[a.type] ?? cfg.grade;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{a.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* At-risk alert banner */}
        {stats?.atRiskStudents > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-400">
                {stats.atRiskStudents} student{stats.atRiskStudents > 1 ? "s" : ""} need{stats.atRiskStudents === 1 ? "s" : ""} attention
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                Review their attendance and scores to provide timely support.
              </p>
            </div>
            <Link href="/students?filter=at-risk"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-xl hover:bg-amber-700 transition-colors flex-shrink-0">
              Review <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}