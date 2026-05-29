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
      <button
        className={`
    lg:hidden fixed top-4 left-4 p-2 bg-[#17212c] border border-[#c5c5c5]/60 rounded-md shadow-lg transition-opacity duration-300
    ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100 delay-300 z-[60]"}
  `}
        onClick={() => setIsOpen(true)}
        aria-label="Open Menu"
      >
        <svg
          className="w-5 h-5 text-white"
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
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
      fixed top-0 left-0 h-full bg-[#17212c] border-r border-white/5 z-50 
      transition-transform duration-300 ease-in-out
      w-64 flex flex-col
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 
    `}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-1">
            <h1 className="text-[1rem] font-bold text-white truncate tracking-tight uppercase">
              {storeName}
            </h1>

            <button
              className="lg:hidden -mr-2 -mt-1 p-2 text-[#c5c5c5] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>

          <p className="text-[0.875rem] text-[#c5c5c5] opacity-70 border-b border-white/10 pb-4 truncate">
            {userName}
          </p>
        </div>

        <nav className="flex-1 px-0 space-y-1 mt-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`relative flex items-center px-6 py-3 transition-all duration-200 text-[0.875rem] ${
                  isActive
                    ? "text-white bg-white/5"
                    : "text-[#c5c5c5] hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#fc6022] shadow-[2px_0_10px_rgba(252,96,34,0.4)]" />
                )}
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <p className="text-[0.75rem] text-[#c5c5c5] opacity-30 uppercase tracking-widest text-center">
            Inventory v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
