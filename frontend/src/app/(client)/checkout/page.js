"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useCart from "@/stores/cartStore";
import useAuth from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
  const { user } = useAuth();

  const router = useRouter();

  const { register, handleSubmit, watch, reset } = useForm();

  const { cart, getCart } = useCart();
  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (!cart?.items?.length) {
      router.push("/shop");
    }
  }, [cart]);

  const city = watch("city");
  const street = watch("street");
  const zip = watch("zip");

  const total = Array.isArray(cart.items)
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

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      } else {
        router.push("/verify-otp?redirect=checkout");

        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!user?.isVerified) {
        requestOTP();
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
        toast.success("Order placed successfully");
      }

      reset();

      router.push("/shop");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-[6%] lg:gap-[10%] p-2 mb-20">
      <div className="w-full max-w-[480px]">
        <form className="space-y-8">
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-4">Customer Info</h3>

            <FieldGroup className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input
                  id="fullName"
                  placeholder={user?.name}
                  readOnly
                  className="cursor-not-allowed"
                />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  placeholder={user?.email}
                  readOnly
                  className="cursor-not-allowed"
                />
              </Field>
            </FieldGroup>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Shipping Address</h3>

            <FieldGroup className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="city">Town/City</FieldLabel>
                <Input id="city" {...register("city")} />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="street">Street Address</FieldLabel>
                <Input id="street" {...register("street")} />
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="zip">ZIP Code</FieldLabel>
                <Input id="zip" {...register("zip")} />
              </Field>
            </FieldGroup>
          </div>
        </form>
      </div>

      <div className="w-full md:w-[300px] space-y-2 mt-16">
        <div className="flex justify-between">
          <p className="font-semibold">Subtotal</p>
          <p className="text-muted-foreground font-semibold">
            ${total.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between">
          <p className="font-semibold">Total</p>
          <p className="text-muted-foreground font-semibold">
            ${total.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-center mt-12">
          <Button
            disabled={!city || !street || !zip}
            aria-label="Place order"
            onClick={handleSubmit(onSubmit)}
            className="cursor-pointer"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
