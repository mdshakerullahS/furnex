"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../public/Logo.png";
import { Mastercard, Visa, Paypal, Amex } from "react-payment-logos/dist/flat";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <footer className="bg-[#FAF9F6] border-t border-border/50">
      {/* --- Newsletter Section --- */}
      <div className="max-w-7xl mx-auto px-6 py-16 border-b border-border/40">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center lg:text-left">
            <h3 className="text-2xl font-serif font-medium mb-2">
              Join the Furniro Family
            </h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
          </div>
          <div className="flex w-full max-w-md items-center space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="rounded-full bg-background border-border/60 h-12 px-6 focus-visible:ring-primary"
            />
            <Button className="rounded-full h-12 px-8 group">
              Subscribe
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- Main Footer Content --- */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                width={36}
                height={36}
                alt="Furniro Logo"
                className="w-auto brightness-90"
              />
              <span className="text-2xl font-serif font-bold tracking-tight">
                Furniro
              </span>
            </Link>
            <p className="max-w-xs text-muted-foreground leading-relaxed">
              Crafting beautiful furniture for modern homes. We believe in
              quality, sustainability, and timeless design in every piece.
            </p>
            <div className="flex gap-5 pt-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-6">
              Explore
            </h4>
            <ul className="space-y-4">
              {["Home", "Shop", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-all text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-6">
              Policy
            </h4>
            <ul className="space-y-4">
              {[
                "Refund Policy",
                "Privacy Policy",
                "Terms of Service",
                "Shipping Info",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.replace(" ", "-").toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-all text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support/Contact */}
          <div className="lg:col-span-4 lg:pl-12">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-6">
              Contact Us
            </h4>
            <address className="not-italic space-y-4 text-sm text-muted-foreground">
              <p>
                233 King Street, Melbourne <br />
                VIC 3000, Australia
              </p>
              <p className="text-foreground font-medium underline underline-offset-4">
                support@furniro.com
              </p>
              <p className="text-foreground font-medium">+61 3 1234 5678</p>
            </address>

            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                We Accept
              </p>
              <div className="flex gap-4 lg:opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="w-10">
                  <Visa />
                </div>
                <div className="w-10">
                  <Mastercard />
                </div>
                <div className="w-10">
                  <Paypal />
                </div>
                <div className="w-10">
                  <Amex />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="border-t border-border/40 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-muted-foreground tracking-wide">
            © {new Date().getFullYear()} Furniro Studio. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
            Designed for Modern Living
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
