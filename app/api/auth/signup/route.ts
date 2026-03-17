import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, confirmPassword, role, schoolName, childClassCode } = await req.json();

    // Validations
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }
    if (role === "teacher" && !schoolName) {
      return NextResponse.json({ error: "School name is required for teachers" }, { status: 400 });
    }
    if (role === "parent" && !childClassCode) {
      return NextResponse.json({ error: "Class code is required for parents" }, { status: 400 });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      schoolName:     role === "teacher" ? schoolName     : undefined,
      childClassCode: role === "parent"  ? childClassCode : undefined,
    });

    return NextResponse.json({
      message: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 });

  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}