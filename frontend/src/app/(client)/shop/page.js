"use client";

import Products from "@/components/Products";
import { Activity, Suspense, useEffect, useState } from "react";
import useCategory from "@/stores/categoryStore";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import Filter from "@/components/Filter";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Overlay from "@/components/Overlay";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const { categories, getCategories } = useCategory();
  const [products, setProducts] = useState([]);

  const pathname = usePathname();
  const router = useRouter();

  const { selectedCategory, setSelectedCategory } = useCategory();
  const [sortBy, setSortBy] = useState("default");
  const [limit, setLimit] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [totalProducts, setTotalProducts] = useState(0);

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const getProducts = async () => {
    try {
      const query = new URLSearchParams();

      if (selectedCategory) query.set("category", selectedCategory);
      if (minPrice) query.set("minPrice", minPrice);
      if (maxPrice) query.set("maxPrice", maxPrice);
      if (sortBy) query.set("sortBy", sortBy);
      if (currentPage) query.set("currentPage", currentPage);
      if (limit) query.set("limit", limit);

      router.push(`${pathname}?${query.toString()}`);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?${query.toString()}`,
      );
      const data = await res.json();

      setProducts(data.products || []);
      setTotalProducts(data.totalProducts || 0);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    getProducts();
  }, [selectedCategory, minPrice, maxPrice, sortBy, currentPage, limit]);

  const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / limit) : 1;

  return (
    <div>
      <div className="bg-accent/40 text-accent-foreground w-full flex items-center justify-between p-2">
        <Button
          variant="outline"
          onClick={() => setShowFilter(!showFilter)}
          className="cursor-pointer"
        >
          <ListFilter /> Filter
        </Button>

        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="flex items-center gap-2">
            <Label>Show</Label>
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setLimit(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-16 bg-white">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label>Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-24 bg-white">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price_low_high">
                  Price (Low → High)
                </SelectItem>
                <SelectItem value="price_high_low">
                  Price (High → Low)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex">
        <Activity mode={showFilter ? "visible" : "hidden"}>
          <Filter
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
          <Overlay showFilter={showFilter} setShowFilter={setShowFilter} />
        </Activity>

        <div className="w-full h-[calc(100vh-100px)] overflow-y-scroll hide-scrollbar">
          <Suspense fallback={<div>Loading...</div>}>
            <Products products={products} />
          </Suspense>
        </div>
      </div>

      {totalProducts > 0 && (
        <div className="flex flex-col lg:flex-row items-center py-6 gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              {totalPages > 5 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="w-full flex items-center justify-center gap-4">
            <div>
              Showing{" "}
              {totalProducts === 0 ? "0" : (currentPage - 1) * limit + 1} -{" "}
              {Math.min(currentPage * limit, totalProducts)} of {totalProducts}{" "}
              results
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
