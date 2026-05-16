"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useAuth from "@/stores/userStore";
import { EyeIcon, EyeOffIcon, LockKeyhole, Mail, User } from "lucide-react";
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
    if (user && !redirect) {
      router.replace("/");
    }
  }, [user, redirect, router]);

  const name = watch("name");
  const email = watch("email");
  const password = watch("password");
  const confirmPass = watch("confirmPass");

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      } else {
        reset();
        toast.success("Account created! Please login.");
        router.push(redirect ? `/login?redirect=${redirect}` : "/login");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] px-6 py-12">
      <div className="w-full max-w-[480px] bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-border/40">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-3">Join Furniro</h1>
          <p className="text-muted-foreground text-sm">
            Create an account to track orders and save your favorites.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup className="gap-5">
            {/* Full Name Field */}
            <Field className="space-y-2">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Full Name
              </FieldLabel>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="h-14 pl-11 rounded-2xl bg-secondary/10 border-transparent focus:bg-white transition-all"
                  {...register("name", { required: true })}
                />
              </div>
            </Field>

            {/* Email Field */}
            <Field className="space-y-2">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Email Address
              </FieldLabel>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-14 pl-11 rounded-2xl bg-secondary/10 border-transparent focus:bg-white transition-all"
                  {...register("email", { required: true })}
                />
              </div>
            </Field>

            {/* Password Field */}
            <Field className="space-y-2">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Password
              </FieldLabel>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="h-14 pl-11 pr-11 rounded-2xl bg-secondary/10 border-transparent focus:bg-white transition-all"
                  {...register("password", { required: true, minLength: 6 })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                >
                  {showPass ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </Field>

            {/* Confirm Password Field */}
            <Field className="space-y-2">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="confirmPass"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Type password again"
                  className="h-14 pl-11 pr-11 rounded-2xl bg-secondary/10 border-transparent focus:bg-white transition-all"
                  {...register("confirmPass", { required: true, minLength: 6 })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                >
                  {showConfirmPass ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              </div>
            </Field>
          </FieldGroup>

          <Button
            disabled={!name || !email || !password || !confirmPass}
            type="submit"
            className="w-full h-14 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all mt-4"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-primary font-bold hover:underline ml-1"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>

      <Link
        href="/shop"
        className="mt-8 text-xs text-muted-foreground hover:text-primary transition-colors font-medium uppercase tracking-widest"
      >
        ← Back to Store
      </Link>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#FAF9F6]">
          <div className="animate-pulse font-serif text-xl text-primary">
            Furniro.
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
