// app/page.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain, BookOpen, Users, BarChart3, MessageCircle, ArrowRight,
  CheckCircle, Star, Shield, Zap, Bell, TrendingUp, ChevronRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const FEATURES = [
  { icon: <Users className="w-6 h-6" />, title: "Attendance Tracking", desc: "Mark and monitor daily attendance with instant parent notifications. View monthly trends and chronic absence alerts with visual charts.", color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" },
  { icon: <BookOpen className="w-6 h-6" />, title: "Homework Monitoring", desc: "Track assignment submissions, flag overdue work, and give parents real-time visibility into homework completion with progress indicators.", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
  { icon: <Brain className="w-6 h-6" />, title: "AI Performance Insights", desc: "Our AI analyzes grades, attendance, and behavior to detect at-risk students early and generate actionable recommendations for teachers.", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
  { icon: <MessageCircle className="w-6 h-6" />, title: "Parent-Teacher Messaging", desc: "Seamless communication channel between parents and teachers with AI-drafted notifications and instant alert delivery for critical updates.", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
];

const STATS = [
  { value: "50K+", label: "Students Tracked" },
  { value: "1,200+", label: "Schools Using EduAI" },
  { value: "98%", label: "Parent Satisfaction" },
  { value: "40%", label: "Fewer At-Risk Cases" },
];

const TESTIMONIALS = [
  { name: "Mrs. Priya Nair", role: "Class Teacher, Delhi Public School", text: "EduAI has completely transformed how I communicate with parents. The AI insights save me hours every week and help me catch struggling students early.", avatar: "PN", color: "#6366F1" },
  { name: "Mr. Rohit Verma", role: "Parent of Grade 8 Student", text: "I finally have real visibility into my daughter's progress. The AI assistant answers my questions any time of day. This is exactly what modern education needs.", avatar: "RV", color: "#10B981" },
  { name: "Dr. Sunita Rao", role: "Principal, Vidya Mandir School", text: "School-wide adoption was smooth and the impact has been remarkable. Teacher workload is down, parental engagement is up, and at-risk students are identified faster.", avatar: "SR", color: "#F59E0B" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-gray-900 dark:text-white text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
            EduAI
          </Link>
          <div className="hidden md:flex items-center gap-6 ml-4">
            {["Features", "About", "Pricing"].map((link) => (
              <a key={link} href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{link}</a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors px-3 py-2">Login</Link>
            <Link href="/signup" className="btn-primary text-sm">Get Started Free <ArrowRight className="w-3.5 h-3.5 inline ml-1" /></Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary-light dark:bg-indigo-900/30 text-primary dark:text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-indigo-200 dark:border-indigo-800">
              <Brain className="w-3.5 h-3.5" />
              AI-Powered Education Platform
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-5">
              AI-Powered Student Evaluation for{" "}
              <span className="text-primary">Smarter</span> Parent-Teacher Collaboration
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-lg">
              Track attendance, monitor homework, and analyze student performance with powerful AI insights — all in one seamless platform built for modern schools.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
                Get Started Free <ArrowRight className="w-4 h-4 inline ml-1.5" />
              </Link>
              <button className="btn-outline px-6 py-3 text-base">View Demo</button>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
              {["Free for schools", "AI-powered insights", "Parent portal included"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{t}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white text-xs font-bold">E</div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Class 8A Overview</span>
                <span className="ml-auto badge-success text-xs">● Live</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { val: "142", lbl: "Students", color: "text-indigo-600" },
                  { val: "87%", lbl: "Attendance", color: "text-emerald-600" },
                  { val: "24", lbl: "Pending HW", color: "text-amber-600" },
                  { val: "7", lbl: "At Risk", color: "text-red-600" },
                ].map(({ val, lbl, color }) => (
                  <div key={lbl} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <div className={`text-2xl font-bold ${color}`}>{val}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">AI Alert</div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">Vikram Singh has critical attendance (61%). Notify parents immediately.</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                {[
                  { name: "Neha Patel", score: 91, color: "#10B981", status: "Excellent" },
                  { name: "Riya Mehta", score: 82, color: "#6366F1", status: "Good" },
                  { name: "Arjun Kumar", score: 61, color: "#F59E0B", status: "At Risk" },
                ].map(({ name, score, color, status }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 w-24 truncate">{name}</div>
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
                    </div>
                    <div className="text-xs font-semibold" style={{ color }}>{score}%</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {STATS.map(({ value, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="text-3xl font-extrabold">{value}</div>
                <div className="text-sm text-indigo-200 mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Everything your school needs
          </motion.h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">Four powerful modules working together to create a complete education management ecosystem.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="card-base p-6 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>{icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Loved by educators and parents</h2>
            <p className="text-gray-500 dark:text-gray-400">Real stories from our growing community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, avatar, color }, i) => (
              <motion.div key={name} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="card-base p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">&quot;{text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: color }}>{avatar}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{name}</div>
                    <div className="text-xs text-gray-400">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #fff 0%, transparent 60%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)" }} />
          <div className="relative">
            <h2 className="text-4xl font-extrabold mb-4">Ready to transform your school?</h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-lg mx-auto">Join 1,200+ schools already using EduAI to improve student outcomes and strengthen parent-teacher relationships.</p>
            <Link href="/signup" className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-base inline-flex items-center gap-2">
              Start Free Today <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white text-xs font-bold">E</div>
            EduAI Platform
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            {["Privacy", "Terms", "Support", "Contact"].map(l => <a key={l} href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{l}</a>)}
          </div>
          <div className="text-sm text-gray-400">© 2026 EduAI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
