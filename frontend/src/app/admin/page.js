"use client";

import { ChartAreaInteractive } from "@/components/AreaChart";
import DashboardMiniCard from "@/components/DashboardMiniCard";
import { Button } from "@/components/ui/button";
import { Download, LayoutGrid } from "lucide-react";

const kpis = [
  {
    label: "Total Revenue",
    value: 12000,
    change: 22,
    changeType: "Increase",
    prefix: "$",
  },
  {
    label: "Total Orders",
    value: 100,
    change: 18,
    changeType: "Increase",
  },
  {
    label: "Customers",
    value: 120,
    change: 4.5,
    changeType: "Increase",
  },
  {
    label: "Conversion Rate",
    value: 89.7,
    change: 1.2,
    changeType: "Decrease",
    suffix: "%",
  },
];

const Page = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time performance metrics for your store.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 text-xs font-bold uppercase tracking-widest h-10 px-5"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button
            size="sm"
            className="rounded-xl gap-2 text-xs font-bold uppercase tracking-widest h-10 px-5"
          >
            <LayoutGrid className="w-4 h-4" />
            Personalize
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, idx) => (
          <DashboardMiniCard key={idx} k={k} />
        ))}
      </div>

      {/* Interactive Chart Section */}
      <div className="bg-white p-6 rounded-8 border border-gray-100 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold">Revenue Insights</h3>
            <p className="text-xs text-muted-foreground">
              Monthly performance tracking
            </p>
          </div>
        </div>
        <ChartAreaInteractive />
      </div>
    </div>
  );
};

export default Page;
