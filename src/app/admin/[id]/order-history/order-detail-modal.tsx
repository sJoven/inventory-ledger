// app/admin/[id]/order-history/order-detail-modal.tsx
"use client";

import { OrderWithCustomer } from "@/src/lib/data/order";

interface ModalProps {
  order: OrderWithCustomer | null;
  currency: string;
  onClose: () => void;
}

export default function OrderDetailModal({
  order,
  currency,
  onClose,
}: ModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        {/* Close Button - Absolute Positioned */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors z-20"
          aria-label="Close Modal"
        >
          {/* Swap out template string or plain text with an SVG icon component like Lucide's X if available */}
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight pr-8">
              Order #{order.ordernum}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Review the structural and breakdown details of this invoice
              summary.
            </p>
          </div>

          <div className="space-y-5">
            {/* Core Metadata Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
              <div className="flex flex-col">
                <span className="font-semibold text-xs mb-0.5 text-gray-500 uppercase tracking-wider">
                  Date
                </span>
                <span className="text-gray-800 font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-xs mb-0.5 text-gray-500 uppercase tracking-wider">
                  Payment Method
                </span>
                <span className="text-gray-800 font-medium uppercase">
                  {order.payment?.method || "N/A"}
                </span>
              </div>

              <div className="flex flex-col sm:col-span-2">
                <span className="font-semibold text-xs mb-0.5 text-gray-500 uppercase tracking-wider">
                  Customer
                </span>
                <span className="text-gray-800 font-medium text-sm">
                  {order.customer?.name || "N/A"}{" "}
                  <span className="text-gray-400 font-normal">
                    ({order.customer?.email || "No Email"})
                  </span>
                </span>
              </div>

              <div className="flex flex-col sm:col-span-2">
                <span className="font-semibold text-xs mb-1 text-gray-500 uppercase tracking-wider">
                  Status
                </span>
                <div>
                  <span className="capitalize text-xs font-semibold px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-800 rounded-md">
                    {order.payment?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Nested Arrays (Ordered Items) */}
            <div className="border-t border-gray-100 pt-4">
              <label className="font-semibold text-sm text-gray-700 block mb-2">
                Items Ordered
              </label>
              <ul className="space-y-2 bg-gray-50/70 border border-gray-100 p-4 rounded-xl max-h-48 overflow-y-auto">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm text-gray-800"
                  >
                    <span className="font-medium">{item.productname}</span>
                    <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-sm">
                      x{item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Layout */}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
              <span className="font-bold text-gray-800">Total Price</span>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency,
                }).format(order.totalPrice / 100)}
              </span>
            </div>

            {/* Action Buttons Stack */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#fc6022] hover:bg-[#e0541e] text-white py-3 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex justify-center items-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
