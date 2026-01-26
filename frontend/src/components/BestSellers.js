"use client";

import useProducts from "@/stores/productStore";
import { useEffect } from "react";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { Eye, ShoppingBag } from "lucide-react";
import useCart from "@/stores/cartStore";

const BestSellers = () => {
  const { bestSellers, getBestSellers } = useProducts();
  const { addCart } = useCart();

  useEffect(() => {
    getBestSellers();
  }, []);

  if (!bestSellers?.length) return null;

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      {/* Editorial Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3">
          Customer Favorites
        </span>
        <h2 className="text-4xl font-serif font-medium text-foreground">
          The Best Sellers
        </h2>
        <div className="h-px w-20 bg-primary/20 mt-6" />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {bestSellers.map((item) => {
          const product = item.product;
          const outOfStock = product.stock <= 0;
          const hasDiscount = product.discountPrice;

          return (
            <div key={item._id} className="group flex flex-col">
              {/* Image & Hover Action Container */}
              <div className="relative mb-6 overflow-hidden rounded-xl">
                {/* Status Badges */}
                <div className="absolute top-4 left-4 z-1 flex flex-col gap-2">
                  <span className="bg-background/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {outOfStock ? "Sold Out" : hasDiscount ? "Sale" : "Popular"}
                  </span>
                </div>

                <Link href={`/shop/products/${product._id}`}>
                  <AspectRatio ratio={0.75} className="overflow-hidden">
                    <Image
                      src={product.imageURLs[0]}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      alt={product.title}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </AspectRatio>
                </Link>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto flex items-center justify-center gap-3">
                  <Link
                    href={`/shop/products/${product._id}`}
                    className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-xl hover:bg-primary hover:text-background transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  {!outOfStock && (
                    <button
                      onClick={() => addCart(product._id)}
                      className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-xl hover:bg-primary hover:text-background transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 cursor-pointer"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <Link href={`/shop/products/${product._id}`}>
                  <h3 className="text-lg font-serif font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-foreground">
                    ${product.discountPrice || product.price}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through decoration-primary/40">
                      ${product.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional: View All Link */}
      <div className="mt-20 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-bold uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary/70 hover:border-primary/70 transition-all"
        >
          View All Furniture
        </Link>
      </div>
    </section>
  );
};

export default BestSellers;
