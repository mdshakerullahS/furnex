"use client";

import useCategory from "@/stores/categoryStore";
import Image from "next/image";
import { Suspense, useEffect } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";
import useProducts from "@/stores/productStore";

const Categories = () => {
  const { categories, getCategories } = useCategory();

  useEffect(() => {
    getCategories();
  }, []);

  if (!categories.length) return;

  return (
    <section className="my-12 px-2 md:px-4 lg:px-8 space-y-8">
      <h2 className="text-2xl text-center text-accent-foreground font-bold">
        Featured Categories
      </h2>

      <Suspense fallback={<div>Loading...</div>}>
        <CategoryCard categories={categories} />
      </Suspense>
    </section>
  );
};

const CategoryCard = ({ categories }) => {
  const { setSelectedCategory } = useProducts();
  const router = useRouter();

  const handleClick = (category) => {
    setSelectedCategory(category);
    router.push("/shop");
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-[repeat(auto-fit,minmax(126px,132px))] justify-center gap-2 md:gap-4 py-4 overflow-x-auto">
      {categories &&
        categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleClick(category.name)}
            className="flex flex-col items-center cursor-pointer"
          >
            <Card className="w-25 p-0 overflow-hidden">
              <AspectRatio ratio={1}>
                <Image
                  src={category.imageURL}
                  fill
                  sizes="50vw"
                  alt={category.name}
                  loading="lazy"
                  className="object-cover hover:scale-110 transition-all duration-300"
                />
              </AspectRatio>
            </Card>
            <h3 className="text-center font-semibold">{category.name}</h3>
          </div>
        ))}
    </div>
  );
};

export default Categories;
