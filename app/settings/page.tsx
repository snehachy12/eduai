// app/settings/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Globe, Shield, User, School, Save, ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Moon },
  { id: "school", label: "School Info", icon: School },
  { id: "security", label: "Security", icon: Shield },
  { id: "language", label: "Language", icon: Globe },
];

interface ToggleProps { enabled: boolean; onChange: (v: boolean) => void; label: string; desc?: string; }
function Toggle({ enabled, onChange, label, desc }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
        {desc && <div className="text-xs text-gray-400 mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn("w-11 h-6 rounded-full relative transition-colors flex-shrink-0 mt-0.5", enabled ? "bg-primary" : "bg-gray-200 dark:bg-gray-700")}
      >
        <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform", enabled ? "translate-x-5" : "translate-x-1")} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState("profile");
  const [notifs, setNotifs] = useState({ attendance: true, assignments: true, messages: true, ai: true, weekly: false });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-4xl space-y-5">
        <h1 className="page-title">Settings</h1>

        <div className="flex gap-5">
          {/* Sidebar */}
          <div className="w-52 flex-shrink-0 card-base p-2">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActive(id)} className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors text-left", active === id ? "bg-primary text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800")}>
                <Icon className={cn("w-4 h-4", active === id ? "text-white" : "text-gray-400")} />
                {label}
                {active !== id && <ChevronRight className="w-3 h-3 ml-auto text-gray-300" />}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 card-base p-6">
            <motion.div key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>

              {active === "profile" && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xl font-bold">SK</div>
                    <div>
                      <button className="btn-outline text-xs py-2 px-3">Change Photo</button>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "First Name", value: "Sarah", type: "text" },
                      { label: "Last Name", value: "Kumar", type: "text" },
                      { label: "Email", value: "sarah.kumar@school.edu", type: "email" },
                      { label: "Phone", value: "+91 98765 43210", type: "tel" },
                    ].map(({ label, value, type }) => (
                      <div key={label}>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">{label}</label>
                        <input type={type} defaultValue={value} className="input-base" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Bio</label>
                      <textarea rows={2} defaultValue="Class teacher for Grade 8A. 12 years of teaching experience." className="input-base resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {active === "notifications" && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Notification Preferences</h2>
                  <p className="text-sm text-gray-400 mb-4">Choose when and how you receive notifications</p>
                  <Toggle enabled={notifs.attendance} onChange={v => setNotifs(p => ({ ...p, attendance: v }))} label="Attendance Alerts" desc="Notify when student attendance drops below 75%" />
                  <Toggle enabled={notifs.assignments} onChange={v => setNotifs(p => ({ ...p, assignments: v }))} label="Assignment Reminders" desc="Reminders for pending and overdue assignments" />
                  <Toggle enabled={notifs.messages} onChange={v => setNotifs(p => ({ ...p, messages: v }))} label="New Messages" desc="Notifications for parent messages and replies" />
                  <Toggle enabled={notifs.ai} onChange={v => setNotifs(p => ({ ...p, ai: v }))} label="AI Insights" desc="Daily AI-generated class performance updates" />
                  <Toggle enabled={notifs.weekly} onChange={v => setNotifs(p => ({ ...p, weekly: v }))} label="Weekly Summary" desc="Weekly digest of class performance and highlights" />
                </div>
              )}

              {active === "appearance" && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {(["light", "dark", "system"] as const).map(t => (
                      <button key={t} onClick={() => setTheme(t)} className={cn("p-4 rounded-xl border-2 transition-all text-sm font-medium capitalize", theme === t ? "border-primary bg-primary-light dark:bg-indigo-900/20 text-primary" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600")}>
                        <div className="text-2xl mb-2">{t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"}</div>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {active === "school" && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">School Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "School Name", value: "Delhi Public School" },
                      { label: "Board", value: "CBSE" },
                      { label: "City", value: "New Delhi" },
                      { label: "Academic Year", value: "2025–2026" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">{label}</label>
                        <input type="text" defaultValue={value} className="input-base" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(active === "security" || active === "language") && (
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{active === "security" ? "Security" : "Language & Region"}</h2>
                  <p className="text-sm text-gray-400">Settings for this section coming soon.</p>
                </div>
              )}

              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                <button onClick={save} className={cn("btn-primary flex items-center gap-2 text-sm", saved && "bg-emerald-500 hover:bg-emerald-600")}>
                  <Save className="w-4 h-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
