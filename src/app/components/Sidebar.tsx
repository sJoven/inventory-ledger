"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  History,
  ScrollText,
  Settings,
} from "lucide-react";

// 1. Define the props to accept the 'role'
interface SidebarProps {
  role?: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const params = useParams();
  const pathname = usePathname();

  const storeId = params?.id as string;

  if (!storeId) {
    return (
      <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-4 print:hidden">
        <p className="text-gray-500 text-sm">Select a store to view menu.</p>
      </aside>
    );
  }

  // 2. Define all possible links
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

  // 3. Filter links based on the role
  const navLinks = allNavLinks.filter((link) => {
    // If the user is a clerk, hide these specific links
    if (role === "clerk") {
      const hiddenForClerk = ["Order History", "Activity Logs", "Settings"];
      return !hiddenForClerk.includes(link.name);
    }
    // Otherwise, show all links (for owner, admin, etc.)
    return true;
  });

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen flex flex-col print:hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact
            ? pathname === link.href
            : pathname?.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-gray-400"}`}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
