"use client";

import Link from "next/link";
import { useSidebar } from "@/src/app/components/SidebarContext";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  History,
  ScrollText,
  Settings,
  Store,
} from "lucide-react";

interface SidebarProps {
  role?: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const { isOpen, setIsOpen } = useSidebar();
  const params = useParams();
  const pathname = usePathname();

  const storeId = params?.id as string;

  if (!storeId) return null;

  const allNavLinks = [
    {
      name: "Dashboard",
      href: `/admin/${storeId}`,
      icon: LayoutDashboard,
      exact: true,
    },
    { name: "Products", href: `/admin/${storeId}/products`, icon: Package },
    {
      name: "Order History",
      href: `/admin/${storeId}/order-history`,
      icon: History,
    },
    { name: "Activity Logs", href: `/admin/${storeId}/logs`, icon: ScrollText },
    { name: "Settings", href: `/admin/${storeId}/settings`, icon: Settings },
  ];

  const navLinks = allNavLinks.filter((link) => {
    if (role === "clerk") {
      return !["Order History", "Activity Logs", "Settings"].includes(
        link.name,
      );
    }
    return true;
  });

  return (
    <>
      <button
        className={`print:hidden lg:hidden fixed top-4 left-4 p-2 bg-[#17212c] border border-[#c5c5c5]/60 rounded-md shadow-lg transition-opacity duration-300 z-[60] ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100 delay-300"
        }`}
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
        className={`fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] bg-[#17212c] border-r border-white/5 z-40 transition-transform duration-300 ease-in-out w-64 flex flex-col print:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <nav className="flex-1 px-0 space-y-1 mt-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`relative flex items-center gap-3 px-6 py-3 transition-all duration-200 text-[0.875rem] ${
                  isActive
                    ? "text-white bg-white/5"
                    : "text-[#c5c5c5] hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#fc6022] shadow-[2px_0_10px_rgba(252,96,34,0.4)]" />
                )}
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-[#fc6022]" : "text-[#c5c5c5]"}`}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* New Other Stores Button */}
        <div className="p-4 mt-auto border-t border-white/10">
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#fc6022] hover:bg-[#e5561e] text-white rounded-md transition-colors duration-200 text-[0.875rem] font-medium shadow-md"
          >
            <Store className="w-4 h-4" />
            Other Stores
          </Link>
        </div>
      </aside>
    </>
  );
}
