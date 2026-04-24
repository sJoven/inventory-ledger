import { getStoreProducts } from "@/lib/product";
import ProductTable from "@/components/ProductTable";

export default async function ProductTableWrapper({
  storeId,
  query,
  page,
  limit,
}: {
  storeId: string;
  query: string;
  page: number;
  limit: number;
}) {
  const { products } = await getStoreProducts(storeId, {
    query,
    page,
    limit,
    includeCount: false,
  });

  return <ProductTable products={products} />;
}
