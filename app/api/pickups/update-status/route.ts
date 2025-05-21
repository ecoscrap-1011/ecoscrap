// app/api/pickups/update-status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
import { UserRole } from "@/lib/userRole";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";
import User from "@/models/User"; // assuming you have a User model

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // ✅ Check if user exists in the DB and has STAFF role
  const dbUser = await User.findById(session.user.id);
  if (!dbUser || dbUser.role !== UserRole.STAFF) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { pickupId, status } = await request.json();

  if (!pickupId || !Object.values(RequestStatus).includes(status)) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const pickup = await ScrapRequest.findById(pickupId);
  if (!pickup) {
    return NextResponse.json({ message: "Pickup not found" }, { status: 404 });
  }

  // ✅ Ensure the pickup belongs to the logged-in staff
  if (pickup.staffId.toString() !== dbUser._id.toString()) {
    return NextResponse.json({ message: "Not your assigned pickup" }, { status: 403 });
  }

  pickup.status = status;
  await pickup.save();

  return NextResponse.json({ message: "Status updated successfully" });
}
