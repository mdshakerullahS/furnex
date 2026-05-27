"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  Clock,
  CheckCircle2,
  Package,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error("Error fetching order");
        setOrder(data.order);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-secondary/30 rounded-lg" />
        <div className="h-40 w-full bg-secondary/20 rounded-[28px]" />
        <div className="h-80 w-full bg-secondary/20 rounded-[28px]" />
      </div>
    );
  }

  if (!order) return null;

  // Compute checkout pipeline indices to style vertical checkpoint line trackers
  const steps = ["pending", "processing", "shipped", "delivered"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Upper Navigation Action row */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to history
        </button>
      </div>

      {/* Hero Meta Header Title Block */}
      <div className="bg-white border border-gray-100 rounded-[28px] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Receipt Reference: {order._id}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Purchased on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-left md:text-right shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Estimated Delivery Horizon
          </span>
          <span className="text-base font-bold text-primary mt-0.5 block">
            {order.estimatedDelivery || "Processing"}
          </span>
        </div>
      </div>

      {/* Visual Step Timeline Tracker Bar */}
      <div className="bg-white border border-gray-100 rounded-[28px] p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
          Delivery Progress Pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {[
            {
              id: "pending",
              label: "Order Confirmed",
              desc: "Payment secured",
              icon: CheckCircle2,
            },
            {
              id: "processing",
              label: "In Preparation",
              desc: "Showroom dispatching",
              icon: Package,
            },
            {
              id: "shipped",
              label: "In Transit",
              desc: "Courier route out",
              icon: Truck,
            },
            {
              id: "delivered",
              label: "Delivered",
              desc: "Signed at doorstep",
              icon: HomeIconPlaceholder,
            },
          ].map((step, idx) => {
            const StepIcon =
              step.icon === HomeIconPlaceholder ? CheckCircle2 : step.icon;
            const isCompleted = idx <= currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className="flex flex-col items-start gap-2.5 relative"
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-primary border-primary text-white shadow-sm shadow-primary/20"
                      : "bg-secondary/20 border-transparent text-muted-foreground/60",
                    isActive && "ring-4 ring-primary/10 animate-pulse",
                  )}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-bold leading-tight",
                      isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground/70",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split Structure Content Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Order Items List Column Card Block */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[28px] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Product Manifest
              </h3>
            </div>
            <div className="p-6 divide-y divide-gray-50">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary/30 rounded-xl border border-gray-50 shrink-0 flex items-center justify-center text-muted-foreground/70">
                      <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.variant || "Standard Variant"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Meta Details Summary breakdown columns column wrapper content panel */}
        <div className="space-y-6">
          {/* Logistic Dispatch Targets Address Box Card */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-gray-50 pb-2">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Logistics
              Destination
            </div>
            <div className="text-xs leading-relaxed text-foreground/80 font-medium">
              <p className="font-bold text-foreground text-sm mb-1">
                {order.shippingAddress.name}
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </p>
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase font-bold mt-1">
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Payment Methods Info Box Card */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-gray-50 pb-2">
              <CreditCard className="w-3.5 h-3.5 text-primary" /> Billing &
              Payment
            </div>
            <div className="text-xs text-foreground/80 font-medium">
              <p>{order.paymentMethod}</p>
              <p className="text-[11px] text-muted-foreground mt-1 italic">
                Transactions captured securely via payment layer.
              </p>
            </div>
          </div>

          {/* Financial Breakdown Totaling Calculator Matrix Card Panel */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm space-y-3.5">
            <div className="border-t border-gray-50 pt-3.5 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                Total Invoice Value
              </span>
              <span className="text-lg font-bold text-primary">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Support Center Inline Anchor Help Bar Row */}
      <div className="bg-secondary/20 rounded-6 p-4 flex items-center justify-between flex-col sm:flex-row text-center sm:text-left gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary shrink-0" />
          <span>
            Issues with this delivery signature? Need to initialize a structural
            returns protocol line?
          </span>
        </div>
        <Link
          href="/contact"
          className="font-bold text-primary underline hover:text-primary/80 whitespace-nowrap"
        >
          Contact Concierge Desk
        </Link>
      </div>
    </div>
  );
};

const HomeIconPlaceholder = () => null;

export default Page;
