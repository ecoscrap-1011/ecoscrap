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
import { Plus, ClipboardList, Check, Clock } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";
import ScrapType from "@/models/ScrapType"; // Make sure this model exists and exports properly

async function getStats(userId: string) {
  await dbConnect();

  const totalRequests = await ScrapRequest.countDocuments({ userId });
  const pendingRequests = await ScrapRequest.countDocuments({
    userId,
    status: { $in: [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.ASSIGNED] },
  });
  const completedRequests = await ScrapRequest.countDocuments({
    userId,
    status: RequestStatus.COMPLETED,
  });

  return { totalRequests, pendingRequests, completedRequests };
}

async function getRecentRequests(userId: string) {
  await dbConnect();

  const recentRequests = await ScrapRequest.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("scrapTypeId", "name")
    .lean();

  return recentRequests;
}

async function getMarketPrices() {
  await dbConnect();

  const prices = await ScrapType.find().lean();

  return prices;
}

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;
  const { totalRequests, pendingRequests, completedRequests } = await getStats(userId);
  const recentRequests = await getRecentRequests(userId);
  const marketPrices = await getMarketPrices();

  return (
    <DashboardShell role={UserRole.SELLER} userName={session.user.name || "User"}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Link href="/user/requests/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">Total scrap selling requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Requests awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Requests</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRequests}</div>
              <p className="text-xs text-muted-foreground">Successfully completed pickups</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent scrap requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {totalRequests > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentRequests.map((request) => (
                    <li key={String(request._id)} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          {request.scrapTypeId?.name ?? "Unknown Material"}
                        </p>
                        <p className="text-xs text-muted-foreground">Weight: {request.weightKg} kg</p>
                        <p className="text-xs text-muted-foreground">
                          Pickup Date: {new Date(request.pickupDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            request.status === RequestStatus.COMPLETED
                              ? "bg-green-100 text-green-800"
                              : request.status === RequestStatus.PENDING
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <ClipboardList className="h-12 w-12 text-muted-foreground opacity-50" />
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">No requests yet</p>
                    <p className="text-sm text-muted-foreground">
                      Create your first scrap selling request to get started.
                    </p>
                  </div>
                  <Link href="/user/requests/new">
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      New Request
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Market Prices</CardTitle>
              <CardDescription>Current prices for scrap materials</CardDescription>
            </CardHeader>
            <CardContent>
              {marketPrices.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {marketPrices.map((material) => (
                    <li key={String(material._id)} className="flex justify-between">
                      <span>{material.name}</span>
                      <span className="font-semibold">{material.pricePerKg} ₹/kg</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No market price data available.</p>
              )}
              <div className="mt-4">
                <Link href="/user/prices">
                  <Button variant="outline" className="w-full">
                    View All Prices
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
