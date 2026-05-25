"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Tag,
  Package,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_ROUTE = "/admin";
export const menuItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: ADMIN_ROUTE,
  },
  {
    label: "Categories",
    icon: Tag,
    href: `${ADMIN_ROUTE}/categories`,
  },
  {
    label: "Products",
    icon: Package,
    href: `${ADMIN_ROUTE}/products`,
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    href: `${ADMIN_ROUTE}/orders`,
  },
  {
    label: "Customers",
    icon: Users,
    href: `${ADMIN_ROUTE}/customers`,
  },
  {
    label: "Promotions",
    icon: Tag,
    href: `${ADMIN_ROUTE}/promotions`,
  },
  {
    label: "Inbox",
    icon: Mail,
    href: `${ADMIN_ROUTE}/inbox`,
  },
  {
    label: "Settings",
    icon: Settings,
    href: `${ADMIN_ROUTE}/settings`,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-full bg-white border-r border-gray-100 flex flex-col py-6 px-4">
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-primary/60",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-gray-100">
        <div className="bg-[#FAF9F6] p-4 rounded-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Role
          </p>
          <p className="text-sm font-serif font-bold text-primary">
            Store Manager
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
