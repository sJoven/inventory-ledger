import { NextRequest, NextResponse } from "next/server";
import { getTenProducts } from "@/src/lib/data/product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const storeId = searchParams.get("storeId")!;
  const page = searchParams.get("page") ?? "1";
  const query = searchParams.get("query") ?? "";

  const products = await getTenProducts(storeId, page, query);

  return NextResponse.json(products);
}
