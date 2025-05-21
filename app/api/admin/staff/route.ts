import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import {dbConnect} from "@/lib/mongodb";
import User from "@/models/User";
import { UserRole } from "@/lib/userRole";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await dbConnect();

  const staffUsers = await User.find({ role: UserRole.STAFF }).select("name email phoneNumber");

  return NextResponse.json(staffUsers);
}
