import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import { UserRole } from "@/lib/userRole";
import "@/models/ScrapType";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";
import DashboardShell from "@/components/DashboardShell";
import PickupListClient from "./PickupListClient";

import { Types } from "mongoose";

interface PickupFromDB {
  _id: Types.ObjectId;
  status: RequestStatus;
  pickupDate: Date;
  timeSlot: string;
  pickupAddress: string;
  scrapTypeId?: { name: string };
  userId?: { name: string; phoneNumber: string };
}

// Client expected type
interface Pickup {
  _id: string;
  status: RequestStatus;
  pickupDate: string;
  timeSlot: string;
  address: string;
  scrapTypeId: { name: string };
  userId: { name: string; phoneNumber: string };
}

export default async function StaffPickupsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");
  if (session.user.role !== UserRole.STAFF) redirect("/");

  await dbConnect();

  const pickupsFromDB = await ScrapRequest.find({
    staffId: session.user.id,
    status: { $in: [RequestStatus.ASSIGNED, RequestStatus.EN_ROUTE] },
  })
    .populate("userId", "name phoneNumber") // only fields you need
    .populate("scrapTypeId", "name")
    .lean<PickupFromDB[]>();

  console.log("Raw pickupsFromDB:", JSON.stringify(pickupsFromDB, null, 2)); // Debug

  const pickups: Pickup[] = pickupsFromDB.map((pickup) => ({
    _id: pickup._id.toString(),
    status: pickup.status,
    pickupDate: pickup.pickupDate.toISOString(),
    timeSlot: pickup.timeSlot || "", // fallback empty string
    address: pickup.pickupAddress || "No address provided",
    scrapTypeId: {
      name: pickup.scrapTypeId?.name || "Unknown Scrap",
    },
    userId: {
      name: pickup.userId?.name || "Unknown User",
      phoneNumber: pickup.userId?.phoneNumber || "N/A",
    },
  }));

  console.log("Final pickups passed to client:", pickups); // Debug

  return (
    <DashboardShell role={UserRole.STAFF} userName={session.user.name || "Staff"}>
      <PickupListClient pickups={pickups} />
    </DashboardShell>
  );
}
