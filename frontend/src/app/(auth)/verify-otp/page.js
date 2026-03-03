"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useAuth from "@/stores/userStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

const OTPForm = () => {
  const { user, setUser } = useAuth();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();

  const [value, setValue] = useState("");

  const handleClick = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/otp/verify-otp`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: value }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      } else {
        setUser({ ...user, isVerified: data.isVerified });
        toast.success(data.message);
        setValue("");

        router.push(redirect ? redirect : "/");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (value.length === 6) handleClick();
  }, [value]);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="space-y-1">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <p className={`${value.length === 6 && "hidden"}`}>
          Enter your one-time password.
        </p>
      </div>

      <Button disabled={value.length !== 6}>Submit</Button>
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
      <OTPForm />
    </Suspense>
  );
};

export default Page;
