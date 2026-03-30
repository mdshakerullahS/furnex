"use client";

import useCategory from "@/stores/categoryStore";
import Image from "next/image";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import useProducts from "@/stores/productStore";
import { MoveRight } from "lucide-react";

const Categories = () => {
  const { categories, getCategories } = useCategory();

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  if (!categories.length) return null;

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      {/* Editorial Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3">
          Inspiration for every space
        </span>
        <h2 className="text-4xl font-serif font-medium text-foreground">
          Browse by Category
        </h2>
        <div className="h-px w-20 bg-primary/20 mt-6" />
      </div>

      <Suspense fallback={<CategorySkeleton />}>
        <CategoryGrid categories={categories} />
      </Suspense>
    </section>
  );
};

const CategoryGrid = ({ categories }) => {
  const { setSelectedCategory } = useProducts();
  const router = useRouter();

  const handleClick = (category) => {
    setSelectedCategory(category);
    router.push("/shop");
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
      {categories.map((category) => (
        <div
          key={category._id}
          onClick={() => handleClick(category.name)}
          className="group cursor-pointer relative overflow-hidden rounded-2xl bg-secondary"
        >
          {/* Image Container */}
          <div className="aspect-4/5 relative overflow-hidden">
            <Image
              src={category.imageURL}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={category.name}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Elegant Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 translate-x-30 group-hover:translate-x-34 transition-all duration-500">
              <MoveRight className="w-5 h-5 text-foreground" />
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif text-background group-hover:translate-x-2 transition-transform duration-500">
                  {category.name}
                </h3>
              </div>
              <p className="text-background/70 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                Shop Collection
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Simple Skeleton for loading state
const CategorySkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="aspect-4/5 bg-muted animate-pulse rounded-2xl" />
    ))}
  </div>
);

export default Categories;
