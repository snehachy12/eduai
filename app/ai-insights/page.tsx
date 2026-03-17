// app/ai-insights/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, RefreshCw, Send, TrendingDown, AlertTriangle, Sparkles, ChevronDown } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { MOCK_AI_INSIGHTS, MOCK_STUDENTS } from "@/data/mock";
import { getRiskColor, cn } from "@/lib/utils";

const classRadarData = [
  { subject: "Math", score: 68 },
  { subject: "Science", score: 79 },
  { subject: "English", score: 77 },
  { subject: "SST", score: 71 },
  { subject: "Hindi", score: 82 },
];

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <DashboardLayout title="AI Insights">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              AI Insights Engine
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Powered by Claude AI · Last updated: Today, 9:00 AM</p>
          </div>
          <button onClick={refresh} className={cn("btn-outline flex items-center gap-2 text-sm", loading && "opacity-70")}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            {loading ? "Analyzing..." : "Refresh Insights"}
          </button>
        </div>

        {/* Summary banner */}
        <div className="rounded-2xl overflow-hidden ai-card-bg border border-indigo-100 dark:border-indigo-900/30 p-5">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">Class Performance Summary</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Grade 8 is performing at <strong>above-average</strong> levels this term, with a class mean of 74.2%.
                Science and Hindi show the strongest results. Mathematics requires attention — 28% of students scored below 65% in the last assessment.
                Attendance is at 87%, with <span className="text-red-500 font-semibold">5 students</span> in the chronic absence range requiring immediate intervention.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Class Avg", value: "74.2%", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
              { label: "Attendance", value: "87%", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
              { label: "At Risk", value: "7 students", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30" },
              { label: "Improving", value: "23 students", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={cn("rounded-xl p-3 text-center", bg)}>
                <div className={cn("text-base font-bold", color)}>{value}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Insights list */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Action Items</h3>
            {MOCK_AI_INSIGHTS.map((insight, i) => (
              <motion.div key={insight.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <AIInsightCard insight={insight} index={i} />
              </motion.div>
            ))}
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            {/* Risk scores */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Student Risk Scores</h3>
              <div className="space-y-3">
                {[...MOCK_STUDENTS].sort((a, b) => b.riskScore - a.riskScore).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0" style={{ background: s.avatarColor }}>{s.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 dark:text-white truncate mb-1">{s.name}</div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.riskScore}%` }} transition={{ duration: 0.6, delay: i * 0.08 }} className="h-full rounded-full" style={{ background: getRiskColor(s.riskScore) }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold w-8 text-right flex-shrink-0" style={{ color: getRiskColor(s.riskScore) }}>{s.riskScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar chart */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Class Subject Profile</h3>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={classRadarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <Radar name="Class Avg" dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* AI-generated parent notifications */}
            <div className="card-base p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Auto-Draft Notifications</h3>
              <div className="space-y-3">
                {MOCK_STUDENTS.filter(s => s.riskScore >= 50).map(s => (
                  <div key={s.id} className={cn("rounded-xl p-3 border", s.riskScore >= 70 ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800")}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={cn("text-xs font-bold", s.riskScore >= 70 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400")}>For: {s.parentName}</span>
                      <span className="text-[10px] text-gray-400">re: {s.name}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {s.riskScore >= 70
                        ? `Dear ${s.parentName.split(" ")[1]}, Vikram's attendance has fallen to ${s.attendance}% and his academic performance is critically low. Please schedule an urgent meeting.`
                        : `Dear ${s.parentName.split(" ")[1]}, we've noticed a recent decline in ${s.name.split(" ")[0]}'s performance. We recommend additional support in Mathematics.`}
                    </p>
                    <button className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                      <Send className="w-3 h-3" /> Send Notification
                    </button>
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
