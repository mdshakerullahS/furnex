"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, FileDown, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProducts from "@/stores/productStore";
import { cn } from "@/lib/utils";

const ProductsPage = () => {
  const { products, getProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Filter logic for the search bar
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Products
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your furniture collection and stock levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 text-xs font-bold uppercase tracking-widest h-10 px-5"
          >
            <FileDown className="w-4 h-4" />
            Export
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-xl gap-2 text-xs font-bold uppercase tracking-widest h-10 px-5"
          >
            <Link href="/admin/products/add">
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-8 border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/30 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            Showing {filteredProducts.length} Products
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/10">
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Product Details
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Stock Status
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Price
                </th>
                <th className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6 py-4 text-left">
                  Rating
                </th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-secondary/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary/50 overflow-hidden shrink-0 border border-gray-100">
                        {p.imageURLs ? (
                          <img
                            src={p.imageURLs[0]}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground line-clamp-1">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {p.category || "Furniture"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full w-fit uppercase tracking-tighter",
                          p.stock > 10
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-orange-50 text-orange-600",
                        )}
                      >
                        {p.stock > 10
                          ? "In Stock"
                          : p.stock > 0
                            ? "Low Stock"
                            : "Out of Stock"}
                      </span>
                      <p className="text-xs text-muted-foreground ml-1">
                        {p.stock} units available
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-primary">
                      ${p.price.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">4.5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
