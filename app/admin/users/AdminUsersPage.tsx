"use client";

import { useState, useMemo } from "react";
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

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

interface AdminUsersPageProps {
  users: User[];
  userName: string;
}

export default function AdminUsersPage({ users, userName }: AdminUsersPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term (name, email, phone)
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lower) ||
        user.email.toLowerCase().includes(lower) ||
        (user.phoneNumber && user.phoneNumber.includes(lower))
    );
  }, [searchTerm, users]);

  return (
    <DashboardShell role={UserRole.ADMIN} userName={userName}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>

        <Card className="shadow-md">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Registered Sellers</CardTitle>
              <CardDescription>List of all seller accounts on the platform</CardDescription>
            </div>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name, email or phone"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-md">
                <thead>
                  <tr className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t hover:bg-accent transition-colors"
                      >
                        <td className="p-3 font-medium text-foreground">{user.name || "—"}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.phoneNumber || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center p-4 text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
