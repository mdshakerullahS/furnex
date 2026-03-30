"use client";

import { useState } from "react";
import { Button } from "./ui/button";

const CouponForm = () => {
  const [categoryName, setCategoryName] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [startsAt, setStartsAt] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Category Info</h2>

      <form onSubmit={handleSubmit} className="py-2 space-y-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Coupon Name</label>
          <input
            type="text"
            onChange={(e) => setCategoryName(e.target.value)}
            className="max-w-[256px] pl-2 py-1 border border-border outline-0 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Discount Amount</label>
          <input
            type="text"
            onChange={(e) => setDiscount(e.target.value)}
            className="pl-2 py-1 border border-border outline-0 rounded-md"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Starts at</label>
          <input
            type="date"
            onChange={(e) => setStartsAt(e.target.value)}
            className="max-w-[256px] pl-2 py-1 border border-border outline-0 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Expires at</label>
          <input
            type="date"
            onChange={(e) => setExpiresAt(e.target.value)}
            className="max-w-[256px] pl-2 py-1 border border-border outline-0 rounded-md"
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={!categoryName || !startsAt || !expiresAt}
            aria-label="Add coupon"
          >
            Add coupon
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
