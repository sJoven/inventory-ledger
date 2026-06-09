import { getTenProducts } from "@/src/lib/data/product";
import ProductTable from "@/src/app/admin/[id]/products/product-table";
import SearchInput from "@/src/app/admin/[id]/products/search-input";
import CreateProductButton from "@/src/app/admin/[id]/products/create-product-btn";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getExistingSKUs } from "@/src/lib/data/product";
import { isLoggedIn } from "@/src/lib/isLoggedIn";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function ProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { page, query } = await searchParams;
  const existingSKUs = await getExistingSKUs(id);
  const session = await isLoggedIn();

  const currentPage = Number(page) || 1;
  const currentQuery = query || "";

  const products = await getTenProducts(id, currentPage, currentQuery);

  // Helper function to build clean pagination links keeping the search state
  const getPaginationHref = (pageNumber: number) => {
    const base = `?page=${pageNumber}`;
    return currentQuery
      ? `${base}&query=${encodeURIComponent(currentQuery)}`
      : base;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">
            Manage inventory for Store ID: {id}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-72">
            <SearchInput placeholder="Search name or SKU..." />
          </div>
          {/* Add the button here */}
          <CreateProductButton
            storeId={id}
            existingSKUs={existingSKUs}
            userId={session.user.userid}
          />
        </div>
      </div>

      {/* Table Component */}
      <ProductTable
        products={products}
        existingSKUs={existingSKUs}
        userId={session.user.userid}
      />

      {/* Simple Pagination Footer */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        {/* Mobile Layout */}
        <div className="flex-1 flex justify-between sm:hidden">
          <Link
            href={getPaginationHref(Math.max(1, currentPage - 1))}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md bg-white text-gray-700 ${
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-50"
            }`}
          >
            Previous
          </Link>
          <Link
            href={getPaginationHref(currentPage + 1)}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md bg-white text-gray-700 ${
              products.length < 10
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-50"
            }`}
          >
            Next
          </Link>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={getPaginationHref(Math.max(1, currentPage - 1))}
              className={`inline-flex items-center gap-1 px-3 py-1.5 border text-sm font-medium rounded bg-white text-gray-700 ${
                currentPage <= 1
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-gray-50"
              }`}
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
            <Link
              href={getPaginationHref(currentPage + 1)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 border text-sm font-medium rounded bg-white text-gray-700 ${
                products.length < 10
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-gray-50"
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
