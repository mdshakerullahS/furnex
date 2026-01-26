"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/Logo.png";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Navigation from "./Navigation";
import useCart from "@/stores/cartStore";
import SearchOverlay from "./SearchOverlay";

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cart, getCart } = useCart();

  // Handle scroll effect for a "Floating" feel
  useEffect(() => {
    getCart();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md py-3 shadow-sm border-b"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* --- Logo Area --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden">
            <Image
              src={logo}
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
          {/* User Icon - Desktop Only */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex rounded-full"
          >
            <User strokeWidth={1.5} className="w-5 h-5" />
          </Button>

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
              {cart.items?.length}
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
