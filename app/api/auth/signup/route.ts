// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/user";
import Teacher from "@/lib/models/Teacher";
import Parent from "@/lib/models/Parent";
import Student from "@/lib/models/Student";

/* ── Types ───────────────────────────────────────────────────────── */
interface SignupBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "teacher" | "parent";
  schoolName?: string;
  childClassCode?: string;
}

interface MongoError {
  code?: number;
  message: string;
}

/* ── POST /api/auth/signup ───────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body: SignupBody = await req.json();
    const { name, email, password, confirmPassword, role, schoolName, childClassCode } = body;

    /* ── 1. Input validation ─────────────────────────────────────── */
    if (!name?.trim() || !email?.trim() || !password || !role)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    if (!/\S+@\S+\.\S+/.test(email))
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });

    if (password !== confirmPassword)
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    if (!["teacher", "parent"].includes(role))
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });

    if (role === "teacher" && !schoolName?.trim())
      return NextResponse.json({ error: "School name is required" }, { status: 400 });

    if (role === "parent" && !childClassCode?.trim())
      return NextResponse.json({ error: "Class code is required" }, { status: 400 });

    /* ── 2. Duplicate email check ────────────────────────────────── */
    const exists = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    if (exists)
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    /* ── 3. For parents: verify class code exists ────────────────── */
    let student = null;
    if (role === "parent") {
      student = await Student.findOne({
        classCode: childClassCode!.toUpperCase().trim(),
      }).lean();

      // Class code not found — warn but still allow signup
      // Remove the early return below if you want to hard-block invalid codes
      if (!student) {
        console.warn(`[signup] Parent signed up with unknown class code: ${childClassCode}`);
      }
    }

    /* ── 4. Create base user ─────────────────────────────────────── */
    const user = await User.create({
      name:  name.trim(),
      email: email.toLowerCase().trim(),
      password,   // hashing should be in the User model pre-save hook
      role,
    });

    /* ── 5. Create role-specific profile ─────────────────────────── */
    if (role === "teacher") {
      await Teacher.create({
        userId:      user._id,
        name:        name.trim(),
        email:       email.toLowerCase().trim(),
        schoolName:  schoolName!.trim(),
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
      await Parent.create({
        userId:         user._id,
        name:           name.trim(),
        email:          email.toLowerCase().trim(),
        childClassCode: childClassCode!.toUpperCase().trim(),
        studentId:      student ? (student as { _id: unknown })._id : null,
        avatarColor:    user.avatarColor,
        stats: student
          ? {
              childName:     (student as Record<string, unknown>).name,
              grade:         (student as Record<string, unknown>).section,
              attendance:    (student as Record<string, unknown>).attendance,
              homeworkDone:  0,
              homeworkTotal: 0,
              avgScore:      (student as Record<string, unknown>).avgScore,
            }
          : {
              childName: "", grade: "", attendance: 0,
              homeworkDone: 0, homeworkTotal: 0, avgScore: 0,
            },
      });
    }

    /* ── 6. Success ──────────────────────────────────────────────── */
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id:   user._id.toString(),
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    );

  } catch (err: unknown) {
    const error = err as MongoError;
    console.error("[signup] error:", error.message);

    // MongoDB duplicate key (race condition between findOne and create)
    if (error.code === 11000)
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}