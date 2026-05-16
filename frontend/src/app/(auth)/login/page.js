"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useAuth from "@/stores/userStore";
import { EyeIcon, EyeOffIcon, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LoginForm = () => {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, watch, reset } = useForm();
  const [eyeOpen, setEyeOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (user && !redirect) {
      router.replace("/");
    }
  }, [user, redirect, router]);

  const email = watch("email");
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const guestID = localStorage.getItem("guestID");
      const payload = { ...data, guestID };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");

      reset();
      setUser({
        name: result.user.name,
        email: result.user.email,
        isVerified: result.user.isVerified,
      });

      toast.success("Welcome back to Furniro!");

      router.push(
        redirect ? redirect : result.user.role === "admin" ? "/admin" : "/",
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] px-6">
      <div className="w-full max-w-[450px] bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-border/40">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-3">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details to access your collection.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup className="gap-5">
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

            <Field className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Password
                </FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold uppercase text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="password"
                  type={eyeOpen ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 pl-11 pr-11 rounded-2xl bg-secondary/10 border-transparent focus:bg-white transition-all"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setEyeOpen(!eyeOpen)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                >
                  {eyeOpen ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </Field>
          </FieldGroup>

          <Button
            disabled={!email || !password}
            type="submit"
            className="w-full h-14 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all mt-4"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            New to Furniro?{" "}
            <Link
              href={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-primary font-bold hover:underline ml-1"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Footer link back to home */}
      <Link
        href="/shop"
        className="mt-8 text-xs text-muted-foreground hover:text-primary transition-colors font-medium uppercase tracking-widest"
      >
        ← Back to Store
      </Link>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#FAF9F6]">
          <div className="animate-pulse font-serif text-xl">Furniro.</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};

export default Page;
