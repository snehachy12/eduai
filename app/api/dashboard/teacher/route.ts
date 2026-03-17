import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { requireRole } from "@/lib/roleguard";
import Teacher from "@/lib/models/Teacher";
import Student from "@/lib/models/Student";
import User from "@/lib/models/user";

export async function GET() {
  const { error, user } = await requireRole("teacher");
  if (error) return error;

  await connectDB();

  let teacher = await Teacher.findOne({ userId: user.id }).lean();

  // ✅ Auto-create teacher profile if missing (fixes existing accounts)
  if (!teacher) {
    const userDoc = await User.findById(user.id);
    if (!userDoc) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const created = await Teacher.create({
      userId:      userDoc._id,
      name:        userDoc.name,
      email:       userDoc.email,
      schoolName:  userDoc.schoolName ?? "My School",
      avatarColor: userDoc.avatarColor ?? "#6366f1",
      stats: {
        totalStudents:      0,
        avgAttendance:      0,
        pendingAssignments: 0,
        atRiskStudents:     0,
      },
      recentActivity: [],
    });

    teacher = created.toObject();
  }

  const students = await Student.find({ teacherId: (teacher as any)._id })
    .select("name initials section attendance avgScore status avatarColor subjects teacherFeedback classCode")
    .lean();

  const atRisk = students.filter(s => s.status === "at-risk" || s.status === "critical").length;
  const avgAtt = students.length
    ? Math.round(students.reduce((s, st) => s + st.attendance, 0) / students.length)
    : 0;

  return NextResponse.json({
    profile:  teacher,
    stats: {
      totalStudents:      students.length,
      avgAttendance:      avgAtt,
      pendingAssignments: (teacher as any).stats?.pendingAssignments ?? 0,
      atRiskStudents:     atRisk,
    },
    students,
    recentActivity: (teacher as any).recentActivity ?? [],
  });
}