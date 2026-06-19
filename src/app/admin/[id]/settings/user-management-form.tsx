"use client";

import { useState, useTransition } from "react";
import { addMember } from "@/src/app/admin/[id]/settings/actions"; // Adjust path to where your action is

export default function UserManagementForm({ storeId }: { storeId: string }) {
  const [email, setEmail] = useState("");
  const [uiRole, setUiRole] = useState("Admin"); // UI selection state
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Map the UI role to the DB role
    let dbRole = "clerk";
    if (uiRole === "Admin") dbRole = "super";
    if (uiRole === "Manager") dbRole = "manager";

    startTransition(async () => {
      const result = await addMember(email, storeId, dbRole);

      if (result.success) {
        setMessage({ type: "success", text: "Member invited successfully!" });
        setEmail(""); // Reset the email field on success
        setUiRole("Admin"); // Reset role to default
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to add member.",
        });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
    >
      {/* Description Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Invite Member
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Invite a new member to this store. If they don't have an account, one
          will be created for them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Email Input */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#fc6022]/20 focus:border-[#fc6022] outline-none transition-all"
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Role</label>
          <select
            value={uiRole}
            onChange={(e) => setUiRole(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#fc6022]/20 focus:border-[#fc6022] outline-none transition-all"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Clerk">Clerk</option>
          </select>
        </div>
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
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending || !email}
          className="bg-[#fc6022] hover:bg-[#e0541e] text-white py-3 px-8 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
        >
          {isPending ? "Adding..." : "Add Member"}
        </button>
      </div>
    </form>
  );
}
