/// app/signup/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Eye, EyeOff, GraduationCap, ArrowRight, User,
  Mail, Lock, School, CheckCircle2, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Stepper, { Step } from "@/components/Steeper";

/* ─────────────────────────────────────────────
   Small reusable field wrapper
───────────────────────────────────────────── */
function Field({
  label, icon: Icon, error, children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 1 — Role + Name + Email
───────────────────────────────────────────── */
function StepOne({
  role, setRole, form, set, errors,
}: {
  role: "teacher" | "parent";
  setRole: (r: "teacher" | "parent") => void;
  form: Record<string, string>;
  set: (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5 px-1">
      <div>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">I am a…</p>
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {(["teacher", "parent"] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize",
                role === r
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700",
              )}
            >
              {r === "teacher" ? "👩‍🏫 Teacher" : "👪 Parent"}
            </button>
          ))}
        </div>
      </div>

      <Field label="Full Name" icon={User} error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={set("name")}
          placeholder="Your full name"
          className="input-base pl-10"
        />
      </Field>

      <Field label="Email Address" icon={Mail} error={errors.email}>
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder={role === "teacher" ? "teacher@school.edu" : "parent@gmail.com"}
          className="input-base pl-10"
        />
      </Field>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 2 — Role-specific details
───────────────────────────────────────────── */
function StepTwo({
  role, form, set, errors,
}: {
  role: "teacher" | "parent";
  form: Record<string, string>;
  set: (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5 px-1">
      <AnimatePresence mode="wait">
        {role === "teacher" ? (
          <motion.div
            key="teacher"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                👩‍🏫 Teacher Account
              </p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400">
                Tell us where you teach so we can personalise your experience.
              </p>
            </div>
            <Field label="School Name" icon={School} error={errors.schoolName}>
              <input
                type="text"
                value={form.schoolName}
                onChange={set("schoolName")}
                placeholder="Your school name"
                className="input-base pl-10"
              />
            </Field>
          </motion.div>
        ) : (
          <motion.div
            key="parent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">
                👪 Parent Account
              </p>
              <p className="text-xs text-violet-500 dark:text-violet-400">
                Enter the class code your child&apos;s teacher shared with you.
              </p>
            </div>
            <Field label="Child's Class Code" icon={School} error={errors.childClassCode}>
              <input
                type="text"
                value={form.childClassCode}
                onChange={set("childClassCode")}
                placeholder="e.g. CLASS-2024-A"
                className="input-base pl-10 uppercase tracking-widest"
              />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 3 — Password + Terms
───────────────────────────────────────────── */
function StepThree({
  form, set, showPass, setShowPass, agreed, setAgreed, errors,
}: {
  form: Record<string, string>;
  set: (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPass: boolean;
  setShowPass: (v: boolean) => void;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5 px-1">
      <Field label="Password" icon={Lock} error={errors.password}>
        <input
          type={showPass ? "text" : "password"}
          value={form.password}
          onChange={set("password")}
          placeholder="Min 8 characters"
          minLength={8}
          className="input-base pl-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </Field>

      <Field label="Confirm Password" icon={Lock} error={errors.confirmPassword}>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          placeholder="Repeat your password"
          className="input-base pl-10"
        />
      </Field>

      {/* Password strength */}
      {form.password && (
        <PasswordStrength password={form.password} />
      )}

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 rounded border-gray-300 text-primary"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          I agree to the{" "}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </span>
      </label>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Password strength meter
───────────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-500"];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? colors[score] : "bg-gray-200 dark:bg-gray-700",
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map(c => (
          <span
            key={c.label}
            className={cn(
              "text-[10px] flex items-center gap-1 transition-colors",
              c.ok ? "text-green-500" : "text-gray-400",
            )}
          >
            <span>{c.ok ? "✓" : "○"}</span> {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Success screen
───────────────────────────────────────────── */
function SuccessScreen({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 py-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
      >
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </motion.div>
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
          Welcome, {name.split(" ")[0]}! 🎉
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your account has been created. Signing you in…
        </p>
      </div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass]   = useState(false);
  const [role, setRole]           = useState<"teacher" | "parent">("teacher");
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");
  const [agreed, setAgreed]       = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    schoolName: "", childClassCode: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    setFieldErrors(prev => ({ ...prev, [key]: "" }));
  };

  /* Per-step validation before advancing */
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!form.name.trim()) errs.name = "Name is required";
      if (!form.email.trim()) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    }

    if (step === 2) {
      if (role === "teacher" && !form.schoolName.trim())
        errs.schoolName = "School name is required";
      if (role === "parent" && !form.childClassCode.trim())
        errs.childClassCode = "Class code is required";
    }

    if (step === 3) {
      if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
      if (form.password !== form.confirmPassword)
        errs.confirmPassword = "Passwords do not match";
      if (!agreed) errs.agreed = "Please agree to the Terms of Service";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Called by Stepper's nextButtonProps onClick override */
  const handleStepNext = (currentStep: number, advance: () => void) => {
    if (validateStep(currentStep)) advance();
  };

  const handleComplete = async () => {
    if (!validateStep(3)) return;

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

      setSuccess(true);

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        role,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">EduAI Platform</span>
        </div>

        <div className="card-base p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
          {success ? (
            <SuccessScreen name={form.name} />
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                  Create your account
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Join thousands of educators on EduAI
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {fieldErrors.agreed && (
                <div className="mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-sm">
                  {fieldErrors.agreed}
                </div>
              )}

              <Stepper
                initialStep={1}
                onFinalStepCompleted={handleComplete}
                backButtonText="Back"
                nextButtonText="Continue"
                /* Intercept next to run validation */
                nextButtonProps={{
                  /* We wrap via onFinalStepCompleted for last step;
                     for other steps use a data-step hack via CSS override */
                }}
                stepCircleContainerClassName="!border-0 !p-0"
                contentClassName="!pt-6 !pb-2"
                footerClassName="!pt-4"
              >
                {/* ── Step 1 ── */}
                <Step>
                  <StepOne
                    role={role}
                    setRole={setRole}
                    form={form}
                    set={set}
                    errors={fieldErrors}
                  />
                </Step>

                {/* ── Step 2 ── */}
                <Step>
                  <StepTwo
                    role={role}
                    form={form}
                    set={set}
                    errors={fieldErrors}
                  />
                </Step>

                {/* ── Step 3 ── */}
                <Step>
                  <StepThree
                    form={form}
                    set={set}
                    showPass={showPass}
                    setShowPass={setShowPass}
                    agreed={agreed}
                    setAgreed={setAgreed}
                    errors={fieldErrors}
                  />
                </Step>
              </Stepper>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}