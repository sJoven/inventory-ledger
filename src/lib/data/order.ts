// app/admin/[id]/order-history/order.ts
import { prisma } from "@/src/lib/prisma"; // Adjust this import based on your project structure

export interface OrderWithCustomer {
  id: string;
  createdAt: Date;
  ordernum: string;
  totalPrice: number;
  payment: {
    status: string;
    method: string;
  };
  customer: {
    name: string | null;
    email: string | null;
  };
  items: Array<{
    productid: string;
    productname: string;
    quantity: number;
  }>;
}

export async function getTenOrders(storeId: string, page: number) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where: { store_id: storeId },
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
          items: true,
          payment: true,
        },
      }),
      prisma.order.count({
        where: { store_id: storeId },
      }),
    ]);

    const totalPages = Math.ceil(totalOrders / pageSize);

    return {
      orders: orders as unknown as OrderWithCustomer[],
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { orders: [], totalPages: 0, currentPage: page };
  }
}
