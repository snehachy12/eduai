import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { requireRole } from "@/lib/roleguard";
import Teacher from "@/lib/models/Teacher";
import Student from "@/lib/models/Student";

export async function POST(req: NextRequest) {
  const { error, user } = await requireRole("teacher");
  if (error) return error;

  await connectDB();

  const teacher = await Teacher.findOne({ userId: user.id });
  if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

  const body = await req.json();
  const classCode = `${body.section}-${Date.now()}`.toUpperCase();

  const student = await Student.create({
    ...body,
    teacherId: teacher._id,
    classCode,
    initials: body.name.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
  });

  await Teacher.findByIdAndUpdate(teacher._id, {
    $inc: { "stats.totalStudents": 1 },
    $push: { recentActivity: { text: `Added student ${body.name}`, time: "Just now", type: "grade" } },
  });

  return NextResponse.json(student, { status: 201 });
}