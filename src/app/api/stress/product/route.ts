import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  return Response.json(
    await createProductAction(body, body.storeId, body.userId),
  );
}

//PLEASE READ: This is a copy of @/src/app/admin/[id]/products/actions.ts
//createProductAction() function without the guard rails
//for easier performance testing..

export async function createProductAction(
  formData: any,
  storeId: string,
  userId: string,
) {
  try {
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
