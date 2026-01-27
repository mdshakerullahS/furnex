"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useCart from "@/stores/cartStore";
import useAuth from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ShieldCheck, Truck } from "lucide-react";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { cart, getCart } = useCart();
  const { register, handleSubmit, watch, reset } = useForm();

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    if (cart && cart.items && cart.items.length === 0) {
      router.push("/shop");
    }
  }, [cart, router]);

  const city = watch("city");
  const street = watch("street");
  const zip = watch("zip");

  const subtotal = Array.isArray(cart?.items)
    ? cart.items.reduce(
        (sum, item) => sum + item.productID.price * item.quantity,
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

      router.push("/verify-otp?redirect=checkout");
      toast.success("Verification code sent to your email");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onSubmit = async (data) => {
    setIsPending(true);
    try {
      if (!user?.isVerified) {
        await requestOTP();
        return;
      }

      const payLoad = {
        items: cart.items || [],
        shippingAddress: data,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payLoad),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message);
      } else {
        toast.success("Order placed successfully!");
        reset();
        router.push("/shop"); // Ideally redirect to an /order-success/[id] page
      }
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* --- Left: Billing & Shipping (Span 7) --- */}
        <div className="lg:col-span-7 space-y-12">
          <section className="space-y-8">
            <h2 className="text-3xl font-serif font-medium">Billing Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field className="space-y-2">
                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Full Name
                </FieldLabel>
                <Input
                  value={user?.name || ""}
                  readOnly
                  className="h-12 bg-secondary/20 border-transparent cursor-not-allowed rounded-xl"
                />
              </Field>
              <Field className="space-y-2">
                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Email Address
                </FieldLabel>
                <Input
                  value={user?.email || ""}
                  readOnly
                  className="h-12 bg-secondary/20 border-transparent cursor-not-allowed rounded-xl"
                />
              </Field>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-serif">Shipping Address</h3>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field className="md:col-span-2 space-y-2">
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Street Address
                  </FieldLabel>
                  <Input
                    id="street"
                    placeholder="House number and street name"
                    className="h-12 rounded-xl focus:ring-primary"
                    {...register("street", { required: true })}
                  />
                </Field>
                <Field className="space-y-2">
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Town / City
                  </FieldLabel>
                  <Input
                    id="city"
                    placeholder="New York"
                    className="h-12 rounded-xl"
                    {...register("city", { required: true })}
                  />
                </Field>
                <Field className="space-y-2">
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    ZIP Code
                  </FieldLabel>
                  <Input
                    id="zip"
                    placeholder="10001"
                    className="h-12 rounded-xl"
                    {...register("zip", { required: true })}
                  />
                </Field>
              </FieldGroup>
            </div>
          </section>

          <div className="p-6 bg-primary/5 rounded-2xl flex items-center gap-4 border border-primary/10">
            <Truck className="text-primary w-6 h-6" />
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">Free Shipping:</span>{" "}
              Your order qualifies for our complimentary premium delivery
              service.
            </p>
          </div>
        </div>

        {/* --- Right: Order Summary (Span 5) --- */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-border/60 rounded-3xl p-8 md:p-10 shadow-sm">
            <h3 className="text-2xl font-serif mb-8 text-center">Your Order</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm uppercase tracking-widest font-bold text-muted-foreground/60">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              <Separator />
              {cart?.items?.map((item) => (
                <div
                  key={item.productID._id}
                  className="flex justify-between text-sm"
                >
                  <p className="text-muted-foreground">
                    {item.productID.title}{" "}
                    <span className="text-foreground font-bold ml-2">
                      × {item.quantity}
                    </span>
                  </p>
                  <span className="font-medium">
                    ${(item.productID.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="text-lg font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-primary font-bold uppercase tracking-widest text-[10px]">
                  Total
                </span>
                <span className="text-3xl font-bold text-primary">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-[11px] leading-relaxed text-muted-foreground text-center italic">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our{" "}
                <span className="font-bold text-foreground">
                  privacy policy
                </span>
                .
              </div>

              <Button
                disabled={!city || !street || !zip || isPending}
                onClick={handleSubmit(onSubmit)}
                className="w-full h-14 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all gap-3"
              >
                {isPending
                  ? "Processing..."
                  : user?.isVerified
                    ? "Place Order"
                    : "Verify & Place Order"}
                <ShieldCheck className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
