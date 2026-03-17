"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CalendarCheck, Star, FileText, Clock,
  TrendingUp, TrendingDown, AlertTriangle,
  MessageSquare, BookOpen, Home, Bell,
  ChevronRight, GraduationCap, LogOut, User,
} from "lucide-react";

const attColor   = (v: number) => v >= 90 ? "#10b981" : v >= 75 ? "#f59e0b" : "#ef4444";
const scoreColor = (v: number) => v >= 80 ? "#10b981" : v >= 60 ? "#f59e0b" : "#ef4444";
const statusCls  = (s: string) => ({
  excellent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  good:      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "at-risk": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  critical:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
} as any)[s] ?? "bg-gray-100 text-gray-600";

function MetricCard({ label, value, sub, color, icon, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      </div>
      <div className="text-3xl font-black tracking-tight" style={{ color: typeof value === "number" ? scoreColor(value) : undefined }}
        className={typeof value !== "number" ? "text-gray-900 dark:text-white text-3xl font-black tracking-tight" : ""}>
        {value}
      </div>
      <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
    </motion.div>
  );
}

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.replace("/login"); return; }
    const role = (session.user as any)?.role;
    if (role !== "parent") { router.replace("/teacher/dashboard"); return; }

    fetch("/api/dashboard/parent")
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
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-2xl p-6 max-w-sm text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-red-600">{error}</p>
      </div>
    </div>
  );

  const { stats, student, profile } = data ?? {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 flex flex-col">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 dark:text-white text-sm tracking-tight">EduAI</span>
            <span className="ml-auto text-[9px] bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-bold px-1.5 py-0.5 rounded-md uppercase">Parent</span>
          </div>
        </div>

        {/* Parent info */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: profile?.avatarColor ?? "#8b5cf6" }}>
              {session?.user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0,2)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{session?.user?.name}</div>
              <div className="text-[10px] text-gray-400">Parent Account</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {[
            { icon: Home,          label: "Dashboard",  href: "/parent/dashboard", active: true  },
            { icon: User,          label: "My Child",   href: "/parent/child",     active: false },
            { icon: BookOpen,      label: "Homework",   href: "/parent/homework",  active: false },
            { icon: MessageSquare, label: "Messages",   href: "/messages",         active: false },
            { icon: Bell,          label: "Notices",    href: "/parent/notices",   active: false },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button onClick={() => router.push("/login")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-500 transition-all">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 p-7 space-y-7">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Welcome, {session?.user?.name?.split(" ")[0]} 👪
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {student
                ? `Tracking ${student.name}'s progress in ${student.section}`
                : "Set up your child's profile to get started"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </motion.div>

        {!student ? (
          /* No student linked */
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-amber-200 dark:border-amber-800 p-10 flex flex-col items-center justify-center text-center shadow-sm"
          >
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">No child linked yet</h3>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Your class code <span className="font-bold text-purple-600">{profile?.childClassCode}</span> hasn't been matched yet.
              Ask your child's teacher to add them using this code.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <MetricCard label="Child"        value={student.name}             sub={student.section}           color="bg-purple-50 dark:bg-purple-900/20"  icon={<User          className="w-4 h-4 text-purple-600" />} delay={0}    />
              <MetricCard label="Attendance"   value={`${student.attendance}%`} sub="Present this month"        color="bg-emerald-50 dark:bg-emerald-900/20" icon={<CalendarCheck className="w-4 h-4 text-emerald-600"/>} delay={0.07} />
              <MetricCard label="Homework"     value={`${stats?.homeworkDone ?? 0}/${stats?.homeworkTotal ?? 0}`} sub="Assignments completed" color="bg-amber-50 dark:bg-amber-900/20" icon={<FileText className="w-4 h-4 text-amber-600"/>} delay={0.14} />
              <MetricCard label="Avg Score"    value={`${student.avgScore}%`}   sub="Across all subjects"       color="bg-blue-50 dark:bg-blue-900/20"       icon={<Star          className="w-4 h-4 text-blue-600"   />} delay={0.21} />
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Subject performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                className="col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-sm font-black text-gray-900 dark:text-white">Subject Performance</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{student.name} · {student.section}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full capitalize ${statusCls(student.status)}`}>
                    {student.status}
                  </span>
                </div>

                {student.subjects?.length > 0 ? (
                  <div className="space-y-5">
                    {student.subjects.map((s: any, i: number) => (
                      <div key={s.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{s.name}</span>
                          <div className="flex items-center gap-2">
                            {s.score >= 80
                              ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                              : <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                            }
                            <span className="text-sm font-black" style={{ color: s.color }}>{s.score}%</span>
                          </div>
                        </div>
                        <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.score}%` }}
                            transition={{ delay: 0.35 + i * 0.08, duration: 0.9, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: s.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <BookOpen className="w-8 h-8 text-gray-200 dark:text-gray-700 mb-2" />
                    <p className="text-xs text-gray-400">No subject data yet</p>
                  </div>
                )}
              </motion.div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Child summary card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5"
                >
                  <h2 className="text-sm font-black text-gray-900 dark:text-white mb-4">Child Profile</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm"
                      style={{ background: student.avatarColor }}>{student.initials}</div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{student.name}</div>
                      <div className="text-xs text-gray-400">{student.section}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                      <div className="text-xl font-black" style={{ color: attColor(student.attendance) }}>{student.attendance}%</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Attendance</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                      <div className="text-xl font-black" style={{ color: scoreColor(student.avgScore) }}>{student.avgScore}%</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Avg Score</div>
                    </div>
                  </div>
                </motion.div>

                {/* Teacher feedback */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <h2 className="text-sm font-black text-gray-900 dark:text-white">Teacher Feedback</h2>
                  </div>
                  {student.teacherFeedback ? (
                    <>
                      <blockquote className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-2 border-purple-400 pl-3 py-1">
                        "{student.teacherFeedback}"
                      </blockquote>
                      <p className="text-[10px] text-gray-400 mt-2">— Class Teacher</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No feedback added yet.</p>
                  )}
                  <Link href="/messages"
                    className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                    Message teacher <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}