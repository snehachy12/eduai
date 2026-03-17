// app/login/page.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, GraduationCap, ArrowRight, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [role, setRole]         = useState<"teacher" | "parent">("teacher");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      role,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-primary to-purple-600">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">EduAI Platform</span>
        </div>
        <div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold text-white leading-tight mb-4">
            Empowering Teachers,<br />Engaging Parents
          </motion.h2>
          <p className="text-indigo-200 text-lg leading-relaxed mb-8">
            AI-powered insights that help every student reach their potential.
          </p>
          {["Real-time attendance tracking", "AI-powered performance insights", "Seamless parent-teacher communication"].map((item, i) => (
            <motion.div key={item} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 text-indigo-100 mb-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-3 h-3" />
              </div>
              <span className="text-sm">{item}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-indigo-300 text-sm">© 2026 EduAI Platform. All rights reserved.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome back 👋</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {(["teacher", "parent"] as const).map(r => (
              <button key={r} onClick={() => setRole(r)} className={cn("flex-1 py-2 rounded-xl text-sm font-semibold transition-all capitalize",
                role === r ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400")}>
                {r === "teacher" ? "👩‍🏫 Teacher" : "👪 Parent"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={role === "teacher" ? "teacher@school.edu" : "parent@gmail.com"}
                  required className="input-base pl-10" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Your password" required className="input-base pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}