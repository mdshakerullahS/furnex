"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useProducts from "@/stores/productStore";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { singleProduct, selectedCategory, setSelectedCategory } =
    useProducts();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    router.push("/shop");
  };

  const isProductPage = pathname.includes("/shop/products/");

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Refined Breadcrumb Bar --- */}
      <div className="w-full bg-[#FAF9F6] border-b border-border/40 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="flex items-center gap-2 md:gap-4">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="text-muted-foreground/40" />

              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/shop"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    Shop
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {isProductPage ? (
                <>
                  <BreadcrumbSeparator className="text-muted-foreground/40" />
                  <BreadcrumbItem className="hidden md:flex">
                    <button
                      onClick={() =>
                        handleCategoryClick(singleProduct?.categoryID?.name)
                      }
                      className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium cursor-pointer"
                    >
                      {singleProduct?.categoryID?.name}
                    </button>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator className="text-muted-foreground/40" />

                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-foreground font-bold text-sm truncate max-w-[150px] md:max-w-none">
                      {singleProduct?.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                selectedCategory && (
                  <>
                    <BreadcrumbSeparator className="text-muted-foreground/40" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-foreground font-bold text-sm">
                        {selectedCategory}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Optional: Results count or "Back" button for mobile */}
          <div className="hidden lg:block text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            {isProductPage ? "Product Detail" : "Collection View"}
          </div>
        </div>
      </div>

      {/* --- Page Content --- */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
