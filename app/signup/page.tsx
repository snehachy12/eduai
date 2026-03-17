// app/signup/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, GraduationCap, ArrowRight, User, Mail, Lock, School } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass]   = useState(false);
  const [role, setRole]           = useState<"teacher" | "parent">("teacher");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [agreed, setAgreed]       = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    schoolName: "", childClassCode: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the Terms of Service"); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        role,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created! Please sign in.");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">EduAI Platform</span>
        </div>

        <div className="card-base p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1 text-center">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">Join thousands of educators on EduAI</p>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {(["teacher", "parent"] as const).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={cn("flex-1 py-2 rounded-xl text-sm font-semibold transition-all capitalize",
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
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={form.name} onChange={set("name")} placeholder="Your full name" required className="input-base pl-10" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={form.email} onChange={set("email")}
                  placeholder={role === "teacher" ? "teacher@school.edu" : "parent@gmail.com"} required className="input-base pl-10" />
              </div>
            </div>

            {role === "teacher" && (
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">School Name</label>
                <div className="relative">
                  <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.schoolName} onChange={set("schoolName")} placeholder="Your school name" required className="input-base pl-10" />
                </div>
              </div>
            )}

            {role === "parent" && (
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Child&apos;s Class Code</label>
                <div className="relative">
                  <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.childClassCode} onChange={set("childClassCode")} placeholder="Enter class code from teacher" required className="input-base pl-10" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="Min 8 characters" required minLength={8} className="input-base pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")}
                  placeholder="Repeat your password" required className="input-base pl-10" />
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer mt-2">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded border-gray-300 text-primary" />
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}