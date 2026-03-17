// components/dashboard/student-card.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Student } from "@/types";
import { getStatusBadgeClass, getStatusLabel, getScoreColor, getAttendanceColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StudentCardProps {
  student: Student;
  index?: number;
}

export function StudentCard({ student, index = 0 }: StudentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="card-base p-5 flex flex-col gap-4 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: student.avatarColor }}
        >
          {student.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{student.name}</h3>
            <span className={cn("badge-success text-[10px]", getStatusBadgeClass(student.status))}>
              {getStatusLabel(student.status)}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{student.section} · {student.rollNo}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-base font-bold" style={{ color: getAttendanceColor(student.attendance) }}>{student.attendance}%</div>
          <div className="text-[10px] text-gray-400">Attendance</div>
        </div>
        <div>
          <div className="text-base font-bold" style={{ color: getScoreColor(student.avgScore) }}>{student.avgScore}%</div>
          <div className="text-[10px] text-gray-400">Avg Score</div>
        </div>
        <div>
          <div className="text-base font-bold text-gray-900 dark:text-white">{student.homeworkCompleted}/{student.homeworkTotal}</div>
          <div className="text-[10px] text-gray-400">Homework</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Risk Score</span>
          <span>{student.riskScore}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all progress-animate"
            style={{
              width: `${student.riskScore}%`,
              background: student.riskScore >= 70 ? "#EF4444" : student.riskScore >= 40 ? "#F59E0B" : "#10B981"
            }}
          />
        </div>
      </div>

      <Link href={`/profile/${student.id}`} className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors pt-1 border-t border-gray-100 dark:border-gray-800">
        View Profile <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}
