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
import { usePathname } from "next/navigation";

export default function ShopLayout({ children }) {
  const pathname = usePathname();

  const { singleProduct } = useProducts();

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
          {pathname.includes("/shop/products/") && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{singleProduct?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </div>
  );
}
