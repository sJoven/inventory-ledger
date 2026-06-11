"use client";

import { useState } from "react";

// 1. Define the shape of our data
type LowStockItem = {
  name: string;
  qty: number;
};

// ==========================================
// COMPONENT 1: STOCK MODAL
// ==========================================
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800">
            All Low Stock Items
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto">
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0"
              >
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="text-red-700 font-bold bg-red-100 px-2 py-1 rounded-md text-sm">
                  Qty: {item.qty}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 2: LOW STOCK CARD (MAIN EXPORT)
// ==========================================
export default function LowStockCard({
  store_id,
  lowStockItems,
}: {
  store_id: string;
  lowStockItems: LowStockItem[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // We only show a preview of items in the card itself.
  // The rest are hidden behind the "Show More" button.
  const PREVIEW_LIMIT = 3;
  const previewItems = lowStockItems.slice(0, PREVIEW_LIMIT);
  const hasMore = lowStockItems.length > PREVIEW_LIMIT;

  return (
    <>
      {/* The Card 
        `w-full` ensures it takes up 100% of whatever grid/container you place it in. 
      */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-5">
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
                className="w-full mt-4 text-sm text-blue-700 font-semibold py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Show More ({lowStockItems.length - PREVIEW_LIMIT})
              </button>
            )}
          </div>
        )}
      </div>

      {/* The Modal */}
      <StockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={lowStockItems}
      />
    </>
  );
}
