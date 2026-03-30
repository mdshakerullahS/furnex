"use client";

import useAuth from "@/stores/userStore";
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
  const { setUser } = useAuth();

  useEffect(() => {
    const loginStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || res.status !== 200 || !data?.user) {
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch {
        setUser(null);
        return null;
      }
    };

    loginStatus();
  }, [setUser]);

  return children;
};

export default AuthProvider;
