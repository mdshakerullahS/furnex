"use client";

import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import useCart from "@/stores/cartStore";
import useProducts from "@/stores/productStore";
import { Minus, Plus, ShoppingCart, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const SingleProduct = ({ id }) => {
  const { cart, addCart, quantities, setQuantities, getCart, updateQty } =
    useCart();
  const { singleProduct, getSingleProduct } = useProducts();
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    getCart();
  }, [getCart]);
  useEffect(() => {
    getSingleProduct(id);
  }, [id, getSingleProduct]);
  useEffect(() => {
    if (singleProduct?.imageURLs?.length)
      setActiveImage(singleProduct.imageURLs[0]);
  }, [singleProduct]);

  const updateQtyOnPage = (productID, change) => {
    setQuantities((prev) => ({
      ...prev,
      [productID]: Math.max(1, (prev[productID] || 1) + change),
    }));
  };

  const existingItem = Array.isArray(cart?.items)
    ? cart.items.find((i) => i.productID?._id === singleProduct?._id)
    : null;

  if (!singleProduct) return null; // Add a skeleton here if preferred

  const currentQty = existingItem
    ? existingItem.quantity
    : quantities[singleProduct?._id] || 1;
  const isMin = currentQty <= 1;
  const isMax = currentQty >= singleProduct?.stock;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-20 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* --- Left: Image Gallery (Span 7) --- */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#FAF9F6]">
            <AspectRatio ratio={1.2}>
              {activeImage && (
                <Image
                  src={activeImage}
                  fill
                  priority
                  alt={singleProduct?.title}
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              )}
            </AspectRatio>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {singleProduct?.imageURLs.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                } cursor-pointer`}
              >
                <Image
                  src={img}
                  fill
                  alt="thumbnail"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* --- Right: Product Info (Span 5) --- */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
                {singleProduct?.categoryID?.name || "Collection"}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-medium leading-tight">
                {singleProduct?.title}
              </h1>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-3xl font-bold text-foreground">
                  ${singleProduct?.discountPrice || singleProduct?.price}
                </span>
                {singleProduct?.discountPrice && (
                  <span className="text-xl text-muted-foreground/60 line-through font-light">
                    ${singleProduct?.price}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-border/40" />

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 gap-y-3">
                {singleProduct?.features?.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* --- Unified Action Bar --- */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-secondary/40 rounded-full p-1 border border-border/40">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isMin}
                    onClick={() =>
                      existingItem
                        ? updateQty(singleProduct?._id, -1)
                        : updateQtyOnPage(singleProduct?._id, -1)
                    }
                    className="rounded-full h-10 w-10 hover:bg-background transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-bold text-sm">
                    {currentQty}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isMax}
                    onClick={() =>
                      existingItem
                        ? updateQty(singleProduct?._id, 1)
                        : updateQtyOnPage(singleProduct?._id, 1)
                    }
                    className="rounded-full h-10 w-10 hover:bg-background transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  size="lg"
                  disabled={existingItem || singleProduct?.stock <= 0}
                  onClick={() => addCart(singleProduct?._id)}
                  className="flex-1 rounded-full h-14 font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all gap-3 cursor-pointer"
                >
                  {existingItem ? "In Cart" : "Add to Cart"}
                  {!existingItem && <ShoppingCart className="w-4 h-4" />}
                </Button>
              </div>

              {singleProduct?.stock <= 0 ? (
                <p className="text-xs text-destructive text-center font-medium">
                  Temporarily Out of Stock
                </p>
              ) : (
                <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest">
                  Secure checkout • Free Delivery on orders over $500
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Description Section --- */}
      <div className="pt-16 border-t border-border/40">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-serif mb-6">Design Story</h2>
          <p className="text-muted-foreground leading-relaxed text-lg italic font-light">
            {singleProduct?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
