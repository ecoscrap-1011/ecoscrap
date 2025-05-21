import DashboardShell from "@/components/DashboardShell";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { UserRole } from '@/lib/userRole'; 
import dynamic from "next/dynamic";

// Dynamically import the client component
const UserSettings = dynamic(() => import("@/components/UserSettings"), {
  ssr: false,
});

export default async function UserSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardShell role={UserRole.SELLER} userName={session.user.name || "User"}>
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <UserSettings />
      </div>
    </DashboardShell>
  );
}
