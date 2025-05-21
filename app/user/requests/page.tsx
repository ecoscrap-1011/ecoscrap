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

import '@/models/ScrapType'; 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import ScrapRequest, { RequestStatus } from "@/models/ScrapRequest";

function StatusBadge({ status }: { status: string }) {
  const base =
    "inline-block px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ";

  switch (status) {
    case RequestStatus.COMPLETED:
      return <span className={base + "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"}>Completed</span>;
    case RequestStatus.PENDING:
      return <span className={base + "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400"}>Pending</span>;
    case RequestStatus.APPROVED:
      return <span className={base + "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400"}>Approved</span>;
    case RequestStatus.ASSIGNED:
      return <span className={base + "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-400"}>Assigned</span>;
    case RequestStatus.REJECTED:
      return <span className={base + "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400"}>Rejected</span>;
    default:
      return <span className={base + "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}>{status}</span>;
  }
}

export default async function UserRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  await dbConnect();

  const requests = await ScrapRequest.find({ userId: session.user.id })
    .populate("scrapTypeId", "name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <DashboardShell role={UserRole.SELLER} userName={session.user.name || "User"}>
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            MY REQUESTS
          </h1>
          <Link href="/user/requests/new" passHref>
            <Button>
              <ClipboardList className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>

        {requests.length === 0 ? (
          <Card className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <ClipboardList className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50 dark:text-gray-400" />
            <CardTitle className="dark:text-gray-100">No Scrap Requests Yet</CardTitle>
            <CardDescription className="dark:text-gray-300">
              You have not created any scrap requests. Get started by creating a new
              request.
            </CardDescription>
            <div className="mt-6">
              <Link href="/user/requests/new" passHref>
                <Button variant="outline">Create Request</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req: any) => (
              <Card
                key={req._id.toString()}
                className="flex flex-col justify-between border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 p-4 rounded-md bg-white dark:bg-gray-900"
              >
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <span className="truncate">{req.scrapTypeId?.name || "Unknown Material"}</span>
                    <StatusBadge status={req.status} />
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Requested on {new Date(req.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-2 text-gray-700 dark:text-gray-300 text-sm flex-grow">
                  <p>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Weight:</span>{" "}
                    <span className="font-semibold">{req.weightKg} kg</span>
                  </p>
                  <p className="truncate">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Pickup Address:</span>{" "}
                    <span className="font-semibold">{req.pickupAddress}</span>
                  </p>
                  {req.notes && (
                    <p className="italic text-gray-500 dark:text-gray-400 text-xs truncate">
                      Notes: {req.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
