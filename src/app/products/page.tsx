import { auth } from "@/src/lib/auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getStoreProducts } from "@/src/lib/product";
import CreateProductModal from "@/src/components/CreateProductModal";
import SearchField from "@/src/components/SearchField";
import ProductTableWrapper from "@/src/components/ProductTableWrapper";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import TableSkeleton from "@/src/components/TableSkeleton";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const session = await auth();
  const storeId = (session?.user as any)?.store_id;

  if (!session) redirect("/login");
  if (!storeId)
    return <div className="p-10 text-center">No store associated account.</div>;

  const params = await searchParams;
  const query = params.query || "";
  const currentPage = Number(params.page) || 1;

  const { existingSkus } = await getStoreProducts(storeId, {
    query,
    page: currentPage,
    includeProducts: false,
    includeCount: false,
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4 bg-white">
        <h1 className="text-[1.5rem] font-bold text-[rgb(58,58,58)]">
          Store Products
        </h1>

        <CreateProductModal existingSkus={existingSkus} />
      </div>

      <div className="mb-6 flex items-center gap-2 md:mt-8">
        <SearchField placeholder="Search products by name or SKU..." />
      </div>

      <Suspense
        key={`content-${query}-${currentPage}`}
        fallback={
          <div className="space-y-8">
            <TableSkeleton />
            <div className="h-10 w-full animate-pulse bg-gray-50 rounded" />
          </div>
        }
      >
        <ProductTableWrapper
          storeId={storeId}
          query={query}
          page={currentPage}
          limit={10}
        />

        <div className="mt-8">
          <PaginationWrapper
            type="products"
            storeId={storeId}
            currentPage={currentPage}
            query={query}
          />
        </div>
      </Suspense>
    </div>
  );
}
