import Link from "next/link";
import { getTenOrders } from "@/src/lib/data/order";
import OrderHistoryTable from "@/src/app/admin/[id]/order-history/order-history-table"; // We bundle the client interaction safely here
import { ArrowLeft, ArrowRight } from "lucide-react";
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function OrderHistoryPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const { orders, totalPages } = await getTenOrders(id, currentPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-500 text-sm">Store ID: {id}</p>
      </div>

      {/* Interactive Table Wrapper */}
      <OrderHistoryTable initialOrders={orders} />

      {/* Simple Pagination Footer */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <Link
            href={`?page=${Math.max(1, currentPage - 1)}`}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md bg-white text-gray-700 ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-50"}`}
          >
            Previous
          </Link>
          <Link
            href={`?page=${currentPage + 1}`}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md bg-white text-gray-700 ${totalPages < 10 ? "pointer-events-none opacity-50" : "hover:bg-gray-50"}`}
          >
            Next
          </Link>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`?page=${Math.max(1, currentPage - 1)}`}
              className={`inline-flex items-center gap-1 px-3 py-1.5 border text-sm font-medium rounded bg-white text-gray-700 ${currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
            <Link
              href={`?page=${currentPage + 1}`}
              className={`inline-flex items-center gap-1 px-3 py-1.5 border text-sm font-medium rounded bg-white text-gray-700 ${totalPages < 10 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
