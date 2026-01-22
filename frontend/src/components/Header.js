"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/Logo.png";

import { Button } from "./ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import Navigation from "./Navigation";

import SearchForm from "./SearchForm";

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="bg-background/20 backdrop-blur-xl fixed top-0 inset-x-0 z-10">
      <div className="flex items-center justify-between px-2 md:px-4 lg:px-8 py-3">
        <Link href={"/"} className="flex items-center gap-0.5">
          <Image
            src={logo}
            width={28}
            height={28}
            alt="Logo"
            loading="lazy"
            className="w-auto"
          />
          <h1 className="text-xl font-bold">Furniro</h1>
        </Link>

        <div className="hidden md:block">
          <SearchForm />
        </div>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="rounded-full"
          >
            <Link
              href={"/cart"}
              className="p-2 rounded-full hover:bg-accent/40 hover:text-accent-foreground/80 transition-colors duration-300"
            >
              <ShoppingCart />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="cursor-pointer"
          >
            <Menu strokeWidth="2.5px" />
          </Button>
          <Navigation
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
