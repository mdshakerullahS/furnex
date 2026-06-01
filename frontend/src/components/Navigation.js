"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  X,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  ArrowRight,
  Package,
  LayoutDashboard,
} from "lucide-react";
import useAuth from "@/stores/userStore";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navigation = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin =
    user?.role && ["super_admin", "manager", "staff"].includes(user.role);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : null;

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

      router.push(`/verify-otp?redirect=${encodeURIComponent(pathname)}`);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-500 ${
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-[85%] max-w-[400px] bg-background shadow-2xl transition-transform duration-500 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : initials ? (
                <span className="text-primary font-bold text-sm">
                  {initials}
                </span>
              ) : (
                <UserIcon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              )}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Account
              </p>
              <h3 className="font-serif font-medium text-lg">
                {user?.name || "Guest"}
              </h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="rounded-full hover:bg-secondary"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* User Actions */}
          <div className="mb-10 space-y-2">
            {user ? (
              <>
                {/* My Orders */}
                <Link
                  href="/account/orders"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex w-full items-center justify-between p-4 rounded-xl hover:bg-secondary/50 text-sm font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" /> My Orders
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>

                {/* Admin Panel (admin roles only) */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex w-full items-center justify-between p-4 rounded-xl hover:bg-secondary/50 text-sm font-semibold transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-primary" /> Admin
                      Panel
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                )}

                {/* Verify Email */}
                {!user.isVerified && (
                  <button
                    onClick={() => {
                      requestOTP();
                      setIsMobileOpen(false);
                    }}
                    className="flex w-full items-center justify-between p-4 rounded-xl bg-amber-50 text-amber-700 text-sm font-semibold transition-colors hover:bg-amber-100"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Verify your email
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Logout */}
                <button
                  className="flex w-full items-center gap-2 p-4 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/5 transition-colors"
                  onClick={() => {
                    logOut();
                    setIsMobileOpen(false);
                    router.push("/login");
                  }}
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <Button asChild className="w-full rounded-full h-12">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Log in
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full h-12"
                >
                  <Link href="/register" onClick={() => setIsMobileOpen(false)}>
                    Create account
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Main Nav */}
          <nav className="space-y-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4">
              Menu
            </p>
            {navItems.map((nav) => (
              <Link
                key={nav.label}
                href={nav.href}
                onClick={() => setIsMobileOpen(false)}
                className={`block text-3xl font-serif transition-all duration-300 hover:text-primary hover:translate-x-2 ${
                  pathname === nav.href
                    ? "text-primary italic"
                    : "text-foreground"
                }`}
              >
                {nav.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-8 bg-[#FAF9F6] border-t border-border/40">
          <div className="flex flex-col gap-4">
            <Link
              href="/refund-policy"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Refund policy
            </Link>
            <Link
              href="/privacy-policy"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy policy
            </Link>
            <p className="text-[10px] text-muted-foreground/50 mt-4">
              © {new Date().getFullYear()} Furnex Studio
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
