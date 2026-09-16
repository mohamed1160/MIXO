import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart, Check } from "lucide-react";
import { useShopStore } from "../store/useShopStore";
import { useLanguage } from "../providers/LanguageContext";
import MaskDimensionsModal from "./MaskDimensionsModal";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const [isMaskModalOpen, setIsMaskModalOpen] = useState(false);

  const wishlist = useShopStore((state) => state.wishlist);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const cart = useShopStore((state) => state.cart);
  const addToCart = useShopStore((state) => state.addToCart);

  if (!product) return null;

  const id = product.id;
  const title = product.title || product.name;
  const image = product.image || (product.images && product.images[0]);
  const price = product.price;
  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || product.reviewsCount || 0;
  const category = product.category || "3D Print";
  const isMask = product.isMask || category.toLowerCase().includes("mask");

  const isFavorite = wishlist?.some(
    (item) => (typeof item === "object" ? item.id : item) === id
  );

  const isInCart = cart?.some((item) => item.id === id);

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isMask) {
      // Open mask dimensions modal for mask items
      setIsMaskModalOpen(true);
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group cursor-pointer bg-white dark:bg-[#0F151D] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#1E2630] p-2.5 sm:p-3.5 mixo-card-hover flex flex-col justify-between"
      >
        {/* Top Image Container */}
        <div className="relative aspect-square w-full rounded-lg sm:rounded-xl bg-gray-50 dark:bg-[#0B0F14] overflow-hidden flex items-center justify-center">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Floating Heart Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-200 active:scale-90 ${
              isFavorite
                ? "bg-[#FF1F3D] text-white shadow-red-500/20 scale-105"
                : "bg-white/80 dark:bg-[#151C24]/80 text-gray-600 dark:text-[#AAB4C0] hover:bg-white hover:text-[#FF1F3D] dark:hover:bg-[#151C24] dark:hover:text-[#FF1F3D]"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isFavorite ? "fill-current scale-110" : ""}`} />
          </button>
        </div>

        {/* Card Content */}
        <div className="mt-2 sm:mt-3.5 flex flex-col flex-1">
          <span className="text-[10px] sm:text-xs font-medium text-gray-400 dark:text-[#7F8A96] leading-tight mb-0.5">
            {category}
          </span>

          <h3 className="font-bold text-xs sm:text-base text-gray-900 dark:text-[#F5F7FA] line-clamp-1 group-hover:text-black dark:group-hover:text-white transition-colors">
            {title}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-[#7F8A96]">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-gray-800 dark:text-[#F5F7FA]">
              {rating}
            </span>
            <span>({reviewCount})</span>
          </div>

          {/* Price & Add to Cart Container */}
          <div className="mt-2 sm:mt-3 pt-1 sm:pt-2 flex flex-col gap-2">
            <div className="font-bold text-xs sm:text-lg text-gray-900 dark:text-white tracking-tight">
              ${Number(price).toFixed(2)}
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
                isInCart
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  : "bg-black dark:bg-[#151C24] text-white dark:text-white hover:bg-[#FF1F3D] dark:hover:bg-[#FF1F3D] border border-transparent dark:border-[#26313D] hover:border-[#FF1F3D] shadow-sm"
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{t.popular.inCart}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{isMask ? (isRTL ? "تحديد الأبعاد والشراء" : "Select Dimensions") : t.popular.addToCart}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mask Dimensions Modal for Mask Products */}
      {isMask && (
        <MaskDimensionsModal
          isOpen={isMaskModalOpen}
          onClose={() => setIsMaskModalOpen(false)}
          product={product}
        />
      )}
    </>
  );
}
