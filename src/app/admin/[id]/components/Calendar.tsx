"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// ------------------------------------------------------------------
// Export 1: The Calendar Icon Trigger
// ------------------------------------------------------------------
export function CalendarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-600 bg-white border border-gray-200 rounded-md shadow-sm hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center justify-center"
      aria-label="Open date selector"
    >
      <CalendarIcon size={20} />
    </button>
  );
}

// ------------------------------------------------------------------
// Export 2: The Pop-up Modal
// ------------------------------------------------------------------
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

  // State for the selections
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [dateValue, setDateValue] = useState("");

  // Reset the input value whenever the period changes
  useEffect(() => {
    setDateValue("");
  }, [period]);

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!dateValue) return; // Prevent confirming empty selections

    // 1. Create a new URLSearchParams object from the current URL
    const params = new URLSearchParams(searchParams.toString());

    // 2. Set the new parameters
    params.set("period", period);
    params.set("date", dateValue);

    // 3. Update the URL and close the modal
    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Header: Title & X Button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Select Date Range
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6">
          {/* Period Selection */}
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
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              2. Select {period === "day" ? "Date" : "Start Date"}
            </label>

            {/* Always uses type="date" to ensure a consistent, standard calendar UI. 
              When week/month is selected, this value acts as the starting point.
            */}
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleConfirm}
            disabled={!dateValue}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
