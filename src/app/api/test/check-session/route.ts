import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";

export async function GET() {
  const session = await auth();
  console.log("Next.js DATABASE_URL:", process.env.DATABASE_URL);
  return NextResponse.json({
    authenticated: !!session,
    user: session?.user ?? null,
  });
}
