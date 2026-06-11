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
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between print:hidden">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-blue-900">
          Ready to Print
        </span>
        <span className="text-xs text-blue-700">
          Review the data below. Ready to print or save as PDF.
        </span>
      </div>

      {/* 2. Wire up the button using standard React onClick */}
      <button
        onClick={() => window.print()}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        Open Print Dialog
      </button>
    </div>
  );
}
