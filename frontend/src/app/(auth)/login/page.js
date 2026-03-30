"use client";

import useAuth from "@/stores/userStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

      const payload = {
        ...data,
        guestID,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      const resultUser = result.user;
      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      } else {
        reset();
        setUser({
          name: resultUser.name,
          email: resultUser.email,
          isVerified: resultUser.isVerified,
        });
        toast.success(result.message);

        router.push(
          redirect
            ? redirect
            : result.user.role === "admin"
              ? "/admin/dashboard"
              : "/",
        );
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
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              {...register("email")}
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={eyeOpen ? "password" : "text"}
                placeholder="Password"
                {...register("password")}
              />

              <div
                onClick={() => setEyeOpen(!eyeOpen)}
                className="w-5 absolute bottom-2 right-2 cursor-pointer"
              >
                {eyeOpen ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
              </div>
            </div>
          </Field>

          <Button
            disabled={!email || !password}
            aria-label="Login"
            type="submit"
            className="cursor-pointer"
          >
            Login
          </Button>
        </FieldGroup>

        <p className="text-center">
          Not registered yet?{" "}
          <Link
            href={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="underline"
          >
            Register
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
      <LoginForm />
    </Suspense>
  );
};

export default Page;
