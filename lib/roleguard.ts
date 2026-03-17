import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

type Role = "teacher" | "parent" | "admin";

export async function requireRole(...roles: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
  }
  const userRole = (session.user as any).role as Role;
  if (!roles.includes(userRole)) {
    return { error: NextResponse.json({ error: `Access denied. You are: ${userRole}` }, { status: 403 }), user: null };
  }
  return { error: null, user: session.user as any };
}