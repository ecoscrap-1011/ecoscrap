import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/userRole";
import { dbConnect } from "@/lib/mongodb";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";
import DashboardShell from "@/components/DashboardShell";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Calendar, MapPin, Phone, Package, Clock } from "lucide-react";

export default async function CompletedPickupsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");
  if (session.user.role !== UserRole.STAFF) redirect("/");

  await dbConnect();

  // Fetch pickups with status COMPLETED for this staff
  const pickups = await ScrapRequest.find({
    staffId: session.user.id,
    status: RequestStatus.COMPLETED,
  })
    .populate("userId", "name email phoneNumber")
    .populate("scrapTypeId", "name");

  const statusStyles: Record<RequestStatus, string> = {
    [RequestStatus.ASSIGNED]: "bg-yellow-100 text-yellow-800",
    [RequestStatus.EN_ROUTE]: "bg-blue-100 text-blue-800",
    [RequestStatus.COMPLETED]: "bg-green-100 text-green-800",
    [RequestStatus.CANCELLED]: "bg-red-100 text-red-800",
    [RequestStatus.PENDING]: "bg-gray-100 text-gray-800",
    [RequestStatus.APPROVED]: "bg-teal-100 text-teal-800",
    [RequestStatus.REJECTED]: "bg-rose-100 text-rose-800",
  };

  return (
    <DashboardShell role={UserRole.STAFF} userName={session.user.name || "Staff"}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Completed Pickups</h1>
        {pickups.length === 0 ? (
          <p className="text-muted-foreground">No completed pickups found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pickups.map((pickup) => (
              <Card key={pickup._id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{pickup.scrapTypeId?.name || "Unknown Scrap"}</span>
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    Status:{" "}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusStyles[pickup.status as RequestStatus] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {pickup.status.replaceAll("_", " ")}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Pickup Date: {new Date(pickup.pickupDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Time Slot: {pickup.timeSlot}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 tex t-muted-foreground" />
                    Address: {pickup.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Customer: {pickup.userId?.name} ({pickup.userId?.phoneNumber})
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
