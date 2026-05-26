"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { menuItems } from "@/components/AdminSidebar";

const AdminProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || res.status !== 200 || !data?.user) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        const validAdminRoles = ["super_admin", "manager", "staff"];
        if (!validAdminRoles.includes(data?.user.role)) {
          router.push("/unauthorized");
          return;
        }

        // Check specific route permissions using menuItems logic
        const userRole = data?.user.role;
        const matchingMenu = menuItems.find(
          (item) => pathname.startsWith(item.href) && item.href !== "/admin",
        );

        // If it's the exact admin route (overview), check that first
        if (pathname === "/admin") {
          const overviewItem = menuItems.find((item) => item.href === "/admin");
          if (overviewItem && !overviewItem.roles.includes(userRole)) {
            router.push("/unauthorized");
            return;
          }
        } else if (matchingMenu && !matchingMenu.roles.includes(userRole)) {
          router.push("/unauthorized");
          return;
        }

        setAuthorized(true);
      } catch {
        toast.error("Unauthorized");
      }
    };

    checkAdmin();
  }, [pathname, router]);

  if (!authorized)
    return (
      <div className="h-screen flex items-center justify-center">
        Checking permissions...
      </div>
    );

  return children;
};

export default AdminProvider;
