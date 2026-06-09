"use client";

import { useState } from "react";
import { OrderWithCustomer } from "@/src/lib/data/order";
import OrderDetailModal from "./order-detail-modal";

export default function OrderHistoryTable({
  initialOrders,
}: {
  initialOrders: OrderWithCustomer[];
}) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(
    null,
  );

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b">
          <tr>
            <th className="p-4">Date</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Email</th>
            <th className="p-4">Total Amount</th>
            <th className="p-4">Payment Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {initialOrders.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-400">
                No orders found.
              </td>
            </tr>
          ) : (
            initialOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">{order.customer?.name || "Guest"}</td>
                <td className="p-4 text-gray-500">
                  {order.customer?.email || "N/A"}
                </td>
                <td className="p-4 font-semibold text-gray-900">
                  ₱{(order.totalPrice / 100).toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.payment?.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.payment?.status || "Pending"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Triggering the External Modal Component */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
