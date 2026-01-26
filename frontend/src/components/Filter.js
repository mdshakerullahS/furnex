"use client";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const Filter = ({
  minPrice,
  maxPrice,
  selectedCategory,
  setMinPrice,
  setMaxPrice,
  setSelectedCategory,
  categories,
}) => {
  return (
    <div className="w-full space-y-10 py-2">
      {/* --- Categories Section --- */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
          Product Categories
        </h3>

        <RadioGroup
          value={selectedCategory || "all"}
          onValueChange={(value) =>
            setSelectedCategory(value === "all" ? "" : value)
          }
          className="flex flex-col gap-4"
        >
          {/* "All" Option */}
          <div className="flex items-center group">
            <RadioGroupItem value="all" id="all" className="sr-only" />
            <Label
              htmlFor="all"
              className={`text-sm cursor-pointer transition-all duration-300 hover:text-primary ${
                !selectedCategory
                  ? "text-primary font-bold italic"
                  : "text-muted-foreground"
              }`}
            >
              All Collections
            </Label>
          </div>

          {categories?.map((category) => (
            <div key={category._id} className="flex items-center group">
              <RadioGroupItem
                value={category.name}
                id={category._id}
                className="sr-only"
              />
              <Label
                htmlFor={category._id}
                className={`text-sm cursor-pointer transition-all duration-300 hover:text-primary ${
                  selectedCategory === category.name
                    ? "text-primary font-bold italic translate-x-1"
                    : "text-muted-foreground"
                }`}
              >
                {category.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <hr className="border-border/40" />

      {/* --- Price Filter Section --- */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
          Filter by Price
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase">
                Min ($)
              </Label>
              <Input
                type="number"
                placeholder="0"
                className="h-10 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase">
                Max ($)
              </Label>
              <Input
                type="number"
                placeholder="5000"
                className="h-10 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Prices are shown in USD and exclude shipping costs at checkout.
          </p>
        </div>
      </div>

      {/* --- Clear Filters Button --- */}
      {(selectedCategory || minPrice > 0 || maxPrice > 0) && (
        <button
          onClick={() => {
            setSelectedCategory("");
            setMinPrice(0);
            setMaxPrice(0);
          }}
          className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline underline-offset-4"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
};

export default Filter;
