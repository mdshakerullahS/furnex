"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setOrders(data.orders);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <h2 className="text-2xl font-bold">Orders</h2>
        <Button
          variant="outline"
          size="sm"
          aria-label="Export"
          className="cursor-pointer"
        >
          Export
        </Button>
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
              <th className="text-sm font-semibold pb-1">Date</th>
              <th className="text-sm font-semibold pb-1">Customer</th>
              <th className="text-sm font-semibold pb-1">Status</th>
              <th className="text-sm font-semibold pb-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => {
              const date = new Date(ord.createdAt);

              const dateStr = date.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <tr
                  key={ord._id}
                  className="text-left border border-b-border border-t-0 border-x-0"
                >
                  <td className="text-sm py-1">{ord._id}</td>
                  <td className="text-sm py-1">{dateStr}</td>
                  <td className="text-sm py-1">{ord.customerID.name}</td>
                  <td className="text-sm py-1">{ord.status}</td>
                  <td className="text-sm py-1">{ord.totalPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
