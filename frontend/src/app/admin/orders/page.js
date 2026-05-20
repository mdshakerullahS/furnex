"use client";

import { useEffect, useState } from "react";
import { Search, FileDown, Eye, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(data.orders);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerID.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage customer purchases and fulfillment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 text-xs font-bold uppercase tracking-widest h-10 px-5"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 text-xs font-bold uppercase tracking-widest h-10 px-5"
          >
            <FileDown className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-8 border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Order ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/30 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            Total Volume:{" "}
            <span className="text-primary font-bold">
              $
              {orders
                .reduce((acc, curr) => acc + curr.totalPrice, 0)
                .toLocaleString()}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/10">
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Order ID
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Date
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Customer
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Status
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Total
                </th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((ord) => {
                const date = new Date(ord.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr
                    key={ord._id}
                    className="hover:bg-secondary/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-medium text-muted-foreground">
                        #{ord._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{date}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {ord.customerID.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {ord.customerID.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter",
                          ord.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-600"
                            : ord.status === "Pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600",
                        )}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-primary">
                        ${ord.totalPrice.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center text-muted-foreground">
              No orders found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
