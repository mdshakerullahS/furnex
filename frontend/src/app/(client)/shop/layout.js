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

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { singleProduct, selectedCategory, setSelectedCategory } =
    useProducts();

  const handleClick = (category) => {
    setSelectedCategory(category);
    router.push("/shop");
  };
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList className="px-4 py-2">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Products</BreadcrumbLink>
          </BreadcrumbItem>

          {pathname.includes("/shop/products/") ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  onClick={() => handleClick(singleProduct?.categoryID.name)}
                >
                  {singleProduct?.categoryID.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{singleProduct?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            selectedCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedCategory}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </div>
  );
}
