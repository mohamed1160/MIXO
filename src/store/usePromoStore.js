import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePromoStore = create()(
  persist(
    (set) => ({
      // Control options
      isEnabled: true,
      delaySeconds: 2,
      showOncePerSession: false,

      // Content: English sentence & CTA redirecting to Home (/)
      message: "Special offers exceeding 25% OFF! 🔥",
      buttonText: "Shop Now 🛍️",
      buttonLink: "/",

      // Actions
      setIsEnabled: (isEnabled) => set({ isEnabled }),
      updatePromoConfig: (newConfig) =>
        set((state) => ({ ...state, ...newConfig })),
      
      resetToDefault: () =>
        set({
          isEnabled: true,
          delaySeconds: 2,
          showOncePerSession: false,
          message: "Special offers exceeding 25% OFF! 🔥",
          buttonText: "Shop Now 🛍️",
          buttonLink: "/",
        }),
    }),
    {
      name: "MIXO-promo-popup-storage",
    }
  )
);
