"use client";

import { useState } from "react";

interface Request {
  _id: string;
  userId: { name: string; email: string };
  scrapTypeId: { name: string };
  weightKg: number;
  status: string;
  pickupDate: string;
  pickupAddress: string;
  notes?: string;
  staffId?: { _id: string; name: string } | null;
}

interface Staff {
  _id: string;
  name: string;
}

interface Props {
  requests: Request[];
  staffList: Staff[];
}

function statusBadgeColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-blue-100 text-blue-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function AssignStaffClient({ requests, staffList }: Props) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  const openModal = (req: Request) => {
    setSelectedRequest(req);
    setSelectedStaffId(req.staffId?._id || "");
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setSelectedStaffId("");
  };

  async function assignStaff() {
    if (!selectedRequest) return;
    if (!selectedStaffId) {
      alert("Please select a staff member.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/requests/${selectedRequest._id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: selectedStaffId }),
      });

      if (!res.ok) throw new Error("Failed to assign staff");

      alert("Staff assigned successfully!");
      closeModal();
      // Optionally refresh data or update UI here
    } catch (err) {
      alert("Error assigning staff");
      console.error(err);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No requests found.</p>
        )}

        {requests.map((req) => (
          <div
            key={req._id}
            onClick={() => openModal(req)}
            className="cursor-pointer border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{req.scrapTypeId.name}</h3>
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusBadgeColor(
                  req.status
                )}`}
              >
                {req.status}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              <strong>User:</strong> {req.userId.name}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Weight:</strong> {req.weightKg} kg
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Pickup Date:</strong>{" "}
              {new Date(req.pickupDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Pickup Address:</strong>{" "}
              {req.pickupAddress.length > 40
                ? req.pickupAddress.slice(0, 40) + "..."
                : req.pickupAddress}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">Request Details</h2>

            <div className="space-y-3 mb-6">
              <p>
                <strong>User:</strong> {selectedRequest.userId.name} (
                {selectedRequest.userId.email})
              </p>
              <p>
                <strong>Scrap Type:</strong> {selectedRequest.scrapTypeId.name}
              </p>
              <p>
                <strong>Weight (Kg):</strong> {selectedRequest.weightKg}
              </p>
              <p>
                <strong>Pickup Date:</strong>{" "}
                {new Date(selectedRequest.pickupDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Pickup Address:</strong> {selectedRequest.pickupAddress}
              </p>
              {selectedRequest.notes && (
                <p>
                  <strong>Notes:</strong> {selectedRequest.notes}
                </p>
              )}
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 text-sm font-semibold rounded ${statusBadgeColor(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
              </p>
              <p>
                <strong>Assigned Staff:</strong>{" "}
                {selectedRequest.staffId ? selectedRequest.staffId.name : "None"}
              </p>
            </div>

            {/* Assign Staff Dropdown */}
            {(selectedRequest.status === "PENDING" ||
              selectedRequest.status === "APPROVED") && (
              <div className="mb-4">
                <label
                  htmlFor="staff-select"
                  className="block font-medium mb-2 text-gray-700"
                >
                  Assign Staff
                </label>
                <select
                  id="staff-select"
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Select Staff --</option>
                  {staffList.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded"
                onClick={closeModal}
              >
                Close
              </button>
              {(selectedRequest.status === "PENDING" ||
                selectedRequest.status === "APPROVED") && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded"
                  onClick={assignStaff}
                >
                  Assign Staff
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
