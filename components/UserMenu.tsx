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
        className="w-9 h-9 rounded-full border border-[#c5c5c5]/30 cursor-pointer hover:ring-2 hover:ring-[#fc6022]/50 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
            <div className="px-4 py-3 text-[0.875rem] font-bold text-[#3a3a3a] border-b border-gray-50 md:hidden bg-gray-50/50">
              {user.name}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-left px-4 py-2.5 text-[0.875rem] text-[#3a3a3a] hover:bg-[#fc6022] hover:text-white transition-colors font-medium flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
