"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { TrendingUp } from "lucide-react";

type ChartDataPoint = {
  label: string;
  revenue: number | null;
};

export default function RevenueChartClient({
  data,
  totalRevenue,
  currency,
}: {
  data: ChartDataPoint[];
  totalRevenue: number;
  currency: string;
}) {
  const safeCurrency = currency || "PHP";
  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: safeCurrency,
  }).format(totalRevenue);
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">{formattedRevenue}</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
          <TrendingUp size={24} />
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(value: number) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any) =>
                [`$${Number(value).toFixed(2)}`, "Revenue"] as any
              }
              labelStyle={{
                color: "#374151",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563EB"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#2563EB" }}
              connectNulls={false} // CRITICAL: This breaks the line if value is null (future date)
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
