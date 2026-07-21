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
      className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
    >
      {/* Store Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">
          Store Name
        </label>
        <input
          type="text"
          name="store_name"
          value={formData.store_name}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#fc6022]/20 focus:border-[#fc6022] outline-none transition-all"
          required
        />
      </div>

      {/* Store Icon URL */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">
          Store Icon URL
        </label>
        <input
          type="url"
          name="store_icon"
          value={formData.store_icon}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#fc6022]/20 focus:border-[#fc6022] outline-none transition-all"
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Low Stock Threshold */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Low Stock Threshold
          </label>
          <input
            type="number"
            name="low_stock_threshold"
            value={formData.low_stock_threshold}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#fc6022]/20 focus:border-[#fc6022] outline-none transition-all"
            min="0"
          />
        </div>

        {/* Currency */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#fc6022]/20 focus:border-[#fc6022] outline-none transition-all"
          >
            <option value="PHP">PHP (₱)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      {/* Theme */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            Store Theme
          </label>
          {/* In-Development Reminder */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-500">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            NOTE: The theme settings is currently in-development
          </span>
        </div>

        <select
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#fc6022]/20 focus:border-[#fc6022] outline-none transition-all"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
      </div>

      {/* Allow Negative Inventory */}
      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          id="allow_negative_inventory"
          name="allow_negative_inventory"
          checked={formData.allow_negative_inventory}
          onChange={handleChange}
          className="h-5 w-5 rounded border-gray-300 text-[#fc6022] focus:ring-[#fc6022]"
        />
        <label
          htmlFor="allow_negative_inventory"
          className="text-sm font-medium text-gray-700"
        >
          Allow negative inventory sales
        </label>
      </div>

      {/* Status Messages */}
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#fc6022] hover:bg-[#e0541e] text-white py-3 px-4 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
      >
        {isPending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
