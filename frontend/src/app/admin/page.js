"use client";

import { useState, useEffect } from "react";
import { ChartAreaInteractive } from "@/components/AreaChart";
import DashboardMiniCard from "@/components/DashboardMiniCard";
import { Button } from "@/components/ui/button";
import {
  Download,
  Loader2,
  Calendar as CalendarIcon,
  Package,
  User as UserIcon,
} from "lucide-react";

const Page = () => {
  const [kpis, setKpis] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d"); // 7d, 30d, 90d, all

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/overview`;

        if (dateRange !== "all") {
          const days = parseInt(dateRange.replace("d", ""));
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(endDate.getDate() - days);
          url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
        }

        const res = await fetch(url, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setKpis(data.kpis || []);
          setChartData(data.chartData || []);
          setRecentOrders(data.recentOrders || []);
          setTopProducts(data.topProducts || []);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch dashboard overview data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [dateRange]);

  const handleDateChange = (e) => {
    setDateRange(e.target.value);
  };

  // format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
        <div className="flex flex-wrap items-center gap-2">
          {/* Custom Date Range Selector */}
          <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3 h-10 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <CalendarIcon className="w-4 h-4 text-muted-foreground mr-2" />
            <select
              value={dateRange}
              onChange={handleDateChange}
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 text-xs font-bold uppercase tracking-widest h-10 px-5"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
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
                <h3 className="text-lg font-serif font-bold">
                  Revenue Insights
                </h3>
                <p className="text-xs text-muted-foreground">
                  Performance tracking for the selected period
                </p>
              </div>
            </div>
            <ChartAreaInteractive data={chartData} />
          </div>

          {/* New Bottom Grid: Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-8 border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold">
                    Recent Orders
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Latest transactions from your store.
                  </p>
                </div>
              </div>
              <div className="p-0 flex-1 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/50 text-xs uppercase text-muted-foreground font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">Customer</th>
                      <th className="px-6 py-4 font-bold">Date</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                              {order.customerID?.avatar ? (
                                <img
                                  src={order.customerID.avatar}
                                  alt="Avatar"
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <UserIcon className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-xs">
                                {order.customerID?.name || "Guest User"}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {order.customerID?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-medium">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "Canceled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-xs">
                          ${order.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-muted-foreground text-sm"
                        >
                          No recent orders found in this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Selling Products List */}
            <div className="bg-white rounded-8 border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50">
                <h3 className="text-lg font-serif font-bold">Top Products</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Best performers by volume.
                </p>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-4">
                {topProducts.map((product, idx) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-200/50">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {product.totalSold} units sold
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-xs text-primary">
                        ${product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    No sales data available in this period.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
