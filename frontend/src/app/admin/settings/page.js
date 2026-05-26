/* eslint-disable max-lines */

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Store,
  CreditCard,
  ShieldCheck,
  Loader2,
  Save,
  Sliders,
  Bell,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const Page = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      storeName: "",
      storeEmail: "",
      storePhone: "",
      currency: "",
      address: "",
      stripePublicKey: "",
      stripeSecretKey: "",
      enableCod: false,
      lowStockThreshold: 10,
      enableNotifications: false,
      currentPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            reset({ ...data.settings, currentPassword: "", newPassword: "" });
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const responseData = await res.json();
      if (!res.ok)
        throw new Error(
          responseData.message || "Failed to update configurations",
        );

      toast.success("Dashboard configurations updated successfully");
      reset({ ...data, currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to update configurations");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Showroom Profile", icon: Store },
    { id: "payments", name: "Payment Gateways", icon: CreditCard },
    { id: "preferences", name: "Preferences & Stock", icon: Sliders },
    { id: "security", name: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-[1100px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Settings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure global store settings, checkout systems, and security
            variables.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row gap-8 items-start"
      >
        {/* Left Column: Sidebar Navigation Tabs */}
        <div className="w-full lg:w-64 shrink-0 bg-white p-4 rounded-6 border border-gray-100 shadow-sm space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Right Column: Dynamic Tab Panels */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white p-8 rounded-8 border border-gray-100 shadow-sm min-h-[400px]">
            {/* TAB 1: SHOWROOM PROFILE */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="border-b border-gray-50 pb-4">
                  <h3 className="text-base font-bold text-foreground">
                    Showroom Profile
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Public and consumer-facing business identities.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field className="space-y-1.5">
                    <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Brand Name
                    </FieldLabel>
                    <Input
                      {...register("storeName")}
                      className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white"
                    />
                  </Field>
                  <Field className="space-y-1.5">
                    <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Support Email Address
                    </FieldLabel>
                    <Input
                      type="email"
                      {...register("storeEmail")}
                      className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field className="space-y-1.5">
                    <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Contact Phone
                    </FieldLabel>
                    <Input
                      {...register("storePhone")}
                      className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white"
                    />
                  </Field>
                  <Field className="space-y-1.5">
                    <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Base Store Currency
                    </FieldLabel>
                    <Input
                      {...register("currency")}
                      className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white"
                      placeholder="e.g. USD, EUR"
                    />
                  </Field>
                </div>
                <Field className="space-y-1.5">
                  <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Physical Showroom Address
                  </FieldLabel>
                  <Textarea
                    {...register("address")}
                    className="min-h-10 rounded-xl bg-secondary/20 border-transparent focus:bg-white"
                  />
                </Field>
              </div>
            )}

            {/* TAB 2: PAYMENT GATEWAYS */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <div className="border-b border-gray-50 pb-4">
                  <h3 className="text-base font-bold text-foreground">
                    Payment Gateways
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage credentials for capturing buyer credit transactions.
                  </p>
                </div>
                <div className="bg-secondary/10 p-4 rounded-xl flex items-start gap-3 border border-secondary/20">
                  <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Production environments must secure secret environment
                    values natively. Always rotate live payment keys immediately
                    if any leaks are suspected.
                  </p>
                </div>
                <Field className="space-y-1.5">
                  <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Stripe Public Token
                  </FieldLabel>
                  <Input
                    {...register("stripePublicKey")}
                    className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white font-mono text-xs tracking-tight"
                  />
                </Field>
                <Field className="space-y-1.5">
                  <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Stripe Secret API Signature Key
                  </FieldLabel>
                  <Input
                    type="password"
                    {...register("stripeSecretKey")}
                    className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white font-mono text-xs tracking-tight"
                  />
                </Field>
                <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Enable Cash On Delivery (COD)
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Allow shoppers to finish checkouts without prior digital
                      gateway capture.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    {...register("enableCod")}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: PREFERENCES */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div className="border-b border-gray-50 pb-4">
                  <h3 className="text-base font-bold text-foreground">
                    Preferences & Automation
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Adjust stock indicators and dashboard workflows.
                  </p>
                </div>
                <Field className="space-y-1.5 max-w-xs">
                  <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Low Stock Threshold
                  </FieldLabel>
                  <Input
                    type="number"
                    {...register("lowStockThreshold")}
                    className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white"
                  />
                  <p className="text-[10px] text-muted-foreground italic mt-1">
                    Triggers a yellow alert badge when units fall below this
                    value.
                  </p>
                </Field>
                <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                  <div className="flex items-start gap-3">
                    <Bell className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Real-Time Email Summary Logs
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Send a diagnostic digest payload email when orders
                        complete successfully.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    {...register("enableNotifications")}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="border-b border-gray-50 pb-4">
                  <h3 className="text-base font-bold text-foreground">
                    Security Settings
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Update access keys to protect your executive control layer
                    accounts.
                  </p>
                </div>
                <Field className="space-y-1.5">
                  <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Current Account Password
                  </FieldLabel>
                  <Input
                    type="password"
                    {...register("currentPassword")}
                    className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white"
                  />
                </Field>
                <Field className="space-y-1.5">
                  <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    New Password Rule Signature
                  </FieldLabel>
                  <Input
                    type="password"
                    {...register("newPassword")}
                    className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white"
                  />
                </Field>
              </div>
            )}
          </div>

          {/* Sticky Lower Action Controls Trigger Bar */}
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={loading || !isDirty}
              className="rounded-xl font-bold uppercase tracking-widest text-xs h-12 px-6 gap-2 shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Configuration
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
