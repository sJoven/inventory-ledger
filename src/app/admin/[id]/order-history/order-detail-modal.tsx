// app/admin/[id]/order-history/order-detail-modal.tsx
"use client";

import { OrderWithCustomer } from "@/src/lib/data/order";

interface ModalProps {
  order: OrderWithCustomer | null;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: ModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-bold text-gray-900">
            Order #{order.ordernum}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <p>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Customer:</strong> {order.customer?.name || "N/A"} (
            {order.customer?.email || "No Email"})
          </p>
          <p>
            <strong>Payment Method:</strong>{" "}
            {order.payment?.method?.toUpperCase()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize font-semibold">
              {order.payment?.status}
            </span>
          </p>

          <div className="border-t pt-3 mt-3">
            <h4 className="font-semibold mb-2">Items Ordered:</h4>
            <ul className="space-y-2 bg-gray-50 p-3 rounded">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {item.productname}{" "}
                    <span className="text-gray-500">x{item.quantity}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-base text-gray-900">
            <span>Total:</span>
            <span>₱{(order.totalPrice / 100).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
