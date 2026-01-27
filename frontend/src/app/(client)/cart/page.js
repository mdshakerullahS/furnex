"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCart from "@/stores/cartStore";
import useProducts from "@/stores/productStore";
import useAuth from "@/stores/userStore";
import { Minus, Plus, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, getCart, updateQty, removeItem, clearCart } = useCart();
  const { products, getProducts } = useProducts();

  useEffect(() => {
    getProducts();
    getCart();
  }, [getProducts, getCart]);

  const getStock = (productId) => {
    const product = products.find((p) => p._id === productId);
    return product?.stock ?? 0;
  };

  const total = Array.isArray(cart?.items)
    ? cart.items.reduce(
        (sum, item) => sum + (item.productID?.price || 0) * item.quantity,
        0,
      )
    : 0;

  const requestOTP = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/otp/request-otp`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      router.push("/verify-otp?redirect=cart");
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!cart?.items?.length)
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <Empty className="h-[60vh] rounded-3xl border-2 border-dashed border-muted/50 bg-[#FAF9F6]">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-background shadow-sm">
              <ShoppingCart
                className="w-10 h-10 text-primary"
                strokeWidth={1.5}
              />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-serif mt-4">
              Your cart is empty
            </EmptyTitle>
          </EmptyHeader>
          <EmptyContent className="space-y-6">
            <p className="text-muted-foreground max-w-[280px] mx-auto">
              Looks like you haven't added any furniture to your collection yet.
            </p>
            <Button asChild className="rounded-full px-8">
              <Link href="/shop">Explore Shop</Link>
            </Button>
            {!user && (
              <p className="text-xs pt-4">
                Already have an account?{" "}
                <Link
                  href="/login?redirect=cart"
                  className="text-primary font-bold hover:underline"
                >
                  Login
                </Link>
              </p>
            )}
          </EmptyContent>
        </Empty>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* --- Left: Cart Items Table --- */}
        <div className="flex-1 w-full space-y-8">
          <div className="flex items-center justify-between border-b pb-6">
            <h1 className="text-3xl font-serif">Shopping Cart</h1>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-xs uppercase tracking-widest text-destructive hover:bg-destructive/5 font-bold"
            >
              Clear Cart
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/30 rounded-t-xl overflow-hidden">
                <TableRow className="border-none">
                  <TableHead className="py-4 font-bold uppercase tracking-widest text-[10px]">
                    Product
                  </TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-widest text-[10px] text-center">
                    Price
                  </TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-widest text-[10px] text-center">
                    Quantity
                  </TableHead>
                  <TableHead className="py-4 font-bold uppercase tracking-widest text-[10px] text-right pr-8">
                    Subtotal
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((i) => {
                  const stock = getStock(i.productID?._id);
                  return (
                    <TableRow
                      key={i.productID?._id}
                      className="group hover:bg-secondary/10 border-b border-border/40 transition-colors"
                    >
                      <TableCell className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-secondary/50 shrink-0">
                            {i.productID?.imageURLs?.[0] && (
                              <Image
                                src={i.productID.imageURLs[0]}
                                fill
                                alt={i.productID.title}
                                className="object-cover"
                              />
                            )}
                          </div>
                          <Link
                            href={`/shop/products/${i.productID?._id}`}
                            className="font-bold text-sm hover:text-primary transition-colors line-clamp-1"
                          >
                            {i.productID?.title || "Deleted Product"}
                          </Link>
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-sm font-medium text-muted-foreground">
                        ${i.productID?.price?.toFixed(2) ?? "0.00"}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex items-center bg-secondary/40 rounded-full p-1 border border-border/40">
                            <button
                              disabled={i.quantity <= 1}
                              onClick={() => updateQty(i.productID._id, -1)}
                              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-30"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">
                              {i.quantity}
                            </span>
                            <button
                              disabled={i.quantity >= stock}
                              onClick={() => updateQty(i.productID._id, 1)}
                              className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-right text-sm font-bold pr-8">
                        ${(i.productID?.price * i.quantity).toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(i.productID._id)}
                          className="text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Button asChild variant="ghost" className="gap-2 group">
            <Link href="/shop">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* --- Right: Checkout Summary --- */}
        <div className="w-full lg:w-[400px] sticky top-32">
          <div className="bg-[#FAF9F6] p-8 rounded-3xl border border-border/40 space-y-8 shadow-sm">
            <h3 className="text-2xl font-serif">Order Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Estimated Shipping
                </span>
                <span className="text-primary font-bold">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline pt-2">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {user && !user.isVerified && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
                    Account Verification
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Please verify your email to secure your order.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={requestOTP}
                    className="p-0 h-auto text-primary font-bold mt-2"
                  >
                    Send Verification OTP
                  </Button>
                </div>
              )}

              <Button
                asChild
                className="w-full h-14 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                <Link href={user ? "/checkout" : "/login?redirect=checkout"}>
                  Proceed to Checkout
                </Link>
              </Button>

              <div className="flex items-center justify-center gap-4 text-muted-foreground/40 pt-4">
                {/* Visual Trust Badges */}
                <div className="h-6 w-10 bg-current mask-visa bg-no-repeat bg-center" />
                <div className="h-6 w-10 bg-current mask-mastercard bg-no-repeat bg-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
