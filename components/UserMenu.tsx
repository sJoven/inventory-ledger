"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <img
        src={user.image || "/default-avatar.png"}
        alt="Profile"
        referrerPolicy="no-referrer"
        className="w-10 h-10 rounded-full border cursor-pointer hover:opacity-80 transition"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20 py-1">
            <div className="px-4 py-2 text-sm text-gray-500 border-b md:hidden">
              {user.name}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
