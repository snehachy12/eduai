// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { StudentStatus, RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusBadgeClass(status: StudentStatus): string {
  const map: Record<StudentStatus, string> = {
    excellent: "badge-success",
    good: "badge-success",
    average: "badge-blue",
    "at-risk": "badge-warning",
    critical: "badge-danger",
  };
  return map[status] || "badge-blue";
}

export function getStatusLabel(status: StudentStatus): string {
  const map: Record<StudentStatus, string> = {
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    "at-risk": "At Risk",
    critical: "Critical",
  };
  return map[status] || status;
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "critical";
  if (score >= 50) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function getRiskColor(score: number): string {
  if (score >= 70) return "#EF4444";
  if (score >= 50) return "#F59E0B";
  if (score >= 30) return "#6366F1";
  return "#10B981";
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "#10B981";
  if (score >= 70) return "#6366F1";
  if (score >= 55) return "#F59E0B";
  return "#EF4444";
}

export function getAttendanceColor(pct: number): string {
  if (pct >= 90) return "#10B981";
  if (pct >= 75) return "#6366F1";
  if (pct >= 60) return "#F59E0B";
  return "#EF4444";
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + "…" : str;
}

export function processAIQuery(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("risk") || q.includes("alert") || q.includes("danger"))
    return "at-risk";
  if (q.includes("summary") || q.includes("class") || q.includes("overview") || q.includes("summarize"))
    return "class-summary";
  if (q.includes("arjun") || q.includes("dropping") || q.includes("decline") || q.includes("falling"))
    return "arjun";
  if (q.includes("vikram") || q.includes("parent") || q.includes("notify") || q.includes("absent") || q.includes("message"))
    return "vikram";
  return "default";
}
