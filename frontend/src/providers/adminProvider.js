"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

        if (data?.user.role !== "admin") {
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
