"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function UserSettings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const session = await getSession();
      if (session?.user) {
        setFormData({
          name: session.user.name || "",
          email: session.user.email || "",
          phone: "",
          address: "",
          city: "",
          pincode: "",
          notes: "",
        });
      }
    }
    fetchUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update settings");

      router.refresh();
      alert("Settings updated successfully");
    } catch (error) {
      alert("Error updating settings");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        max-w-3xl mx-auto space-y-8 p-6 
        bg-white dark:bg-gray-900 
        rounded-lg shadow-md dark:shadow-lg
        border border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-gray-100
      "
    >
      <h1 className="text-3xl font-semibold text-center">User Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="name"
          type="text"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="
            bg-gray-50 dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
          className="
            bg-gray-50 dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
        <Input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="
            bg-gray-50 dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
        <Input
          name="city"
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="
            bg-gray-50 dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
        <Input
          name="pincode"
          type="text"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="
            bg-gray-50 dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
      </div>

      <Textarea
        name="address"
        placeholder="Address"
        rows={3}
        value={formData.address}
        onChange={handleChange}
        className="
          bg-gray-50 dark:bg-gray-800 
          text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
        "
      />

      <Textarea
        name="notes"
        placeholder="Additional Notes (optional)"
        rows={3}
        value={formData.notes}
        onChange={handleChange}
        className="
          bg-gray-50 dark:bg-gray-800 
          text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
        "
      />

      <Button
        type="submit"
        className="
          w-full text-lg font-medium
          bg-green-600 dark:bg-green-500
          hover:bg-green-700 dark:hover:bg-green-600
          text-white
        "
      >
        Save Settings
      </Button>
    </form>
  );
}
