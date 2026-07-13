import { getTenProducts } from "@/src/lib/data/product";
import ProductTable from "@/src/app/admin/[id]/products/product-table";
import SearchInput from "@/src/app/admin/[id]/products/search-input";
import CreateProductButton from "@/src/app/admin/[id]/products/create-product-btn";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getExistingSKUs } from "@/src/lib/data/product";
import { isLoggedIn } from "@/src/lib/isLoggedIn";
import { getStoreCurrency } from "@/src/lib/data/store";
import { canShowAdmin, canAdmin } from "@/src/lib/canUser";
import { redirect } from "next/navigation";

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
  if (!session) {
    redirect(`/login`);
  }

  const canShowProducts = await canShowAdmin(id, "products");

  if (canShowProducts.status !== 200) {
    redirect("/admin");
  }

  const currentPage = Number(page) || 1;
  const currentQuery = query || "";

  const products = await getTenProducts(id, currentPage, currentQuery);

  const getPaginationHref = (pageNumber: number) => {
    const base = `?page=${pageNumber}`;
    return currentQuery
      ? `${base}&query=${encodeURIComponent(currentQuery)}`
      : base;
  };

  const currencyResult = await getStoreCurrency(id);
  const currency = currencyResult.success
    ? (currencyResult.data as string)
    : "PHP";

  const authCheck = await canAdmin(id, "delete_products");
  const canDelete = authCheck.status === 200;
  return (
    <div className="sm:max-w-6xl mx-auto w-full space-y-6">
      <div className="p-4 flex flex-col gap-6 w-full px-1 sm:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Products
          </h1>
          <p className="text-sm text-gray-500">
            Store ID: <span className="font-semibold text-gray-700">{id}</span>
          </p>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:justify-end">
          <div className="w-full sm:max-w-xs">
            <SearchInput placeholder="Search name or SKU..." />
          </div>

          {/* Full-width button on mobile for easier tapping */}
          <div className="w-full sm:w-auto">
            <CreateProductButton
              storeId={id}
              existingSKUs={existingSKUs}
              userId={session.user.userid}
              currency={currency}
            />
          </div>
        </div>
      </div>

      <div className="w-full min-w-0">
        <ProductTable
          products={products}
          existingSKUs={existingSKUs}
          userId={session.user.userid}
          currency={currency}
          canDelete={canDelete}
        />
      </div>

      <div className="bg-white px-6 py-4 flex items-center justify-between border border-gray-200 rounded-2xl shadow-sm sm:px-6 w-full">
        <div className="flex-1 flex justify-between sm:hidden w-full">
          <Link
            href={getPaginationHref(Math.max(1, currentPage - 1))}
            className={`relative inline-flex items-center px-4 py-2.5 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
              currentPage <= 1
                ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
            }`}
          >
            Previous
          </Link>
          <Link
            href={getPaginationHref(currentPage + 1)}
            className={`ml-3 relative inline-flex items-center px-4 py-2.5 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
              products.length < 10
                ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
            }`}
          >
            Next
          </Link>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
          <div>
            <p className="text-sm text-gray-500">
              Showing page{" "}
              <span className="font-semibold text-gray-800">{currentPage}</span>
            </p>
          </div>
          <div className="flex gap-2.5">
            <Link
              href={getPaginationHref(Math.max(1, currentPage - 1))}
              className={`inline-flex items-center gap-1.5 px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
                currentPage <= 1
                  ? "border-gray-100 text-gray-300 pointer-events-none bg-gray-50/50"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#fc6022] hover:border-[#fc6022]/30 active:scale-[0.98]"
              }`}
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
            <Link
              href={getPaginationHref(currentPage + 1)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 border text-sm font-semibold rounded-lg bg-white transition-all duration-200 shadow-sm ${
                products.length < 10
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
