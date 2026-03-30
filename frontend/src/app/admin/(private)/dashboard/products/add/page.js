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
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
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

  const title = watch("title");
  const desc = watch("desc");
  const price = watch("price");
  const stock = watch("stock");
  const images = watch("images");
  const selectedCategory = watch("selectedCategory");
  const features = watch("features");

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
      formData.append("discountPrice", data.discountPrice || "");
      data.features?.forEach((f) => {
        formData.append("features", f.title);
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
      else {
        reset();
        toast.success(result.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Product Info</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex gap-4">
          <div className="w-3/4 space-y-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input type="text" {...register("title")} />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea {...register("desc")} />
            </Field>

            <div className="w-full flex">
              <Field>
                <FieldLabel>Images</FieldLabel>
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
              </Field>

              <div className="min-w-80 space-y-2">
                <Field>
                  <FieldLabel>Features</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={features.at(-1)?.title === ""}
                    onClick={() => append({ title: "" })}
                    className="cursor-pointer"
                  >
                    <Plus strokeWidth={2.5} /> Add Feature
                  </Button>
                </Field>
                {fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    No features yet — click “<span className="text-xl">+ </span>
                    Add task” to create one.
                  </p>
                ) : (
                  fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <Input
                        type="text"
                        placeholder={`Feature ${index + 1}`}
                        {...register(`features.${index}.title`)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="w-1/4 flex flex-col gap-2">
            <Field className="flex flex-col gap-2">
              <FieldLabel>Select Category</FieldLabel>
              {categories && categories.length > 0 ? (
                <Controller
                  control={control}
                  name="selectedCategory"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <p className="text-muted-foreground text-sm">
                  No categories found
                </p>
              )}
            </Field>

            <div>
              <Field>
                <FieldLabel>Regular Price</FieldLabel>
                <Input type="number" {...register("price")} />
              </Field>
              <Field>
                <FieldLabel>Discount Price</FieldLabel>
                <Input type="number" {...register("discountPrice")} />
              </Field>
              <Field>
                <FieldLabel>Stock</FieldLabel>
                <Input type="number" {...register("stock")} />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex justify-center py-4">
          <Button
            type="submit"
            disabled={
              !title ||
              !desc ||
              !price ||
              !stock ||
              !selectedCategory ||
              !images
            }
            aria-label="Add product"
            className="cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Add product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
