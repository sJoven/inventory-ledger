"use client";

import { useState } from "react";

type LowStockItem = {
  name: string;
  qty: number;
};

function StockModal({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: LowStockItem[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 pb-2">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            All Low Stock Items
          </h2>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors z-20"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
        <div className="p-6 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent]">
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <span className="font-semibold text-gray-700">{item.name}</span>
                <span className="text-[#fc6022] font-bold bg-[#fc6022]/10 px-3 py-1 rounded-lg text-sm">
                  {item.qty} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function LowStockCard({
  store_id,
  lowStockItems,
}: {
  store_id: string;
  lowStockItems: LowStockItem[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const PREVIEW_LIMIT = 3;
  const previewItems = lowStockItems.slice(0, PREVIEW_LIMIT);
  const hasMore = lowStockItems.length > PREVIEW_LIMIT;

  return (
    <>
      <div className="w-full p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Inventory Alerts</h3>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {lowStockItems.length} Items Low
          </span>
        </div>

        {lowStockItems.length === 0 ? (
          <p className="text-sm text-gray-500">
            All products are sufficiently stocked.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Item Preview List */}
            <ul className="space-y-2">
              {previewItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600 truncate mr-3">
                    {item.name}
                  </span>
                  <span className="text-red-600 font-semibold whitespace-nowrap">
                    {item.qty} left
                  </span>
                </li>
              ))}
            </ul>

            {/* Show More Button */}
            {hasMore && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-4 text-sm text-[#fc6022] font-semibold py-2 bg-[#fc6022]/10 hover:bg-[#fc6022]/20 rounded-lg transition-colors"
              >
                Show More ({lowStockItems.length - PREVIEW_LIMIT})
              </button>
            )}
          </div>
        )}
      </div>

      <StockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={lowStockItems}
      />
    </>
  );
}
