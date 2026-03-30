"use client";

import { Button } from "@/components/ui/button";
import useProducts from "@/stores/productStore";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const Page = () => {
  const { products, getProducts } = useProducts();

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <h2 className="text-2xl font-bold">Orders</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            aria-label="Export"
            className="cursor-pointer"
          >
            Export
          </Button>
          <Button size="sm" aria-label="Add product">
            <Link href={"/admin/dashboard/products/add"}>Add product</Link>
          </Button>
        </div>
      </div>
      <div className="bg-accent/10 space-y-4 shadow-sm p-2 rounded-md">
        <form className="bg-input/40 w-fit flex items-center rounded-sm">
          <input
            type="text"
            placeholder="Search"
            className="w-40 text-sm outline-0 pl-1"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Search"
            className="cursor-pointer"
          >
            <Search />
          </Button>
        </form>
        <table className="w-full">
          <thead>
            <tr className="text-left border border-b-2 border-border border-t-0 border-x-0">
              <th className="text-sm font-semibold pb-1">Product</th>
              <th className="text-sm font-semibold pb-1">Inventory</th>
              <th className="text-sm font-semibold pb-1">Price</th>
              <th className="text-sm font-semibold pb-1">Rating</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className="text-left border border-b-border border-t-0 border-x-0"
              >
                <td className="text-sm py-1">{p.title}</td>
                <td className="text-sm py-1">{p.stock}</td>
                <td className="text-sm py-1">${p.price}</td>
                <td className="text-sm py-1">N/A</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
