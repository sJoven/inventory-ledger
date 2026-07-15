import { createProductAction } from "@/src/app/admin/[id]/products/actions";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  return Response.json(
    await createProductActionMock(body, body.storeId, body.userId),
  );
}

export async function createProductActionMock(
  formData: any,
  storeId: string,
  userId: string,
) {
  try {
    // canAdmin mocked
    const authCheck = { status: 200 };

    if (authCheck.status !== 200) {
      return {
        success: false,
        error: "Forbidden",
      };
    }

    await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          store_id: storeId,
          sku: formData.sku,
          name: formData.name,
          image: formData.image,
          description: formData.description,
          quantity: formData.quantity,
          price: formData.price,
          version: 0,
        },
      });

      await tx.activityLog.create({
        data: {
          store_id: storeId,
          user_id: userId,
          action: "create",
          doc_id: newProduct.id,
        },
      });
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Database error",
    };
  }
}
