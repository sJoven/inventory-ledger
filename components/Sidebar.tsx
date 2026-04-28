"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar({
  storeName,
  userName,
}: {
  storeName: string;
  userName?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Products", href: "/products" },
    { name: "Activity Logs", href: "/logs" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white border rounded-md shadow-sm text-gray-600 hover:text-black"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          // Simple X Icon
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Simple Menu Icon
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
        fixed top-0 left-0 h-full bg-white border-r z-50 transition-transform duration-300
        w-64 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 
      `}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold text-green-600 mb-1 truncate">
            {storeName}
          </h1>
          <p className="text-sm text-gray-500 border-b pb-4 truncate">
            {userName}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
