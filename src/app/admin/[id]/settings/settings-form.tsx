"use client";

import { useState, useTransition } from "react";
import { updateStoreSettings } from "@/src/app/admin/[id]/settings/actions"; // Adjust import path

type SettingsFormProps = {
  storeId: string;
  initialData: {
    store_name: string;
    store_icon: string;
    low_stock_threshold: number;
    currency: string;
    theme: string;
    allow_negative_inventory: boolean;
  };
};

export default function SettingsForm({
  storeId,
  initialData,
}: SettingsFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    startTransition(async () => {
      const result = await updateStoreSettings(storeId, formData);

      if (result.success) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save." });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm border"
    >
      {/* Store Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Store Name</label>
        <input
          type="text"
          name="store_name"
          value={formData.store_name}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      {/* Store Icon URL */}
      <div>
        <label className="block text-sm font-medium mb-1">Store Icon URL</label>
        <input
          type="url"
          name="store_icon"
          value={formData.store_icon}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Low Stock Threshold */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Low Stock Threshold
          </label>
          <input
            type="number"
            name="low_stock_threshold"
            value={formData.low_stock_threshold}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            min="0"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="PHP">PHP (₱)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      {/* Theme */}
      <div>
        <label className="block text-sm font-medium mb-1">Store Theme</label>
        <select
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
      </div>

      {/* Allow Negative Inventory */}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="allow_negative_inventory"
          name="allow_negative_inventory"
          checked={formData.allow_negative_inventory}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label
          htmlFor="allow_negative_inventory"
          className="text-sm font-medium"
        >
          Allow selling items when inventory is 0 (Negative Inventory)
        </label>
      </div>

      {/* Status Messages */}
      {message.text && (
        <div
          className={`p-3 rounded text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
