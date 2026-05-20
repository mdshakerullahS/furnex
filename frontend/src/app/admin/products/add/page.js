/* eslint-disable max-lines */

"use client";

import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useCategory from "@/stores/categoryStore";
import {
  Loader2,
  Plus,
  X,
  Info,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { categories, getCategories } = useCategory();
  const [loading, setLoading] = useState(false);

  const { register, watch, handleSubmit, control, reset } = useForm({
    defaultValues: {
      images: [],
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  // Watch for validation
  const formValues = watch();

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.desc);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("category", data.selectedCategory);
      if (data.discountPrice)
        formData.append("discountPrice", data.discountPrice);

      data.features?.forEach((f) => {
        if (f.title) formData.append("features", f.title);
      });

      data.images?.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success("Product listed successfully!");
      reset();
      router.push("/admin/products");
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 pt-2">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            New Collection Piece
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details to list a new item in the showroom.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground"
        >
          Cancel
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: Core Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-white p-8 rounded-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm uppercase tracking-widest">
                General Info
              </h3>
            </div>

            <Field className="space-y-2">
              <FieldLabel className="text-xs font-bold text-muted-foreground">
                Product Title
              </FieldLabel>
              <Input
                placeholder="e.g. Minimalist Velvet Sofa"
                className="h-12 rounded-xl bg-secondary/20 border-transparent focus:bg-white transition-all"
                {...register("title", { required: true })}
              />
            </Field>

            <Field className="space-y-2">
              <FieldLabel className="text-xs font-bold text-muted-foreground">
                Description
              </FieldLabel>
              <Textarea
                placeholder="Describe the material, craftsmanship, and feel..."
                className="min-h-[150px] rounded-2xl bg-secondary/20 border-transparent focus:bg-white transition-all"
                {...register("desc", { required: true })}
              />
            </Field>
          </div>

          {/* Media Card */}
          <div className="bg-white p-8 rounded-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm uppercase tracking-widest">
                Product Media
              </h3>
            </div>
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <ImageUpload
                  maxFiles={4}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Features/Specs Card */}
          <div className="bg-white p-8 rounded-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-widest">
                  Specifications
                </h3>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => append({ title: "" })}
                className="rounded-full text-[10px] uppercase tracking-widest h-8"
              >
                + Add Spec
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="relative group">
                  <Input
                    placeholder={`e.g. Solid Oak Wood`}
                    className="h-11 rounded-xl bg-secondary/20 border-transparent focus:bg-white transition-all pr-10"
                    {...register(`features.${index}.title`)}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            {fields.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-4 border-2 border-dashed border-secondary rounded-2xl">
                No custom features added yet.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Logistics & Pricing */}
        <div className="space-y-6">
          {/* Inventory & Pricing Card */}
          <div className="bg-white p-8 rounded-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm uppercase tracking-widest">
                Logistics
              </h3>
            </div>

            <Field className="space-y-2">
              <FieldLabel className="text-xs font-bold text-muted-foreground">
                Category
              </FieldLabel>
              <Controller
                control={control}
                name="selectedCategory"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 rounded-xl bg-secondary/20 border-transparent">
                      <SelectValue placeholder="Choose Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectGroup>
                        {categories?.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-2">
                <FieldLabel className="text-xs font-bold text-muted-foreground">
                  Price ($)
                </FieldLabel>
                <Input
                  type="number"
                  {...register("price")}
                  className="h-12 rounded-xl bg-secondary/20 border-transparent"
                />
              </Field>
              <Field className="space-y-2">
                <FieldLabel className="text-xs font-bold text-muted-foreground">
                  Stock
                </FieldLabel>
                <Input
                  type="number"
                  {...register("stock")}
                  className="h-12 rounded-xl bg-secondary/20 border-transparent"
                />
              </Field>
            </div>

            <Field className="space-y-2">
              <FieldLabel className="text-xs font-bold text-muted-foreground">
                Discount Price (Optional)
              </FieldLabel>
              <Input
                type="number"
                {...register("discountPrice")}
                className="h-12 rounded-xl bg-secondary/20 border-transparent"
              />
            </Field>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              loading ||
              !formValues.title ||
              !formValues.desc ||
              !formValues.price ||
              !formValues.selectedCategory
            }
            className="w-full h-16 rounded-6 font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Publish to Store"
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground px-4 italic">
            Double-check all specifications and images before publishing. This
            will go live immediately.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Page;
