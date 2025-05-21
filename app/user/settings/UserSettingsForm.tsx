"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export interface UserSettingsFormProps {
  initialData: {
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    pincode?: string | null;
    notes?: string | null;
  };
  onSubmit: (data: {
    phone: string;
    address: string;
    city: string;
    pincode: string;
    notes: string;
  }) => void;
}

export default function UserSettingsForm({ initialData, onSubmit }: UserSettingsFormProps) {
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  // Sync form state with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        phone: initialData.phone || "",
        address: initialData.address || "",
        city: initialData.city || "",
        pincode: initialData.pincode || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto space-y-4
                 bg-white dark:bg-gray-900
                 p-6 rounded-md
                 border border-gray-200 dark:border-gray-700
                 text-gray-900 dark:text-gray-100"
    >
      <Input
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
        className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <Input
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <Input
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <Input
        name="pincode"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={handleChange}
        className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <Textarea
        name="notes"
        placeholder="Additional Notes"
        value={formData.notes}
        onChange={handleChange}
        className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <Button
        type="submit"
        className="w-full
                   bg-green-600 dark:bg-green-500
                   hover:bg-green-700 dark:hover:bg-green-600
                   text-white"
      >
        Save Settings
      </Button>
    </form>
  );
}
