"use client";

import { useEffect, useRef, useState } from "react";
import { X, Search as SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import useProducts from "@/stores/productStore";

const SearchOverlay = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const { setSearch } = useProducts();

  const router = useRouter();
  const pathname = usePathname();

  const onSubmit = () => {
    setSearch(searchValue);

    if (pathname !== "/shop") router.push("/shop");

    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Lock scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus the input automatically
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Close Button */}
      <div className="absolute top-8 right-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="w-8 h-8" strokeWidth={1} />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6">
        <div className="w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2">
            <span className="text-primary font-bold tracking-widest uppercase text-[10px]">
              Search Catalog
            </span>
            <h2 className="text-4xl font-serif">What are you looking for?</h2>
          </div>

          <div className="relative w-full bg-background border-b-2 border-primary/20 px-4 pb-4 focus-within:border-primary transition-colors">
            {/* You can wrap your existing SearchForm here or style it directly */}
            <div className="flex items-center gap-4">
              <SearchIcon className="w-6 h-6 text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                ref={inputRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSubmit();
                }}
                placeholder="Search for furniture, rooms, or collections..."
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-transparent text-2xl md:text-3xl font-light outline-none placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
