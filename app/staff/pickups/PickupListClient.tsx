"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Phone, Package, Clock } from "lucide-react";

export enum RequestStatus {
  ASSIGNED = "ASSIGNED",
  EN_ROUTE = "EN_ROUTE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Pickup {
  _id: string;
  status: RequestStatus;
  pickupDate: string; // ISO string
  timeSlot: string;
  address: string;
  scrapTypeId: {
    name: string;
  };
  userId: {
    name: string;
    phoneNumber: string;
  };
}

interface Props {
  pickups: Pickup[];
}

const statusStyles: Record<RequestStatus, string> = {
  [RequestStatus.ASSIGNED]: "bg-yellow-100 text-yellow-800",
  [RequestStatus.EN_ROUTE]: "bg-blue-100 text-blue-800",
  [RequestStatus.COMPLETED]: "bg-green-100 text-green-800",
  [RequestStatus.CANCELLED]: "bg-red-100 text-red-800",
  [RequestStatus.PENDING]: "bg-gray-100 text-gray-800",
  [RequestStatus.APPROVED]: "bg-teal-100 text-teal-800",
  [RequestStatus.REJECTED]: "bg-rose-100 text-rose-800",
};

const PickupListClient: React.FC<Props> = ({ pickups }) => {
  const [localPickups, setLocalPickups] = useState<Pickup[]>(pickups);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    setLoadingId(id); // show loading for this pickup

    try {
      const response = await fetch("/api/pickups/update-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pickupId: id, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Failed to update status: ${data.message || "Unknown error"}`);
        setLoadingId(null);
        return;
      }

      // Update local state with new status after successful API call
      setLocalPickups((prev) =>
        prev.map((pickup) =>
          pickup._id === id ? { ...pickup, status: newStatus } : pickup
        )
      );
    } catch (error) {
      alert("Network error while updating status.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Assigned Pickups</h1>
      {localPickups.length === 0 ? (
        <p className="text-muted-foreground">No pickups assigned at the moment.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {localPickups.map((pickup) => (
            <Card key={pickup._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{pickup.scrapTypeId.name}</span>
                  <Package className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  Status:{" "}
                  <select
                    value={pickup.status}
                    disabled={loadingId === pickup._id}
                    onChange={(e) =>
                      handleStatusChange(
                        pickup._id,
                        e.target.value as RequestStatus
                      )
                    }
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusStyles[pickup.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {Object.values(RequestStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
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
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Address: {pickup.address}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Customer: {pickup.userId.name} ({pickup.userId.phoneNumber})
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PickupListClient;
