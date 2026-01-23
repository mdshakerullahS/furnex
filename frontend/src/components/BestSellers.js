"use client";

import useProducts from "@/stores/productStore";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { Button } from "./ui/button";

const BestSellers = () => {
  const { bestSellers, getBestSellers } = useProducts();

  useEffect(() => {
    getBestSellers();
  }, []);

  if (!bestSellers?.length) return;

  return (
    <section className="my-12 px-2 md:px-4 lg:px-8 space-y-8">
      <h2 className="text-2xl text-center text-accent-foreground font-bold">
        Best Sellers
      </h2>

      <div className="w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(220px,240px))] justify-center px-0.5 py-0.5 md:px-0 md:py-0">
        {Array.isArray(bestSellers) &&
          bestSellers.map((product) => {
            const outOfStock = product.stock === 0;

            return (
              <Card
                key={product._id}
                className="p-2 m-1.5 md:m-2.5 group transition-all hover:shadow-lg"
              >
                <CardHeader className="p-0 h-full">
                  <Link href={`/shop/products/${product.product._id}`}>
                    <AspectRatio
                      ratio={1.5}
                      className="rounded-lg overflow-hidden"
                    >
                      <Image
                        src={product.product.imageURLs[0]}
                        fill
                        sizes="60vw"
                        alt="Image"
                        loading="lazy"
                        className="object-cover hover:scale-[1.1] transition-all duration-300"
                      />
                    </AspectRatio>
                  </Link>
                  <CardTitle>
                    <Link href={`/shop/products/${product.product._id}`}>
                      {product.product.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <p className="text-lg text-foreground font-semibold">
                        $
                        {product.product.discountPrice || product.product.price}
                      </p>
                      {product.product.discountPrice && (
                        <p className="text-muted-foreground line-through">
                          ${product.product.price}
                        </p>
                      )}
                    </div>
                  </CardDescription>
                  <CardContent className="p-0">
                    <Button
                      asChild
                      size="sm"
                      className="w-full"
                      disabled={outOfStock}
                    >
                      <Link href={`/shop/products/${product.product._id}`}>
                        {outOfStock ? "Out of Stock" : "View Product"}
                      </Link>
                    </Button>
                  </CardContent>
                </CardHeader>
              </Card>
            );
          })}
      </div>
    </section>
  );
};

export default BestSellers;
