import { prisma } from "@/src/lib/prisma";
import { subDays, format } from "date-fns";

export async function getTrendData(
  store_id: string,
  searchParams: { period?: string; date?: string },
) {
  const period = searchParams.period || "week";
  const threeDaysAgo = subDays(new Date(), 3);
  const startDateStr = searchParams.date || format(threeDaysAgo, "yyyy-MM-dd");
  const startDate = new Date(startDateStr);
  const now = new Date();

  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  let buckets = 0;

  if (period === "day") {
    endDate.setDate(startDate.getDate() + 1);
    buckets = 24; // 24 hours
  } else if (period === "week") {
    endDate.setDate(startDate.getDate() + 7);
    buckets = 7; // 7 days
  } else if (period === "month") {
    endDate.setMonth(startDate.getMonth() + 1);
    buckets = Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  // 2. Fetch all orders for this period
  const orders = await prisma.order.findMany({
    where: {
      store_id: store_id,
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      createdAt: true,
      totalPrice: true,
    },
  });

  // 3. Initialize chart data array
  const chartData: { label: string; revenue: number | null }[] = [];
  let totalRevenueCents = 0;

  // 4. Build the buckets and map the data
  for (let i = 0; i < buckets; i++) {
    const bucketStart = new Date(startDate);
    const bucketEnd = new Date(startDate);

    let label = "";

    if (period === "day") {
      bucketStart.setHours(startDate.getHours() + i);
      bucketEnd.setHours(startDate.getHours() + i + 1);
      label = `${bucketStart.getHours().toString().padStart(2, "0")}:00`;
    } else {
      bucketStart.setDate(startDate.getDate() + i);
      bucketEnd.setDate(startDate.getDate() + i + 1);
      label = bucketStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    // Check if this bucket is in the future
    if (bucketStart > now) {
      chartData.push({ label, revenue: null });
      continue;
    }

    // Filter orders that fall into this specific bucket
    const bucketOrders = orders.filter(
      (o) => o.createdAt >= bucketStart && o.createdAt < bucketEnd,
    );

    // Sum the total price (in cents)
    const bucketRevenueCents = bucketOrders.reduce(
      (sum, o) => sum + o.totalPrice,
      0,
    );

    totalRevenueCents += bucketRevenueCents;

    // Push converted dollars to chart
    chartData.push({
      label,
      revenue: bucketRevenueCents / 100,
    });
  }

  return {
    chartData,
    totalRevenue: totalRevenueCents / 100,
  };
}
