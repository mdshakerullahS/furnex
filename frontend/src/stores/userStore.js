import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuth = create(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => {
        set({ user });
      },

      logOut: async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {
              method: "POST",
              credentials: "include",
            },
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }

          set({ user: null });
          toast.success(data.message);
        } catch {
          toast.error("Failed to logout");
        }
      },
    }),
    { name: "UserInfo", storage: createJSONStorage(() => localStorage) },
  ),
);

export default useAuth;
