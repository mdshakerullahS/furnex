"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Timer, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useAuth from "@/stores/userStore";

const OTPForm = () => {
  const { user, setUser } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();

  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);

  // Countdown for resend button
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-submit when 6 digits are reached
  useEffect(() => {
    const verifyOTP = async () => {
      setIsVerifying(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/otp/verify-otp`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp: value }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to verify OTP");
        } else {
          setUser({ ...user, isVerified: data.isVerified });
          toast.success("Security verified successfully");
          setValue("");
          router.push(redirect ? redirect : "/");
        }
      } catch (err) {
        toast.error(err.message);
        setValue(""); // Reset on error so user can try again
      } finally {
        setIsVerifying(false);
      }
    };

    if (value.length === 6) verifyOTP();
  }, [value, redirect, router, setUser, user]);

  const handleResend = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/otp/request-otp`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) {
        toast.success("A new code has been dispatched");
        setTimer(60);
      }
    } catch (err) {
      toast.error("Could not resend code");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] px-6">
      <div className="w-full max-w-[450px] bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-border/40 text-center">
        {/* Visual Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl font-serif mb-3">Verify Account</h1>
        <p className="text-muted-foreground text-sm mb-10">
          For your security, we've sent a 6-digit code to your email.
        </p>

        {/* OTP Input Group */}
        <div className="flex flex-col items-center gap-8">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(val) => setValue(val)}
            disabled={isVerifying}
          >
            <InputOTPGroup className="gap-3">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-14 md:w-14 md:h-16 text-xl font-bold rounded-xl border-secondary/30 bg-secondary/5 focus:ring-primary"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <div className="w-full space-y-4">
            <Button
              className="w-full h-14 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/10"
              disabled={value.length !== 6 || isVerifying}
            >
              {isVerifying ? "Verifying..." : "Confirm Code"}
            </Button>

            {/* Timer & Resend */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>
                {timer > 0 ? (
                  `Resend available in ${timer}s`
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-primary font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#FAF9F6]">
          <div className="animate-pulse font-serif text-xl text-primary">
            Furnex.
          </div>
        </div>
      }
    >
      <OTPForm />
    </Suspense>
  );
}
