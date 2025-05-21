import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { UserRole } from "@/lib/userRole";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";
import User from "@/models/User";
import AssignStaffClient from "./AssignStaffClient";

interface Request {
  _id: string;
  userId: { name: string; email: string };
  scrapTypeId: { name: string };
  weightKg: number;
  status: RequestStatus;
  pickupDate: string;
  pickupAddress: string;
  notes?: string;
  staffId?: { _id: string; name: string } | null;
}

interface Staff {
  _id: string;
  name: string;
}

export default async function AdminRequestsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  if (session.user.role !== UserRole.ADMIN) redirect("/");

  await dbConnect();

  const requests: Request[] = JSON.parse(
    JSON.stringify(
      await ScrapRequest.find({})
        .populate("userId", "name email")
        .populate("scrapTypeId", "name")
        .populate("staffId", "name")
        .lean()
    )
  );

  const staffList: Staff[] = JSON.parse(
    JSON.stringify(await User.find({ role: UserRole.STAFF }).select("name").lean())
  );

  return (
    <DashboardShell role={UserRole.ADMIN} userName={session.user.name || "Admin"}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Scrap Requests</h1>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>All Requests</CardTitle>
              <CardDescription>Click any request to view details & assign staff</CardDescription>
            </div>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <AssignStaffClient requests={requests} staffList={staffList} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
