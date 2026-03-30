"use client";

import CategoryForm from "@/components/CategoryForm";
import useCategory from "@/stores/categoryStore";
import Image from "next/image";
import { useEffect } from "react";

const Page = () => {
  const { categories, getCategories } = useCategory();

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <div className="h-full flex justify-between gap-4">
      <div className="w-full py-2 space-y-4">
        <h2 className="text-2xl font-bold">Categories</h2>

        <div className="grid grid-cols-3 gap-4 overflow-y-auto">
          {categories.map((category) => (
            <div
              key={category.name}
              className="rounded-md overflow-hidden shadow-sm"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={category.imageURL}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 200px"
                  alt="Category"
                />
              </div>
              <div className="p-2">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.productCount} Products
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-2 border-l border-border">
        <CategoryForm />
      </div>
    </div>
  );
};

export default Page;
