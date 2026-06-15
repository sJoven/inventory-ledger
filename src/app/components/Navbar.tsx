"use client";

import { useState } from "react";
import UserOptions from "@/src/app/components/UserOptions";

interface NavbarProps {
  user: {
    name?: string | null;
    picture?: string | null;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userName = user.name || "Guest";
  const profilePicUrl =
    user.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#17212c] border-b border-white/5 shadow-md sticky top-0 z-50 print:hidden">
      <div className="flex items-center gap-4 ml-14 lg:ml-0">
        <div className="text-white font-bold">Inventory Ledger</div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden md:block text-[0.875rem] font-medium text-[#c5c5c5]">
          {userName}
        </span>

        <div className="border-l border-white/10 pl-4 relative">
          <button
            onClick={toggleMenu}
            className="focus:outline-none focus:ring-2 focus:ring-[#fc6022]/50 rounded-full transition-all"
            aria-expanded={isMenuOpen}
          >
            <img
              src={profilePicUrl}
              alt={`${userName}'s profile`}
              className="w-9 h-9 rounded-full object-cover border border-[#c5c5c5]/30 hover:ring-2 hover:ring-[#fc6022]/50 transition-all bg-white"
            />
          </button>

          {isMenuOpen && <UserOptions />}
        </div>
      </div>
    </nav>
  );
}
