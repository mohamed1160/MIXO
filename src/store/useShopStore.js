import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultFilters = {
  searchQuery: "",
  category: "All",
  categories: [],
  minPrice: 0,
  maxPrice: 50000,
  inStock: false,
  outOfStock: false,
  sizes: [],
  colors: [],
  materials: [],
  collections: [],
  genders: [],
  minRating: 0,
  discountOnly: false,
};

export const useShopStore = create()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          page: 1,
        })),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          page: 1,
        })),
      resetFilters: () => set({ filters: defaultFilters, page: 1 }),

      sort: "Featured",
      setSort: (sort) => set({ sort, page: 1 }),

      page: 1,
      setPage: (page) => set({ page }),

      isDrawerOpen: false,
      setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),

      wishlist: [],
      toggleWishlist: (product) =>
        set((state) => {
          const targetId = typeof product === "object" ? product.id : product;
          const exists = state.wishlist.some(
            (item) => (typeof item === "object" ? item.id : item) === targetId
          );
          if (exists) {
            return {
              wishlist: state.wishlist.filter(
                (item) => (typeof item === "object" ? item.id : item) !== targetId
              ),
            };
          }
          return {
            wishlist: [...state.wishlist, product],
          };
        }),

      cart: [],
      addToCart: (product, quantity = 1, size = "One Size", color = "Default") =>
        set((state) => {
          const itemQty = product.quantity || quantity || 1;
          const itemSize = product.size || size || "One Size";
          const itemColor = product.color || product.selectedColor || color || "Default";

          const existingItemIndex = state.cart.findIndex(
            (item) => item.id === product.id && item.size === itemSize && item.color === itemColor
          );
          if (existingItemIndex >= 0) {
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex].quantity += itemQty;
            return { cart: updatedCart };
          }
          return { cart: [...state.cart, { ...product, quantity: itemQty, size: itemSize, color: itemColor }] };
        }),
      removeFromCart: (productId, size, color) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.id === productId && item.size === size && item.color === color)
          ),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId && item.size === size && item.color === color
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),
      get cartCount() {
        // We can define it as a getter, but Zustand state doesn't natively support getters well inside set.
        // Let's just compute it in the component. We'll leave cartCount as a function or just rely on state.cart.reduce.
        return undefined; // We will remove cartCount and compute it on the fly in components
      },
    }),
    {
      name: "MIXO-shop-storage",
      partialize: (state) => ({
        wishlist: state.wishlist,
        cart: state.cart,
      }),
    },
  ),
);

