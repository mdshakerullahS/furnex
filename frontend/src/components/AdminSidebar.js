"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Orders", href: "/admin/dashboard/orders" },
  { label: "Products", href: "/admin/dashboard/products" },
  { label: "Categories", href: "/admin/dashboard/categories" },
  { label: "Customers", href: "/admin/dashboard/customers" },
  { label: "Reports", href: "/admin/dashboard/reports" },
  { label: "Coupons", href: "/admin/dashboard/coupons" },
  { label: "Inbox", href: "/admin/dashboard/inbox" },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      className={
        "flex flex-col w-60 px-2 py-4 bg-sidebar/60 border border-sidebar-border backdrop-blur-md transition-all duration-500"
      }
    >
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <div
            key={item.label}
            className={`w-full ${
              isActive && "bg-sidebar-accent/60 text-sidebar-accent-foreground"
            } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md`}
          >
            <Link
              href={item.href}
              className="text-sidebar-foreground flex items-center gap-3 px-2 my-2 transition-all duration-500"
            >
              {item.label}
            </Link>
          </div>
        );
      })}
    </aside>
  );
};

export default AdminSidebar;
