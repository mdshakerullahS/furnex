"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardMiniCard = ({ k }) => {
  const isIncrease = k.changeType === "Increase";

  return (
    <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">
        {k.label}
      </p>

      <div className="flex items-baseline justify-between">
        <h4 className="text-2xl font-bold tracking-tight">
          {k.prefix}
          {k.value.toLocaleString()}
          {k.suffix}
        </h4>

        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
            isIncrease
              ? "text-emerald-600 bg-emerald-50"
              : "text-rose-600 bg-rose-50",
          )}
        >
          {isIncrease ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {k.change}%
        </div>
      </div>

      {/* Decorative progress line for that "Premium" feel */}
      <div className="mt-4 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000",
            isIncrease ? "bg-primary/40" : "bg-rose-300",
          )}
          style={{ width: `${Math.min(k.change * 4, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default DashboardMiniCard;
