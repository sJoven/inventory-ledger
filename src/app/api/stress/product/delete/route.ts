import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  const { storeId } = await req.json();

  await prisma.$transaction([
    prisma.activityLog.deleteMany({
      where: {
        store_id: storeId,
        action: "create",
      },
    }),
    prisma.product.deleteMany({
      where: {
        store_id: storeId,
      },
    }),
  ]);

  return Response.json({ success: true });
}
