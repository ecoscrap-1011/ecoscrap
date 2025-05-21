import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongodb";
import { UserRole } from "@/lib/userRole";
import AdminUsersPage from "./AdminUsersPage";

interface IUser {
  _id: any; // or import mongoose and use mongoose.Types.ObjectId
  name: string;
  email: string;
  phoneNumber?: string | null;
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  if (session.user.role !== UserRole.ADMIN) redirect("/");

  await dbConnect();
  const users = await User.find({ role: UserRole.SELLER }).lean<IUser[]>();

const usersClean = users.map((u) => ({
  _id: u._id.toString(),
  name: u.name,
  email: u.email,
  phoneNumber: u.phoneNumber ?? undefined, // <-- here
}));

  return <AdminUsersPage users={usersClean} userName={session.user.name || "Admin"} />;
}
