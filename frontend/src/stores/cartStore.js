import { toast } from "sonner";
import { create } from "zustand";

const useCart = create((set, get) => ({
  cart: {},
  quantities: {},

  setQuantities: (qty) => {
    set({ quantities: qty });
  },

  addCart: async (id) => {
    const { quantities } = get();
    const qty = quantities[id] || 1;

    try {
      let guestID = localStorage.getItem("guestID");
      if (!guestID) {
        guestID = crypto.randomUUID();
        localStorage.setItem("guestID", guestID);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({ productID: id, quantity: qty, guestID }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed adding product to cart");
      }

      get().getCart();

      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  },

  getCart: async () => {
    try {
      const guestID = localStorage.getItem("guestID");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/my-cart`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestID }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      set({ cart: data.cart });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateQty: async (productID, quantity) => {
    try {
      const guestID = localStorage.getItem("guestID");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/my-cart`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestID, productID, quantity }),
        },
      );

      if (!res.ok) throw new Error("Failed to update Qty");

      get().getCart();

      if (quantity === +1) toast.success("Quantity increased");
      if (quantity === -1) toast.success("Quantity decreased");
    } catch {
      toast.error("Failed to update quantity");
    }
  },

  removeItem: async (productID) => {
    try {
      const guestID = localStorage.getItem("guestID");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/my-cart/item`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestID, productID }),
        },
      );

      if (!res.ok) throw new Error("Failed to remove item");

      get().getCart();

      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  },

  clearCart: async () => {
    try {
      const guestID = localStorage.getItem("guestID");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/my-cart`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestID }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      get().getCart();

      toast.success(data.message);
    } catch {
      toast.error("Failed to clear cart");
    }
  },
}));

export default useCart;
