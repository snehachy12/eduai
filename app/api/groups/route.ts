import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Group from "@/lib/models/group";
import { getServerSession } from "next-auth";
import User from "@/lib/models/user";

// GET — all groups for the logged-in user
export async function GET() {
  await connectDB();
  const session = await getServerSession();
  const user = await User.findOne({ email: session?.user?.email });

  const groups = await Group.find({
    "members.userId": user._id
  })
  .populate("members.userId", "name email role avatarColor online")
  .lean();

  return NextResponse.json(groups);
}

// POST — create a new group with role-based members
export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession();
  const creator = await User.findOne({ email: session?.user?.email });

  const { name, description, members } = await req.json();
  // members: [{ userId: string, role: string }]

  const group = await Group.create({
    name,
    description,
    isGroup: true,
    createdBy: creator._id,
    members: [
      { userId: creator._id, role: creator.role },
      ...members,
    ],
  });

  const populated = await group.populate("members.userId", "name email role avatarColor");
  return NextResponse.json(populated, { status: 201 });
}