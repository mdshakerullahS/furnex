"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "@/stores/userStore";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { user } = useAuth();

  if (!user) {
    router.push("/login");
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/me`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error("Couldn't fetch orders");
        setOrders(data.orders || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err.message || "Couldn't fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter strategy mapping
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    if (!matchesSearch) return false;
    if (activeTab === "all") return true;
    if (activeTab === "processing")
      return order.status === "processing" || order.status === "pending";
    if (activeTab === "shipped")
      return order.status === "shipped" || order.status === "delivered";
    return true;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      processing: "bg-blue-50 text-blue-700 border-blue-100",
      shipped: "bg-purple-50 text-purple-700 border-purple-100",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
      cancelled: "bg-gray-100 text-gray-600 border-gray-200",
    };

    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle2,
      cancelled: AlertCircle,
    };

    const Icon = icons[status] || Package;
    const cleanStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border",
          styles[status],
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        {cleanStatus}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Upper Context Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
          My Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track active shipments, manage return options, and review your
          purchase history.
        </p>
      </div>

      {/* Filter and Query Pipeline */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex gap-2 w-full sm:w-auto">
          {["all", "processing", "shipped"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200",
                activeTab === tab
                  ? "bg-primary text-white shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              {tab === "all" ? "All Orders" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order ID or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary/40 border-transparent rounded-xl text-xs focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Main Activity Stream Content Area */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-44 w-full bg-secondary/20 animate-pulse rounded-3xl"
            />
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-6 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Card Meta Segment Header */}
              <div className="bg-secondary/20 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-xs">
                <div>
                  <p className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    Order Placed
                  </p>
                  <p className="font-medium text-foreground mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    Total Amount
                  </p>
                  <p className="font-bold text-primary mt-0.5">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    Order Reference
                  </p>
                  <p className="font-mono text-foreground font-medium mt-0.5">
                    {order._id}
                  </p>
                </div>
                <div className="sm:text-right flex sm:justify-end">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Product Line-Item List Area */}
              <div className="p-6 divide-y divide-gray-50">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Image Placeholder Frame */}
                      <div className="w-16 h-16 bg-secondary/30 rounded-xl border border-gray-100 shrink-0 flex items-center justify-center text-muted-foreground">
                        <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Operations Context Footer Row */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                {order.trackingNumber ? (
                  <div className="text-muted-foreground flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    <span>
                      Tracking ID:{" "}
                      <strong className="font-mono font-bold text-foreground">
                        {order.trackingNumber}
                      </strong>
                    </span>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-[11px]">
                    Preparing for shipment processing window.
                  </p>
                )}

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <Link
                    href={`/account/orders/${order._id}`}
                    className="flex items-center gap-1 bg-white hover:bg-secondary/40 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full sm:w-auto justify-center"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty History State View Box */
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-8 max-w-md mx-auto px-6">
          <div className="w-12 h-12 bg-primary/5 border border-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-foreground">
            No purchases recorded
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            You haven't placed any architectural interior design showroom or
            premium line orders with us yet.
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center bg-primary text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md shadow-primary/10 hover:-translate-y-0.5 transition-transform"
            >
              Browse The Collection
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
