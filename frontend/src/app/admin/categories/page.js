"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FolderPlus, Layers, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CategoryForm from "@/components/CategoryForm";
import useCategory from "@/stores/categoryStore";

const Page = () => {
  const { categories, getCategories } = useCategory();
  const [loading, setLoading] = useState(false);

  const fetchUpdatedCollection = async () => {
    try {
      setLoading(true);
      await getCategories();
    } catch (err) {
      toast.error("Failed to load refreshed catalogue structure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleDeleteCategory = async (id) => {
    if (
      !confirm(
        "Deleting this category will un-categorize all attached furniture items. Continue?",
      )
    )
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Could not drop category collection");
      toast.success("Collection dropped cleanly");
      getCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 pb-10">
      {/* Left Container: Visual Cards View Grid */}
      <div className="flex-1 space-y-6 py-2">
        <div>
          <h2 className="text-3xl font-serif font-bold text-primary">
            Categories
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organize inventory into visual showrooms and manage main
            collections.
          </p>
        </div>

        {/* Visual Showcase Card Grid Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pr-2 max-h-[calc(100vh-220px)] scrollbar-thin hide-scrollbar">
          {categories?.map((category) => (
            <div
              key={category._id || category.name}
              className="bg-white rounded-6 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group relative"
            >
              {/* Image Canvas Container */}
              <div className="relative w-full aspect-4/3 bg-secondary/30 overflow-hidden">
                {category.imageURL ? (
                  <Image
                    src={category.imageURL}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    alt={category.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 gap-2">
                    <Layers className="w-8 h-8 stroke-[1.5]" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">
                      No Image Hooked
                    </span>
                  </div>
                )}

                {/* Dynamic Inline Delete Action floating overlay item trigger */}
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-muted-foreground hover:text-rose-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0"
                  aria-label={`Delete ${category.name} Category`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Text Meta Footer Wrapper Area */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {category.productCount || 0} Showroom Items
                  </p>
                </div>
              </div>
            </div>
          ))}

          {categories?.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-8 text-muted-foreground text-xs italic">
              No product categories are currently catalogued. Use the side
              builder to make one.
            </div>
          )}
        </div>
      </div>

      {/* Right Side Control Dashboard Panel Panel Form Component Card Wrapper Container */}
      <div className="w-full lg:w-[360px] shrink-0 bg-white p-6 rounded-8 border border-gray-100 shadow-sm h-fit">
        <div className="mb-6 flex items-start gap-2.5">
          <div className="p-2 bg-primary/5 rounded-xl border border-primary/10 text-primary">
            <FolderPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-primary">
              Add New Room
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Introduce a new thematic category layout style line.
            </p>
          </div>
        </div>
        <CategoryForm onSuccess={fetchUpdatedCollection} />
      </div>
    </div>
  );
};

export default Page;
