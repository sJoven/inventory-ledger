"use client";

import { useState } from "react";
import { OrderWithCustomer } from "@/src/lib/data/order";
import OrderDetailModal from "./order-detail-modal";

export default function OrderHistoryTable({
  initialOrders,
  currency,
}: {
  initialOrders: OrderWithCustomer[];
  currency: string;
}) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(
    null,
  );

  const safeCurrency = currency || "PHP";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm relative overflow-hidden md:overflow-visible w-[95vw] md:w-full max-w-full">
      <div className="overflow-x-auto md:overflow-visible w-full [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent]">
        <table className="table-fixed text-left text-sm text-gray-600 border-collapse min-w-[800px] w-full">
          <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 w-32">Date</th>
              <th className="px-6 py-4 min-w-[150px]">Customer</th>
              <th className="px-6 py-4 min-w-[200px]">Email</th>
              <th className="px-6 py-4 w-32 text-right">Total Amount</th>
              <th className="px-6 py-4 w-36 text-center">Payment Status</th>
              <th className="px-6 py-4 w-32 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {initialOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500 bg-gray-50/30"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-2">🧾</span>
                    <p>No orders found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              initialOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/80 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 truncate">
                    {order.customer?.name || "Guest"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">
                    {order.customer?.email || (
                      <span className="italic text-gray-400">N/A</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right font-semibold text-gray-800 whitespace-nowrap">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: safeCurrency,
                    }).format(order.totalPrice / 100)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`font-semibold px-2.5 py-1 rounded-lg border text-xs tracking-wide ${
                        order.payment?.status === "paid"
                          ? "text-green-700 bg-green-50 border-green-200"
                          : "text-yellow-700 bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      {order.payment?.status || "Pending"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="font-medium px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#fc6022] hover:bg-[#fc6022]/10 transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          currency={safeCurrency}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
