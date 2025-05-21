import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { UserRole } from "@/models/User";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TruckIcon, PackageCheck, Clock, Calendar } from "lucide-react";
import {dbConnect} from "@/lib/mongodb";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";

async function getStats(staffId: string) {
  await dbConnect();
  
  const assignedRequests = await ScrapRequest.countDocuments({
    staffId,
    status: { $in: [RequestStatus.ASSIGNED, RequestStatus.EN_ROUTE] },
  });
  
  const completedRequests = await ScrapRequest.countDocuments({
    staffId,
    status: RequestStatus.COMPLETED,
  });
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const todayPickups = await ScrapRequest.countDocuments({
    staffId,
    status: { $in: [RequestStatus.ASSIGNED, RequestStatus.EN_ROUTE] },
    pickupDate: { $gte: todayStart, $lte: todayEnd },
  });
  
  return { assignedRequests, completedRequests, todayPickups };
}

export default async function StaffDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  if (session.user.role !== UserRole.STAFF) {
    redirect("/");
  }
  
  const { assignedRequests, completedRequests, todayPickups } = await getStats(session.user.id);
  
  return (
    <DashboardShell role={UserRole.STAFF} userName={session.user.name || 'Staff'}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <Link href="/staff/pickups">
            <Button>
              <TruckIcon className="mr-2 h-4 w-4" />
              View Assigned Pickups
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Assigned Pickups
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedRequests}</div>
              <p className="text-xs text-muted-foreground">
                Pending pickup requests
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today&apos;s Pickups
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayPickups}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled for today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Pickups
              </CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRequests}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Schedule</CardTitle>
              <CardDescription>
                Your pickup schedule for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayPickups > 0 ? (
                <p>Loading today&apos;s pickups...</p>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground opacity-50" />
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">No pickups scheduled for today</p>
                    <p className="text-sm text-muted-foreground">
                      Check back later or view all your assigned pickups.
                    </p>
                  </div>
                  <Link href="/staff/pickups">
                    <Button variant="outline">
                      <TruckIcon className="mr-2 h-4 w-4" />
                      View All Pickups
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}