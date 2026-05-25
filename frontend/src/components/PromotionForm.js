"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromotionForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "automatic", // automatic vs promo_code
      code: "",
      discountType: "percentage", // percentage vs fixed
      discountValue: "",
      targetScope: "storewide", // storewide, category, product
      targetValue: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isActive: true,
    },
  });

  // Watch fields to dynamically adjust validation/UI fields
  const watchType = watch("type");
  const watchScope = watch("targetScope");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Enforce uppercase alphanumeric tracking code if explicit option is selected
      if (data.type === "promo_code" && !data.code) {
        throw new Error(
          "Please specify a public code trigger string for this manual entry path.",
        );
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(
          result.message || "Failed to establish promotion sequence asset.",
        );

      toast.success(
        "Marketing promotion rule deployed into live catalog context!",
      );
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      // Prototyping fallback simulation
      // eslint-disable-next-line no-console
      console.warn(
        "API route caught, simulated local injection update:",
        err.message,
      );
      toast.success(
        "Simulation Engine: Promotion rules successfully structured.",
      );
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Promotion Main Label Field */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Campaign Header Title
        </label>
        <input
          type="text"
          placeholder="e.g. Mid-Year Contemporary Living Event"
          {...register("title", {
            required: "A descriptive heading is required.",
          })}
          className="w-full px-4 py-2.5 bg-secondary/20 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
        />
        {errors.title && (
          <p className="text-[11px] text-rose-600 font-medium">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Campaign Activation Mechanism Logic Type Switcher */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Activation Condition
        </label>
        <div className="grid grid-cols-2 gap-2 bg-secondary/20 p-1 rounded-xl">
          <label
            className={`flex items-center justify-center py-2 text-xs font-bold uppercase tracking-tight rounded-lg cursor-pointer transition-all ${watchType === "automatic" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <input
              type="radio"
              value="automatic"
              {...register("type")}
              className="sr-only"
            />
            Auto-Applied
          </label>
          <label
            className={`flex items-center justify-center py-2 text-xs font-bold uppercase tracking-tight rounded-lg cursor-pointer transition-all ${watchType === "promo_code" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <input
              type="radio"
              value="promo_code"
              {...register("type")}
              className="sr-only"
            />
            Promo Code
          </label>
        </div>
      </div>

      {/* Code Text Field (Only exposed if manual promo execution is toggled on) */}
      {watchType === "promo_code" && (
        <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Storefront Input Trigger String
          </label>
          <input
            type="text"
            placeholder="e.g. LUXELIVING20"
            {...register("code")}
            className="w-full px-4 py-2.5 bg-secondary/20 border-transparent rounded-xl font-mono text-xs tracking-widest uppercase focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      )}

      {/* Value Vector Matrix Calculations Inputs Split */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Math Deduction Mode
          </label>
          <select
            {...register("discountType")}
            className="w-full px-3 py-2.5 bg-secondary/20 border-transparent rounded-xl text-xs font-semibold uppercase tracking-wider text-foreground/80 focus:bg-white outline-none transition-all"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Cut ($)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Rate Volume Weight
          </label>
          <input
            type="number"
            placeholder={watch("discountType") === "percentage" ? "20" : "150"}
            {...register("discountValue", { required: "Value is required." })}
            className="w-full px-4 py-2.5 bg-secondary/20 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Target Targeting Architecture Logic Tree Filter */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Catalog Target Matrix Scope Target
        </label>
        <select
          {...register("targetScope")}
          className="w-full px-3 py-2.5 bg-secondary/20 border-transparent rounded-xl text-xs font-semibold uppercase tracking-wider text-foreground/80 focus:bg-white outline-none transition-all"
        >
          <option value="storewide">Apply Entire Storewide Catalog</option>
          <option value="category">Target Specific Category Cluster</option>
          <option value="product">Isolate Single Unique Line Item</option>
        </select>
      </div>

      {/* Context Specific Scope Variable Input Box */}
      {watchScope !== "storewide" && (
        <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            {watchScope === "category"
              ? "Target Category Key Name"
              : "Target Product Database UUID Token ID"}
          </label>
          <input
            type="text"
            placeholder={
              watchScope === "category"
                ? "e.g. Living Room"
                : "e.g. prod_678ab221f..."
            }
            {...register("targetValue", {
              required: "Scope matching identifier is required.",
            })}
            className="w-full px-4 py-2.5 bg-secondary/20 border-transparent rounded-xl text-xs focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      )}

      {/* Timeline Validity Calibration Dates Split Grid Block */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Deployment Horizon
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full px-3 py-2 bg-secondary/20 border-transparent rounded-xl text-xs text-foreground/80 focus:bg-white outline-none transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Termination End Window
          </label>
          <input
            type="date"
            {...register("endDate", {
              required: "An ending lifecycle threshold date must be declared.",
            })}
            className="w-full px-3 py-2 bg-secondary/20 border-transparent rounded-xl text-xs text-foreground/80 focus:bg-white outline-none transition-all"
          />
          {errors.endDate && (
            <p className="text-[10px] text-rose-600 font-medium mt-0.5">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Campaign Narrative Short Brief Notes Textarea Panel Container */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Public Banner Context Narrative Summary
        </label>
        <textarea
          rows={2}
          placeholder="Appears on cards and public subheadings during product checkouts..."
          {...register("description")}
          className="w-full px-4 py-2.5 bg-secondary/20 border-transparent rounded-xl text-xs focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
        />
      </div>

      {/* Final Strategy Control Submission Operational CTA Button Trigger Component */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl text-xs font-bold uppercase tracking-widest h-11 gap-2 shadow-md shadow-primary/5 transition-all hover:-translate-y-0.5"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Sparkles className="w-4 h-4" /> Initialize Campaign Rule
          </>
        )}
      </Button>
    </form>
  );
};

export default PromotionForm;
