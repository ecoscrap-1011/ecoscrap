// components/StatusBadge.tsx
import { RequestStatus } from "@/models/ScrapRequest";

export default function StatusBadge({ status }: { status: RequestStatus }) {
  const statusStyles = {
    ASSIGNED: "bg-yellow-100 text-yellow-800",
    EN_ROUTE: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
