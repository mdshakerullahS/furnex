"use client";

import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import useCart from "@/stores/cartStore";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SingleProduct = ({ id }) => {
  const { cart, getCart, updateQty } = useCart();

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    getCart();
  }, []);

  const getProduct = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        { credentials: "include" },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch product");

      setProduct(data.product);
    } catch (error) {
      console.log(error.message);

      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  useEffect(() => {
    if (product?.imageURLs?.length) {
      setImage(product.imageURLs[0]);
    }
  }, [product]);

  const updateQtyOnPage = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + change),
    }));
  };

  const handleAddCart = async (id) => {
    const qty = quantities[id] || 1;

    try {
      let guestID = localStorage.getItem("guestID");
      if (!guestID) {
        guestID = crypto.randomUUID();
        localStorage.setItem("guestID", guestID);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({ productID: id, quantity: qty, guestID }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed adding product to cart");
      }

      toast.success("Product added to cart");
    } catch (error) {
      toast.error("Failed adding product to cart");
    }
  };

  let existingItem;
  if (Array.isArray(cart?.items) && cart.items.length) {
    existingItem = cart.items.find((i) => i.productID?._id === product?._id);
  }

  if (product) {
    const currentQty = existingItem
      ? existingItem.quantity
      : quantities[product?._id] || 1;

    const isMin = currentQty <= 1;
    const isMax = currentQty >= product?.stock;

    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
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
              {product?.imageURLs.map((img, idx) => (
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
            <h1 className="text-3xl font-bold">{product?.title}</h1>

            <div className="flex items-center gap-2">
              <p className="text-2xl text-foreground font-semibold">
                ${product?.discountPrice || product?.price}
              </p>
              {product?.discountPrice && (
                <p className="text-lg text-muted-foreground line-through">
                  ${product?.price}
                </p>
              )}
            </div>

            <Separator />

            <ul>
              {product?.features?.map((f, i) => (
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
                    ? updateQty(product?._id, -1)
                    : updateQtyOnPage(product?._id, -1)
                }
                className="cursor-pointer"
              >
                <Minus />
              </Button>

              <Button
                size="lg"
                disabled={existingItem || product?.stock <= 0}
                onClick={() => handleAddCart(product?._id)}
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
                    ? updateQty(product?._id, +1)
                    : updateQtyOnPage(product?._id, +1)
                }
                className="cursor-pointer"
              >
                <Plus />
              </Button>
            </div>

            {product?.stock <= 0 && (
              <p className="text-sm text-destructive">Out of stock</p>
            )}
          </div>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Product Description</h2>
            <p className="text-muted-foreground text-sm">
              {product?.description}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default SingleProduct;
