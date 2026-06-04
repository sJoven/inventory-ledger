import { prisma } from "@/src/lib/prisma"; // Adjust this to your actual Prisma client path
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

type RevenueParams = {
  period?: string;
  date?: string;
};

export async function getRevenueStats(searchParams?: RevenueParams) {
  const period = searchParams?.period || "day";

  // Default to today if no date is provided
  const baseDate = searchParams?.date
    ? parseISO(searchParams.date)
    : new Date();

  // Normalize the time to the start of the specified day (00:00:00)
  const currentStart = startOfDay(baseDate);

  let currentEnd: Date;
  let prevStart: Date;
  let prevEnd = currentStart;

  // Determine date ranges based on the requested period
  if (period === "month") {
    currentEnd = addMonths(currentStart, 1);
    prevStart = subMonths(currentStart, 1);
  } else if (period === "week") {
    currentEnd = addWeeks(currentStart, 1);
    prevStart = subWeeks(currentStart, 1);
  } else {
    // Default to 'day'
    currentEnd = addDays(currentStart, 1);
    prevStart = subDays(currentStart, 1);
  }

  // Fetch both current and previous revenue in parallel for performance
  const [currentData, prevData] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: {
          gte: currentStart,
          lt: currentEnd,
        },
      },
    }),
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: {
          gte: prevStart,
          lt: prevEnd,
        },
      },
    }),
  ]);

  // Extract raw cents (fallback to 0 if null)
  const currentRevCents = currentData._sum.totalPrice || 0;
  const prevRevCents = prevData._sum.totalPrice || 0;

  // Convert cents to standard currency
  const currentRev = currentRevCents / 100;
  const prevRev = prevRevCents / 100;

  // Calculate percentage change (handling the 0/null previous revenue case)
  let percentageChange = 0;
  if (prevRevCents > 0) {
    percentageChange = ((currentRevCents - prevRevCents) / prevRevCents) * 100;
  }

  return {
    currentRev, // Formatted in standard currency (e.g., dollars)
    prevRev, // Formatted in standard currency
    percentageChange: Number(percentageChange.toFixed(2)), // Rounded to 2 decimal places
    isPositive: percentageChange >= 0, // Easy boolean for rendering green/red UI
  };
}
