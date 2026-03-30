"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useAuth from "@/stores/userStore";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const RegisterForm = () => {
  const { user, setUser } = useAuth();

  const { register, handleSubmit, watch, reset } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (user) router.push("/");
  }, [router, user]);

  const name = watch("name");
  const email = watch("email");
  const password = watch("password");
  const confirmPass = watch("confirmPass");

  const onSubmit = async (data) => {
    try {
      const guestID = localStorage.getItem("guestID");

      const payload = {
        ...data,
        guestID,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      } else {
        reset();
        setUser(result.user);
        toast.success(result.message);

        requestOTP();
        toast.success("Verify your email");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

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
        router.push(
          redirect ? `/verify-otp?redirect=${redirect}` : "/verify-otp",
        );

        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-[600px] h-screen flex flex-col items-center justify-center mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          <Field className="gap-2">
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              type="name"
              placeholder="John Doe"
              {...register("name")}
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="john@doe.com"
              {...register("email")}
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="******"
                {...register("password")}
              />

              <div
                onClick={() => setShowPass(!showPass)}
                className="w-5 absolute bottom-2 right-2 cursor-pointer"
              >
                {showPass ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
              </div>
            </div>
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="confirmPass">Confirm Password</FieldLabel>
            <div className="relative">
              <Input
                id="confirmPass"
                type={showConfirmPass ? "password" : "text"}
                placeholder="******"
                {...register("confirmPass")}
              />

              <div
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="w-5 absolute bottom-2 right-2 cursor-pointer"
              >
                {showConfirmPass ? (
                  <EyeIcon size={20} />
                ) : (
                  <EyeOffIcon size={20} />
                )}
              </div>
            </div>
          </Field>

          <Button
            aria-label="Login"
            type="submit"
            disabled={
              !name ||
              !email ||
              !password ||
              !confirmPass ||
              password !== confirmPass
            }
            className="cursor-pointer"
          >
            Register
          </Button>
        </FieldGroup>

        <p className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col items-center justify-center">
          Loading...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
};

export default Page;
