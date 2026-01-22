import { create } from "zustand";

const useCategory = create((set) => ({
  categories: [],

  getCategories: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Categories couldn't be fetched");

      const data = await res.json();

      set({ categories: data.categories });
    } catch (error) {
      console.log(error.message);
    }
  },
}));

export default useCategory;
