import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      status: "✅ Mongoose connected",
      state: mongoose.connection.readyState, // 1 = connected
      database: mongoose.connection.name,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "❌ Failed", error: err.message },
      { status: 500 }
    );
  }
}