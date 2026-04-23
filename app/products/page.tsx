import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProductTable from "@/components/ProductTable";
import CreateProductModal from "@/components/CreateProductModal";
import PaginationControls from "@/components/PaginationControls";
import SearchField from "@/components/SearchField";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const session = await auth();
  const storeId = (session?.user as any)?.store_id;

  if (!session) {
    redirect("/login");
  }

  if (!storeId) {
    return (
      <div className="p-10 text-center">
        No store associated with this account.
      </div>
    );
  }

  const params = await searchParams;
  const query = params.query || "";
  const currentPage = Number(params.page) || 1;
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const whereClause = {
    store_id: storeId,
    is_deleted: false,
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { sku: { contains: query, mode: "insensitive" as const } },
    ],
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        sku: true,
        quantity: true,
      },
      orderBy: { id: "desc" },
      take: limit,
      skip: skip,
    }),
    prisma.product.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Store Products</h1>
        <CreateProductModal existingProducts={products} />
      </div>

      <div className="mb-6 flex items-center gap-2 md:mt-8">
        <SearchField placeholder="Search products by name or SKU..." />
      </div>

      <ProductTable products={products} />

      <div className="mt-8">
        <PaginationControls total={totalPages} current={currentPage} />
      </div>
    </div>
  );
}
