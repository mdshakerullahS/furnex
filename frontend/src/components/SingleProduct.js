"use client";

import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import useCart from "@/stores/cartStore";
import useProducts from "@/stores/productStore";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const SingleProduct = ({ id }) => {
  const { cart, addCart, quantities, setQuantities, getCart, updateQty } =
    useCart();
  const { singleProduct, getSingleProduct } = useProducts();

  const [image, setImage] = useState(null);

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    getSingleProduct(id);
  }, [id]);

  useEffect(() => {
    if (singleProduct?.imageURLs?.length) {
      setImage(singleProduct.imageURLs[0]);
    }
  }, [singleProduct]);

  const updateQtyOnPage = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + change),
    }));
  };

  let existingItem;
  if (Array.isArray(cart?.items) && cart.items.length) {
    existingItem = cart.items.find(
      (i) => i.productID?._id === singleProduct?._id,
    );
  }

  if (singleProduct) {
    const currentQty = existingItem
      ? existingItem.quantity
      : quantities[singleProduct?._id] || 1;

    const isMin = currentQty <= 1;
    const isMax = currentQty >= singleProduct?.stock;

    return (
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            {image && (
              <Card className="p-0">
                <AspectRatio
                  ratio={1.75}
                  className="rounded-lg overflow-hidden"
                >
                  <Image
                    src={image}
                    fill
                    sizes="60vw"
                    alt={`Product Image`}
                    loading="lazy"
                    className="object-cover"
                  />
                </AspectRatio>
              </Card>
            )}

            <div className="w-full flex items-center gap-2 overflow-x-auto">
              {singleProduct?.imageURLs.map((img, idx) => (
                <Card
                  key={idx}
                  onClick={() => setImage(img)}
                  className="p-0 cursor-pointer w-20 h-20 overflow-hidden"
                >
                  <AspectRatio ratio={1}>
                    <Image
                      src={img}
                      fill
                      sizes="72px"
                      alt={`Product Image ${idx + 1}`}
                      loading="lazy"
                      className="object-cover hover:scale-110 transition-all duration-300"
                    />
                  </AspectRatio>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h1 className="text-3xl font-bold">{singleProduct?.title}</h1>

            <div className="flex items-center gap-2">
              <p className="text-2xl text-foreground font-semibold">
                ${singleProduct?.discountPrice || singleProduct?.price}
              </p>
              {singleProduct?.discountPrice && (
                <p className="text-lg text-muted-foreground line-through">
                  ${singleProduct?.price}
                </p>
              )}
            </div>

            <Separator />

            <ul>
              {singleProduct?.features?.map((f, i) => (
                <li key={i}>- {f}</li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              <Button
                variant={existingItem ? "outline" : "default"}
                size="icon-lg"
                aria-label="Decrease"
                disabled={isMin}
                onClick={() =>
                  existingItem
                    ? updateQty(singleProduct?._id, -1)
                    : updateQtyOnPage(singleProduct?._id, -1)
                }
                className="cursor-pointer"
              >
                <Minus />
              </Button>

              <Button
                size="lg"
                disabled={existingItem || singleProduct?.stock <= 0}
                onClick={() => addCart(singleProduct?._id)}
                className="cursor-pointer"
              >
                Add to Cart ({currentQty})
                <ShoppingCart />
              </Button>

              <Button
                variant={existingItem ? "outline" : "default"}
                size="icon-lg"
                aria-label="Increase"
                disabled={isMax}
                onClick={() =>
                  existingItem
                    ? updateQty(singleProduct?._id, +1)
                    : updateQtyOnPage(singleProduct?._id, +1)
                }
                className="cursor-pointer"
              >
                <Plus />
              </Button>
            </div>

            {singleProduct?.stock <= 0 && (
              <p className="text-sm text-destructive">Out of stock</p>
            )}
          </div>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Product Description</h2>
            <p className="text-muted-foreground text-sm">
              {singleProduct?.description}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default SingleProduct;
