// Path: src/app/api/products/search/route.ts (or your search API route path)
import { NextResponse, NextRequest } from "next/server";
import { getTenProducts } from "@/src/lib/data/product";
// Import your actual authentication/session checking function here
// import { checkAuth } from "@/src/lib/auth";
//Make sure to prompt the auth.js first

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId") || "";
  const page = searchParams.get("page") || "1";
  const query = searchParams.get("query") || "";

  // 1. Check for the secret bypass header sent by k6
  const bypassHeader = request.headers.get("x-bypass-auth");
  const bypassSecret = process.env.TEST_BYPASS_SECRET; // E.g. "super-secret-loadtest-key"

  const isBypassed = bypassSecret && bypassHeader === bypassSecret;

  // 2. The Guard Rail: Only block them if they aren't bypassed AND aren't logged in
  if (!isBypassed) {
    // const session = await checkAuth(request);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
  }

  // 3. Call your database function (unaffected and untouched by auth concerns!)
  const products = await getTenProducts(storeId, page, query);

  return NextResponse.json(products);
}
