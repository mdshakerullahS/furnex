"use client";

import Products from "@/components/Products";
import { Suspense, useEffect, useState } from "react";
import useCategory from "@/stores/categoryStore";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import Filter from "@/components/Filter";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useProducts from "@/stores/productStore";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { categories, getCategories } = useCategory();
  const {
    products,
    getProducts,
    totalProducts,
    selectedCategory,
    setSelectedCategory,
    search,
    sortBy,
    setSortBy,
    limit,
    setLimit,
    currentPage,
    setCurrentPage,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
  } = useProducts();

  const [showFilter, setShowFilter] = useState(false);

  // Sync state changes to URL
  useEffect(() => {
    const fetchAndSync = async () => {
      const queryString = await getProducts();
      if (queryString) {
        router.push(`${pathname}?${queryString}`, { scroll: false });
      }
    };
    fetchAndSync();
  }, [
    search,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy,
    currentPage,
    limit,
    getProducts,
    pathname,
    router,
  ]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / limit) : 1;

  return (
    <div className="min-h-screen">
      {/* --- Utility / Filter Bar --- */}
      <div className="sticky top-16 md:top-20 z-30 w-full bg-background/90 backdrop-blur-md border-b border-border/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <Button
              variant="ghost"
              onClick={() => setShowFilter(!showFilter)}
              className="group gap-2 hover:bg-primary/5 rounded-full px-6 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 transition-transform group-hover:rotate-180" />
              <span className="font-bold uppercase tracking-widest text-xs">
                Filter
              </span>
            </Button>

            <div className="hidden sm:block h-6 w-px bg-border/60" />

            <p className="text-sm text-muted-foreground hidden sm:block">
              Showing{" "}
              <span className="text-foreground font-semibold">
                {(currentPage - 1) * limit + 1} –{" "}
                {Math.min(currentPage * limit, totalProducts)}
              </span>{" "}
              of {totalProducts} results
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="flex items-center gap-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Show
              </Label>
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-16 h-10 rounded-full bg-secondary/30 border-none ring-0 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 h-10 rounded-full bg-secondary/30 border-none ring-0 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest-first">Newest First</SelectItem>
                  <SelectItem value="price-low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex relative">
        {/* --- Sidebar Filter Component --- */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-[320px] bg-background shadow-2xl transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 md:shadow-none md:z-0 md:bg-transparent ${
            showFilter ? "translate-x-0" : "-translate-x-full md:hidden"
          }`}
        >
          <div className="sticky top-40 h-[calc(100vh-200px)] overflow-y-auto px-6">
            <Filter
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          </div>
        </div>

        {/* --- Product Grid Content --- */}
        <div className="flex-1">
          <Suspense fallback={<ShopLoadingSkeleton />}>
            <div className="min-h-[60vh]">
              <Products products={products} showFilter={showFilter} />
            </div>
          </Suspense>

          {/* --- Refined Pagination --- */}
          {totalProducts > 0 && (
            <div className="mt-20 flex flex-col items-center gap-8">
              <Pagination>
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && setCurrentPage(currentPage - 1)
                      }
                      className={`rounded-xl h-12 w-12 border-none bg-secondary/40 hover:bg-primary hover:text-background transition-all ${
                        currentPage === 1 && "opacity-0 pointer-events-none"
                      }`}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className={`rounded-xl h-12 w-12 border-none transition-all ${
                            page === currentPage
                              ? "bg-primary text-background shadow-lg shadow-primary/30"
                              : "bg-secondary/40 hover:bg-secondary"
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        setCurrentPage(currentPage + 1)
                      }
                      className={`rounded-xl h-12 w-12 border-none bg-secondary/40 hover:bg-primary hover:text-background transition-all ${
                        currentPage === totalPages &&
                        "opacity-0 pointer-events-none"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                End of Catalog
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile filter */}
      {showFilter && (
        <div
          onClick={() => setShowFilter(false)}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </div>
  );
};

const ShopLoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="aspect-3/4 rounded-2xl bg-muted animate-pulse" />
    ))}
  </div>
);

export default Page;
