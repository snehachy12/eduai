import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/user";
import Teacher from "@/lib/models/Teacher";
import Parent from "@/lib/models/Parent";
import Student from "@/lib/models/Student";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, confirmPassword, role, schoolName, childClassCode } = await req.json();

    if (!name || !email || !password || !role)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    if (password !== confirmPassword)
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    if (role === "teacher" && !schoolName)
      return NextResponse.json({ error: "School name is required" }, { status: 400 });

    if (role === "parent" && !childClassCode)
      return NextResponse.json({ error: "Class code is required" }, { status: 400 });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    // Step 1 — create user
    const user = await User.create({ name, email, password, role });

    // Step 2 — create role-specific profile
    if (role === "teacher") {
      await Teacher.create({
        userId:     user._id,
        name,
        email:      email.toLowerCase(),
        schoolName: schoolName ?? "Unknown School",
        avatarColor: user.avatarColor,
        stats: {
          totalStudents:      0,
          avgAttendance:      0,
          pendingAssignments: 0,
          atRiskStudents:     0,
        },
        recentActivity: [],
      });

    } else if (role === "parent") {
      const student = await Student.findOne({ classCode: childClassCode.toUpperCase() });

      await Parent.create({
        userId:         user._id,
        name,
        email:          email.toLowerCase(),
        childClassCode: childClassCode.toUpperCase(),
        studentId:      student?._id ?? null,
        avatarColor:    user.avatarColor,
        stats: student ? {
          childName:     student.name,
          grade:         student.section,
          attendance:    student.attendance,
          homeworkDone:  0,
          homeworkTotal: 0,
          avgScore:      student.avgScore,
        } : {
          childName: "", grade: "", attendance: 0,
          homeworkDone: 0, homeworkTotal: 0, avgScore: 0,
        },
      });
    }

    return NextResponse.json({ message: "Account created", role }, { status: 201 });

  } catch (err: any) {
    console.error("Signup error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}