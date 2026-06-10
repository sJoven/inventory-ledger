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
      className="space-y-4 bg-white p-6 rounded-lg shadow-sm border"
    >
      <p className="text-sm text-gray-600 mb-4">
        Invite a new member to this store. If they don't have an account, one
        will be created for them.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Email Input */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={uiRole}
            onChange={(e) => setUiRole(e.target.value)}
            className="w-full border rounded-md p-2"
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
          className={`p-3 rounded text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isPending || !email}
          className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Adding..." : "Add Member"}
        </button>
      </div>
    </form>
  );
}
