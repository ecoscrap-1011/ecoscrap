import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import ScrapRequestForm from "@/components/ScrapRequestForm";
import DashboardShell from "@/components/DashboardShell";
import { UserRole } from "@/models/User";
import ScrapType from "@/models/ScrapType";
import { dbConnect } from "@/lib/mongodb";

export default async function NewRequestPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  await dbConnect();

  const scrapTypesRaw = await ScrapType.find().lean();

  // Fix the typing issue here by mapping only required fields
  const scrapTypes: { _id: string; name: string }[] = scrapTypesRaw.map(
    (type: any) => ({
      _id: String(type._id),
      name: type.name,
    })
  );

  return (
    <DashboardShell role={UserRole.SELLER} userName={session.user.name || "User"}>
      <h1 className="text-2xl font-semibold mb-4">NEW REQUEST</h1>
      <ScrapRequestForm userId={session.user.id} scrapTypes={scrapTypes} />
    </DashboardShell>
  );
}
