// types/index.ts

export type Role = "teacher" | "parent";

export type AttendanceStatus = "present" | "absent" | "late";
export type AssignmentStatus = "completed" | "pending" | "late";
export type StudentStatus = "excellent" | "good" | "average" | "at-risk" | "critical";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Student {
  id: string;
  name: string;
  initials: string;
  email: string;
  grade: string;
  section: string;
  rollNo: string;
  avatarColor: string;
  attendance: number;
  avgScore: number;
  homeworkCompleted: number;
  homeworkTotal: number;
  status: StudentStatus;
  riskScore: number;
  subjects: SubjectScore[];
  attendanceHistory: MonthlyAttendance[];
  teacherFeedback: string;
  parentName: string;
  parentEmail: string;
  lastActive: string;
}

export interface SubjectScore {
  name: string;
  score: number;
  color: string;
  trend: "up" | "down" | "stable";
}

export interface MonthlyAttendance {
  month: string;
  present: number;
  total: number;
  percentage: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  status: AssignmentStatus;
  submittedCount: number;
  totalCount: number;
  icon: string;
  iconBg: string;
  description?: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: AttendanceStatus;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: Role;
  participantInitials: string;
  participantColor: string;
  studentName: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
  online: boolean;
}

export interface AIInsight {
  id: string;
  type: "alert" | "warning" | "positive" | "recommendation";
  title: string;
  description: string;
  studentId?: string;
  subject?: string;
  priority: "high" | "medium" | "low";
  actionLabel?: string;
}

export interface DashboardStats {
  teacher: {
    totalStudents: number;
    avgAttendance: number;
    pendingAssignments: number;
    atRiskStudents: number;
  };
  parent: {
    childName: string;
    grade: string;
    attendance: number;
    homeworkDone: number;
    homeworkTotal: number;
    avgScore: number;
  };
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  section?: string;
}

export interface ChatBotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
