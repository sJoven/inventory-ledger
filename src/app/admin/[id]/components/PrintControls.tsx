"use client";

import { useEffect } from "react";

export default function PrintControls() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-6 p-6 w-full flex items-center justify-between print:hidden">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">
          Ready to Print
        </span>
        <span className="text-xs text-gray-500">
          Review the data below. Ready to print or save as PDF.
        </span>
      </div>

      <button
        onClick={() => window.print()}
        className="px-4 py-2 bg-[#fc6022] hover:bg-[#e0541e] text-white text-sm font-medium rounded-lg transition-colors shadow-sm active:scale-[0.98]"
      >
        Open Print Dialog
      </button>
    </div>
  );
}
