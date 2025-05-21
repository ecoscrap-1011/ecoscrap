"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Coins } from "lucide-react"; // Default icon
import clsx from "clsx";

export default function ScrapRequestForm({
  userId,
  scrapTypes,
}: {
  userId: string;
  scrapTypes: { _id: string; name: string }[];
}) {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [formData, setFormData] = useState({
    weightKg: "",
    pickupAddress: "",
    pickupDate: "",
    notes: "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMaterialId) return alert("Please select one scrap material.");
    if (!formData.pickupDate) return alert("Please select a pickup date.");

    const payload = {
      scrapTypeId: selectedMaterialId,
      weightKg: Number(formData.weightKg),
      pickupAddress: formData.pickupAddress.trim(),
      pickupDate: new Date(formData.pickupDate),
      notes: formData.notes.trim(),
      userId,
    };

    const res = await fetch("/api/user/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    res.ok ? router.push("/user") : alert("Failed to submit scrap request.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
       
      <div className="grid grid-cols-3 gap-4">
        {scrapTypes.map((item) => (
          <button
            key={item._id}
            type="button"
            onClick={() => setSelectedMaterialId(item._id)}
            className={clsx(
              "border rounded-lg p-4 flex flex-col items-center space-y-2 transition hover:shadow-md",
              selectedMaterialId === item._id
                ? "border-blue-600 ring-2 ring-blue-300"
                : "border-gray-200"
            )}
          >
            <Coins className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium">{item.name}</span>
          </button>
        ))}
      </div>

      <Input
        type="number"
        name="weightKg"
        placeholder="Weight (in kg)"
        min="0"
        step="0.01"
        required
        value={formData.weightKg}
        onChange={handleChange}
      />

      <Input
        type="date"
        name="pickupDate"
        placeholder="Pickup Date"
        required
        value={formData.pickupDate}
        onChange={handleChange}
      />

      <Input
        name="pickupAddress"
        placeholder="Pickup Address"
        required
        value={formData.pickupAddress}
        onChange={handleChange}
      />

      <Textarea
        name="notes"
        placeholder="Additional notes (optional)"
        value={formData.notes}
        onChange={handleChange}
      />

      <Button type="submit" className="w-full">
        Submit Scrap Request
      </Button>
    </form>
  );
}
