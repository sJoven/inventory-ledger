import { getStoreProducts } from "@/src/lib/product";
import { getActivityLogs } from "@/src/lib/logs";
import PaginationControls from "./PaginationControls";

interface Props {
  storeId: string;
  currentPage: number;
  query?: string;
  type: "products" | "logs";
}

export default async function PaginationWrapper({
  storeId,
  currentPage,
  query,
  type,
}: Props) {
  let totalPages = 0;

  if (type === "products") {
    const data = await getStoreProducts(storeId, {
      query,
      page: currentPage,
      includeProducts: false,
      includeCount: true,
    });
    totalPages = data.totalPages;
  } else {
    const data = await getActivityLogs(storeId, currentPage);
    totalPages = data.totalPages;
  }

  return <PaginationControls total={totalPages} current={currentPage} />;
}
