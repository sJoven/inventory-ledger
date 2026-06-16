"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function CalendarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-600 bg-white border border-gray-200 rounded-md shadow-sm hover:text-[#fc6022] hover:bg-orange-50 hover:border-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6022] transition-all flex items-center justify-center"
      aria-label="Open date selector"
    >
      <CalendarIcon size={20} />
    </button>
  );
}

export function DateSelectionPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [dateValue, setDateValue] = useState("");

  useEffect(() => {
    setDateValue("");
  }, [period]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!dateValue) return;
    const params = new URLSearchParams(searchParams.toString());

    params.set("period", period);
    params.set("date", dateValue);

    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Select Date Range
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6022]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              1. Select Period
            </label>
            <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg">
              {(["day", "week", "month"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                    period === p
                      ? "bg-white text-[#fc6022] shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6022]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              2. Select {period === "day" ? "Date" : "Start Date"}
            </label>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc6022] focus:border-[#fc6022]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6022] transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleConfirm}
            disabled={!dateValue}
            className="px-4 py-2 text-sm font-medium text-white bg-[#fc6022] rounded-lg hover:bg-[#e0551d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#fc6022]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
