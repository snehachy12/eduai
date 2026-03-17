import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { requireRole } from "@/lib/roleguard";
import Parent from "@/lib/models/Parent";
import Student from "@/lib/models/Student";

export async function GET() {
  const { error, user } = await requireRole("parent");
  if (error) return error;

  await connectDB();

  const parent = await Parent.findOne({ userId: user.id }).lean();
  if (!parent) return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });

  const student = (parent as any).studentId
    ? await Student.findById((parent as any).studentId)
        .select("name initials section attendance avgScore status subjects teacherFeedback avatarColor classCode")
        .lean()
    : null;

  // Sync live stats from student doc
  const stats = student ? {
    childName:     (student as any).name,
    grade:         (student as any).section,
    attendance:    (student as any).attendance,
    homeworkDone:  (parent as any).stats?.homeworkDone ?? 0,
    homeworkTotal: (parent as any).stats?.homeworkTotal ?? 0,
    avgScore:      (student as any).avgScore,
  } : (parent as any).stats;

  return NextResponse.json({ profile: parent, student, stats });
}