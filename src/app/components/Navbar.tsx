"use client";

import { useState } from "react";
import UserOptions from "./UserOptions";

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

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white shadow-md">
      <div className="text-xl font-bold">{userName}</div>

      <div className="relative flex items-center">
        <button
          onClick={toggleMenu}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
          aria-expanded={isMenuOpen}
        >
          <img
            src={profilePicUrl}
            alt={`${userName}'s profile`}
            className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-gray-300 transition-colors bg-white"
          />
        </button>

        {isMenuOpen && <UserOptions />}
      </div>
    </nav>
  );
}
