"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", sale: 222 },
  { date: "2024-04-02", sale: 97 },
  { date: "2024-04-03", sale: 167 },
  { date: "2024-04-04", sale: 242 },
  { date: "2024-04-05", sale: 373 },
  { date: "2024-04-06", sale: 301 },
  { date: "2024-04-07", sale: 245 },
  { date: "2024-04-08", sale: 409 },
  { date: "2024-04-09", sale: 59 },
  { date: "2024-04-10", sale: 261 },
  { date: "2024-04-11", sale: 327 },
  { date: "2024-04-12", sale: 292 },
  { date: "2024-04-13", sale: 342 },
  { date: "2024-04-14", sale: 137 },
  { date: "2024-04-15", sale: 120 },
  { date: "2024-04-16", sale: 138 },
  { date: "2024-04-17", sale: 446 },
  { date: "2024-04-18", sale: 364 },
  { date: "2024-04-19", sale: 243 },
  { date: "2024-04-20", sale: 89 },
  { date: "2024-04-21", sale: 137 },
  { date: "2024-04-22", sale: 224 },
  { date: "2024-04-23", sale: 138 },
  { date: "2024-04-24", sale: 387 },
  { date: "2024-04-25", sale: 215 },
  { date: "2024-04-26", sale: 75 },
  { date: "2024-04-27", sale: 383 },
  { date: "2024-04-28", sale: 122 },
  { date: "2024-04-29", sale: 315 },
  { date: "2024-04-30", sale: 454 },
  { date: "2024-05-01", sale: 165 },
  { date: "2024-05-02", sale: 293 },
  { date: "2024-05-03", sale: 247 },
  { date: "2024-05-04", sale: 385 },
  { date: "2024-05-05", sale: 481 },
  { date: "2024-05-06", sale: 498 },
  { date: "2024-05-07", sale: 388 },
  { date: "2024-05-08", sale: 149 },
  { date: "2024-05-09", sale: 227 },
  { date: "2024-05-10", sale: 293 },
  { date: "2024-05-11", sale: 335 },
  { date: "2024-05-12", sale: 197 },
  { date: "2024-05-13", sale: 197 },
  { date: "2024-05-26", sale: 213 },
  { date: "2024-05-27", sale: 420 },
  { date: "2024-05-28", sale: 233 },
  { date: "2024-05-29", sale: 78 },
  { date: "2024-05-30", sale: 340 },
  { date: "2024-05-31", sale: 178 },
  { date: "2024-06-01", sale: 178 },
  { date: "2024-06-02", sale: 470 },
  { date: "2024-06-03", sale: 103 },
  { date: "2024-06-13", sale: 81 },
  { date: "2024-06-14", sale: 426 },
  { date: "2024-06-15", sale: 307 },
  { date: "2024-06-16", sale: 371 },
  { date: "2024-06-17", sale: 475 },
  { date: "2024-06-18", sale: 107 },
  { date: "2024-06-19", sale: 341 },
  { date: "2024-06-20", sale: 408 },
  { date: "2024-06-21", sale: 169 },
  { date: "2024-06-22", sale: 317 },
  { date: "2024-06-23", sale: 480 },
  { date: "2024-06-24", sale: 132 },
  { date: "2024-06-25", sale: 141 },
  { date: "2024-06-26", sale: 434 },
  { date: "2024-06-27", sale: 448 },
  { date: "2024-06-28", sale: 149 },
  { date: "2024-06-29", sale: 103 },
  { date: "2024-06-30", sale: 446 },
];

const chartConfig = {
  sale: {
    label: "Sale",
    color: "var(--chart-1)",
  },
};

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            Showing total sales for the last{" "}
            {timeRange === "90d"
              ? "3 months"
              : timeRange === "30d"
                ? "30 days"
                : "7 days"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <linearGradient id="fillSale" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-sale)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-sale)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="sale"
              type="natural"
              fill="url(#fillSale)"
              stroke="var(--color-sale)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
