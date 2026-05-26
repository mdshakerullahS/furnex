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
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "@/stores/userStore";

const ADMIN_ROUTE = "/admin";

export const menuItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: ADMIN_ROUTE,
    roles: ["super_admin", "manager", "staff"],
  },
  {
    label: "Categories",
    icon: Tag,
    href: `${ADMIN_ROUTE}/categories`,
    roles: ["super_admin", "manager", "staff"],
  },
  {
    label: "Products",
    icon: Package,
    href: `${ADMIN_ROUTE}/products`,
    roles: ["super_admin", "manager", "staff"],
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    href: `${ADMIN_ROUTE}/orders`,
    roles: ["super_admin", "manager", "staff"],
  },
  {
    label: "Customers",
    icon: Users,
    href: `${ADMIN_ROUTE}/customers`,
    roles: ["super_admin", "manager"],
  },
  {
    label: "Promotions",
    icon: Tag,
    href: `${ADMIN_ROUTE}/promotions`,
    roles: ["super_admin", "manager", "staff"],
  },
  {
    label: "Inbox",
    icon: Mail,
    href: `${ADMIN_ROUTE}/inbox`,
    roles: ["super_admin", "manager", "staff"],
  },
  {
    label: "Settings",
    icon: Settings,
    href: `${ADMIN_ROUTE}/settings`,
    roles: ["super_admin", "manager"],
  },
  {
    label: "Team",
    icon: ShieldCheck,
    href: `${ADMIN_ROUTE}/team`,
    roles: ["super_admin", "admin"],
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const user = useAuth((state) => state.user);

  const userRole = user?.role || "customer";

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <aside className="w-[260px] h-full bg-white border-r border-gray-100 flex flex-col py-6 px-4">
      <nav className="flex-1 space-y-2">
        {filteredMenu.map((item) => {
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
    </aside>
  );
};

export default AdminSidebar;
