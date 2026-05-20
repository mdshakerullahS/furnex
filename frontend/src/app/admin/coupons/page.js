"use client";

import { useEffect, useState } from "react";
import { Search, Percent, Calendar, Ticket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CouponForm from "@/components/CouponForm";
import { cn } from "@/lib/utils";

const Page = () => {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getCoupons = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Could not delete coupon");
      toast.success("Coupon removed");
      getCoupons(); // Refresh the list
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 pb-10">
      {/* Left Container: List View */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Promotions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage discount codes and track campaign performance.
          </p>
        </div>

        {/* Table/Data Wrapper */}
        <div className="bg-white rounded-8 border border-gray-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary/30 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Active Campaigns:{" "}
              <span className="text-primary font-bold">
                {coupons.filter((c) => c.isActive).length}
              </span>
            </div>
          </div>

          {/* Table Elements */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/10">
                  <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                    Coupon Details
                  </th>
                  <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                    Redemptions
                  </th>
                  <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                    Status
                  </th>
                  <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                    Validity Window
                  </th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCoupons.map((coupon) => {
                  const start = new Date(coupon.startDate).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" },
                  );
                  const end = new Date(coupon.endDate).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  );

                  return (
                    <tr
                      key={coupon._id}
                      className="hover:bg-secondary/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                            {coupon.discountType === "percentage" ? (
                              <Percent className="w-4 h-4" />
                            ) : (
                              <Ticket className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground tracking-wide uppercase font-mono">
                              {coupon.code}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {coupon.title}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground pl-8">
                        {coupon.usageCount || 0}
                        {coupon.maxUsage && (
                          <span className="text-xs text-muted-foreground font-normal">
                            {" "}
                            / {coupon.maxUsage}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tighter",
                            coupon.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-muted-foreground",
                          )}
                        >
                          {coupon.isActive ? "Active" : "Expired"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                          <span>
                            {start} — {end}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-rose-50 text-muted-foreground hover:text-rose-600 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredCoupons.length === 0 && !loading && (
              <div className="p-16 text-center text-xs text-muted-foreground italic">
                No active voucher campaigns found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Container: Sidebar Panel Creation Form */}
      <div className="w-full lg:w-[380px] shrink-0 bg-white p-6 rounded-8 border border-gray-100 shadow-sm h-fit">
        <div className="mb-6">
          <h3 className="font-serif font-bold text-lg text-primary">
            Create Voucher
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generate a new promotional rate code.
          </p>
        </div>
        <CouponForm onSuccess={getCoupons} />
      </div>
    </div>
  );
};

export default Page;
