import Link from "next/link";
import { getTenOrders } from "@/src/lib/data/order";
import OrderHistoryTable from "@/src/app/admin/[id]/order-history/order-history-table"; // We bundle the client interaction safely here
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getStoreCurrency } from "@/src/lib/data/store";
import { canShowAdmin } from "@/src/lib/canUser";
import { redirect } from "next/navigation";
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

  const canShowOrder = await canShowAdmin(id, "order");

  if (canShowOrder.status !== 200) {
    redirect("/admin");
  }

  const currentPage = Number(page) || 1;
  const { orders, totalPages } = await getTenOrders(id, currentPage);

  const currencyResult = await getStoreCurrency(id);
  const currency = currencyResult.success
    ? (currencyResult.data as string)
    : "PHP";

  return (
    <div className="w-full space-y-6 md:px-8 lg:px-12">
      <div className="flex p-6 flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Order History
        </h1>
        <p className="text-sm text-gray-500">
          Store ID: <span className="font-semibold text-gray-700">{id}</span>
        </p>
      </div>

      {/* Interactive Table Wrapper */}
      <OrderHistoryTable initialOrders={orders} currency={currency} />

      {/* Simple Pagination Footer */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        {/* Mobile View */}
        <div className="flex-1 flex justify-between sm:hidden">
          <Link
            href={`?page=${Math.max(1, currentPage - 1)}`}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
              currentPage <= 1
                ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
            }`}
          >
            Previous
          </Link>
          <Link
            href={`?page=${currentPage + 1}`}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
              totalPages < 10
                ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
            }`}
          >
            Next
          </Link>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
          <div>
            <p className="text-sm text-gray-500">
              Showing page{" "}
              <span className="font-semibold text-gray-800">{currentPage}</span>
            </p>
          </div>
          <div className="flex gap-2.5">
            <Link
              href={`?page=${Math.max(1, currentPage - 1)}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
                currentPage <= 1
                  ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
              }`}
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
            <Link
              href={`?page=${currentPage + 1}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
                totalPages < 10
                  ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
              }`}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
