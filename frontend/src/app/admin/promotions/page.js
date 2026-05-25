"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Sparkles,
  Sliders,
  Calendar,
  Power,
  Trash2,
  Tag,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PromotionForm from "@/components/PromotionForm"; // Ensure this handles campaign types
import { cn } from "@/lib/utils";

const PromotionsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCampaigns(data.promotions || []);
    } catch (error) {
      toast.error(error.message || "Failed to load promotions engine");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCampaigns();
  }, []);

  const toggleCampaignActive = async (id, currentStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/promotions/${id}/toggle`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !currentStatus }),
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Could not shift campaign deployment state");

      toast.success(
        currentStatus ? "Campaign paused" : "Campaign deployed live!",
      );
      getCampaigns();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteCampaign = async (id) => {
    if (
      !confirm(
        "Are you sure you want to permanently tear down this promotion campaign?",
      )
    )
      return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/promotions/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to clear promotion asset");

      toast.success("Promotion campaign dropped cleanly");
      getCampaigns();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetScope?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 pb-10">
      {/* Left Area: Active Storefront Rule Cards Grid */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Promotions Engine
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Deploy dynamic site-wide event sales, auto-applied cart deductions,
            or category price tiers.
          </p>
        </div>

        {/* Toolbar Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search active campaigns or targets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/30 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
            <span>Live Campaigns:</span>
            <span className="text-emerald-600 font-bold">
              {campaigns.filter((c) => c.isActive).length} deployed
            </span>
          </div>
        </div>

        {/* Dynamic Marketing Rule Cards Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-h-[calc(100vh-240px)] overflow-y-auto pr-1 scrollbar-thin">
          {filteredCampaigns.map((camp) => {
            const start = new Date(camp.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const end = new Date(camp.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={camp._id}
                className={cn(
                  "bg-white border rounded-[28px] p-6 shadow-sm flex flex-col justify-between relative group transition-all duration-300 hover:shadow-md",
                  camp.isActive
                    ? "border-gray-100"
                    : "border-dashed border-gray-200 bg-gray-50/40",
                )}
              >
                {/* Upper Meta Row */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md",
                            camp.type === "automatic"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-purple-50 text-purple-700 border border-purple-100",
                          )}
                        >
                          {camp.type || "Automatic Sale"}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground font-semibold">
                          {camp.valueText || `-${camp.discountValue}%`}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-foreground mt-1.5 leading-snug">
                        {camp.title}
                      </h3>
                    </div>

                    {/* Quick Trigger Button Controls */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          toggleCampaignActive(camp._id, camp.isActive)
                        }
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          camp.isActive
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-muted-foreground hover:bg-gray-200",
                        )}
                        title={camp.isActive ? "Pause Campaign" : "Deploy Live"}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCampaign(camp._id)}
                        className="p-2 rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Campaign Mechanics & Strategy Specs */}
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {camp.description ||
                      "No custom logic brief summary defined for this storefront promotion."}
                  </p>
                </div>

                {/* Footer Meta Segment Block */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-muted-foreground gap-2">
                  <div className="flex items-center gap-1.5 bg-secondary/40 px-3 py-1.5 rounded-xl text-[11px] font-medium text-foreground/80">
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    <span>
                      Target:{" "}
                      <strong className="font-bold text-primary">
                        {camp.targetScope || "Storewide"}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {start} - {end}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCampaigns.length === 0 && !loading && (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-100 rounded-8 text-muted-foreground text-xs italic">
              No live visual marketing rules deployed yet. Build a promotion
              scenario layout using the wizard panel.
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Dynamic Rule Engine Builder Panel Panel Container Box */}
      <div className="w-full lg:w-[400px] shrink-0 bg-white p-6 rounded-8 border border-gray-100 shadow-sm h-fit space-y-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-primary/5 border border-primary/10 rounded-xl text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-primary">
              Campaign Architecture
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Draft conditional rules logic models to adjust retail price
              structures.
            </p>
          </div>
        </div>

        <PromotionForm onSuccess={getCampaigns} />
      </div>
    </div>
  );
};

export default PromotionsPage;
