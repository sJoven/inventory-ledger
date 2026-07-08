import { prisma } from "@/src/lib/prisma";
import {
  parseISO,
  subDays,
  subWeeks,
  subMonths,
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
} from "date-fns";
import { calculatePercentageChange } from "@/src/lib/calculations"; // Import the new utility

type RevenueParams = {
  period?: string;
  date?: string;
  storeId?: string;
};

export async function getRevenueStats(searchParams?: RevenueParams) {
  const period = searchParams?.period || "day";
  const storeId = searchParams?.storeId;

  const baseDate = searchParams?.date
    ? parseISO(searchParams.date)
    : new Date();

  const currentStart = startOfDay(baseDate);

  let currentEnd: Date;
  let prevStart: Date;
  let prevEnd = currentStart;

  if (period === "month") {
    currentEnd = addMonths(currentStart, 1);
    prevStart = subMonths(currentStart, 1);
  } else if (period === "week") {
    currentEnd = addWeeks(currentStart, 1);
    prevStart = subWeeks(currentStart, 1);
  } else {
    currentEnd = addDays(currentStart, 1);
    prevStart = subDays(currentStart, 1);
  }

  const [currentData, prevData] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        store_id: storeId,
        createdAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
    }),
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        store_id: storeId,
        createdAt: {
          gte: prevStart,
          lt: prevEnd,
        },
      },
    }),
  ]);

  const currentRevCents = currentData._sum.totalPrice || 0;
  const prevRevCents = prevData._sum.totalPrice || 0;

  const currentRev = currentRevCents / 100;
  const prevRev = prevRevCents / 100;

  const { percentageChange, isPositive } = calculatePercentageChange(
    currentRevCents,
    prevRevCents,
  );

  return {
    currentRev,
    prevRev,
    percentageChange,
    isPositive,
  };
}
