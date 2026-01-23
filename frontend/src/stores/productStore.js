import { create } from "zustand";

const useProducts = create((set, get) => ({
  search: "",
  selectedCategory: "",
  sortBy: "default",
  limit: 12,
  currentPage: 1,
  minPrice: 0,
  maxPrice: 999999,
  products: [],
  totalProducts: null,
  bestSellers: [],

  setSearch: (search) => {
    set({ search });
  },
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },
  setSortBy: (sortBy) => {
    set({ sortBy });
  },
  setLimit: (limit) => {
    set({ limit });
  },
  setCurrentPage: (currentPage) => {
    set({ currentPage });
  },
  setMinPrice: (minPrice) => {
    set({ minPrice });
  },
  setMaxPrice: (maxPrice) => {
    set({ maxPrice });
  },

  getProducts: async () => {
    try {
      const {
        search,
        selectedCategory,
        minPrice,
        maxPrice,
        sortBy,
        currentPage,
        limit,
      } = get();
      const query = new URLSearchParams();

      if (search) query.set("search", search);
      if (selectedCategory) query.set("category", selectedCategory);
      if (minPrice) query.set("minPrice", minPrice);
      if (maxPrice) query.set("maxPrice", maxPrice);
      if (sortBy) query.set("sortBy", sortBy);
      if (currentPage) query.set("currentPage", currentPage);
      if (limit) query.set("limit", limit);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?${query.toString()}`,
      );
      const data = await res.json();

      set({ products: data.products, totalProducts: data.totalProducts });

      return query.toString();
    } catch (error) {
      console.log(error.message);
    }
  },
  getBestSellers: async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/best-sellers`,
      );
      const data = await res.json();

      set({ bestSellers: data.bestSellers });
    } catch (error) {
      console.log(error.message);
    }
  },
}));

export default useProducts;
