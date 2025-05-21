import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { UserRole } from '@/lib/userRole'; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dbConnect } from "@/lib/mongodb";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";
import User from "@/models/User";
import ScrapType from "@/models/ScrapType";
import {
  Users,
  PackageCheck,
  TrendingUp,
  ClipboardList,
  Clock,
  Check,
  X,
} from "lucide-react";
import RequestOverviewChart from "@/components/RequestOverviewChart";

async function getStats() {
  await dbConnect();

  const totalUsers = await User.countDocuments({ role: UserRole.SELLER });
  const totalStaff = await User.countDocuments({ role: UserRole.STAFF });
  const totalMaterials = await ScrapType.countDocuments();

  const pendingRequests = await ScrapRequest.countDocuments({
    status: RequestStatus.PENDING,
  });
  const assignedRequests = await ScrapRequest.countDocuments({
    status: { $in: [RequestStatus.ASSIGNED, RequestStatus.EN_ROUTE] },
  });
  const completedRequests = await ScrapRequest.countDocuments({
    status: RequestStatus.COMPLETED,
  });
  const cancelledRequests = await ScrapRequest.countDocuments({
    status: { $in: [RequestStatus.CANCELLED, RequestStatus.REJECTED] },
  });

  // Mock chart data - replace with real calculation if needed
  const chartData = [
    { name: "Jan", requests: 65, value: 2400 },
    { name: "Feb", requests: 59, value: 2210 },
    { name: "Mar", requests: 80, value: 2900 },
    { name: "Apr", requests: 81, value: 2780 },
    { name: "May", requests: 56, value: 1890 },
    { name: "Jun", requests: 55, value: 2390 },
    { name: "Jul", requests: 40, value: 3490 },
  ];

  return {
    totalUsers,
    totalStaff,
    totalMaterials,
    pendingRequests,
    assignedRequests,
    completedRequests,
    cancelledRequests,
    chartData,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/");
  }

  const stats = await getStats();

  return (
    <DashboardShell
      role={UserRole.ADMIN}
      userName={session.user.name || "Admin"}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Registered Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Total registered sellers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStaff}</div>
              <p className="text-xs text-muted-foreground">Active collection staff</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Material Types</CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMaterials}</div>
              <p className="text-xs text-muted-foreground">Active scrap materials</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
              <CardTitle>Requests Overview</CardTitle>
              <CardDescription>Monthly request trends and value</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <RequestOverviewChart data={stats.chartData} />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Request Status</CardTitle>
              <CardDescription>Current status of all scrap requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <span className="text-sm font-medium">{stats.pendingRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">In Progress</span>
                  </div>
                  <span className="text-sm font-medium">{stats.assignedRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <span className="text-sm font-medium">{stats.completedRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Cancelled/Rejected</span>
                  </div>
                  <span className="text-sm font-medium">{stats.cancelledRequests}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
