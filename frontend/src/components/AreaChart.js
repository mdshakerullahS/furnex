"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  sale: {
    label: "Sale",
    color: "var(--chart-1)",
  },
};

export function ChartAreaInteractive({ data = [] }) {
  return (
    <Card className="pt-0 border-0 shadow-none">
      <CardContent className="px-0 sm:px-0 sm:pt-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
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
