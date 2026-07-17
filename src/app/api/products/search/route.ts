import { NextResponse, NextRequest } from "next/server";
import { getTenProducts } from "@/src/app/api/products/search/product";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId") || "";
  const page = searchParams.get("page") || "1";
  const query = searchParams.get("query") || "";

  const products = await getTenProducts(storeId, page, query);

  return NextResponse.json(products);
}
