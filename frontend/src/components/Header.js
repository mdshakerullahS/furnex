"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "./ui/button";
import Navigation from "./Navigation";
import useCart from "@/stores/cartStore";
import SearchOverlay from "./SearchOverlay";
import useAuth from "@/stores/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cart, getCart } = useCart();
  const { user, logOut } = useAuth();
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

  // Handle scroll effect for a "Floating" feel
  useEffect(() => {
    getCart();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [getCart]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-49 transition-all duration-300 ${
        isScrolled && !isMobileOpen
          ? "bg-background/80 backdrop-blur-md py-3 shadow-sm border-b"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* --- Logo Area --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden">
            <Image
              src="/Logo.png"
              width={32}
              height={32}
              alt="Furniro"
              className="w-auto transition-transform duration-500 group-hover:rotate-360"
            />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
            Furniro
          </span>
        </Link>

        {/* --- Desktop Navigation (Centered) --- */}
        <nav className="hidden lg:flex items-center gap-10">
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-[13px] font-bold uppercase tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* --- Action Icons --- */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* User Dropdown - Desktop Only */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex rounded-full relative"
              >
                {user && initials ? (
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {initials}
                  </span>
                ) : (
                  <User strokeWidth={1.5} className="w-5 h-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              {user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-bold leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/account/orders">
                      <Package className="mr-2 h-4 w-4" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {!user.isVerified && (
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer text-amber-600 focus:text-amber-600"
                    >
                      <Link
                        href={`/verify-otp?redirect=${encodeURIComponent(pathname)}`}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" /> Verify Email
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                    onClick={() => logOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    >
                      Log in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/register">Create account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="rounded-full"
          >
            <Search strokeWidth={1.5} className="w-5 h-5" />
          </Button>

          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />

          {/* Cart Icon with Badge */}
          <Link href="/cart" className="relative group p-2">
            <ShoppingCart
              strokeWidth={1.5}
              className="w-5 h-5 group-hover:text-primary transition-colors"
            />
            <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] font-bold text-background rounded-full flex items-center justify-center border-2 border-white">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden ml-2"
          >
            {isMobileOpen ? (
              <X strokeWidth={1.5} className="w-6 h-6" />
            ) : (
              <Menu strokeWidth={1.5} className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* --- Refined Navigation Component --- */}
      <Navigation
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
    </header>
  );
};

export default Header;
