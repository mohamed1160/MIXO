import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Check } from "lucide-react";
import { useShopStore } from "../store/useShopStore";
import { useLanguage } from "../providers/LanguageContext";
import MaskDimensionsModal from "./MaskDimensionsModal";
import QuickViewModal from "../pages/Shop/components/QuickViewModal";

export default function ArtifactCard({ product }) {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const [isMaskModalOpen, setIsMaskModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const wishlist = useShopStore((state) => state.wishlist);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const cart = useShopStore((state) => state.cart);

  if (!product) return null;

  const id = product.id;
  const title = product.title || product.name;
  const description = product.description || product.desc || "";
  const image = product.image || (product.images && product.images[0]);
  const price = Number(product.price) || 0;
  const originalPrice = (product.originalPrice || product.oldPrice)
    ? Number(product.originalPrice || product.oldPrice)
    : (price > 0 ? Math.round(price * 1.25) : null);
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const rating = product.rating && Number(product.rating) > 0 ? Number(product.rating).toFixed(1) : (product.rating ? String(product.rating) : null);
  const category = product.category || "";
  const isMask = product.isMask || category.toLowerCase().includes("mask") || category.includes("ماسكات") || category.includes("أقنعة");

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
      setIsMaskModalOpen(true);
    } else {
      setIsQuickViewOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group cursor-pointer bg-[#0f1219]/90 hover:bg-[#141824] border border-[#ff1f3d]/25 hover:border-[#ff1f3d]/75 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.7)] hover:shadow-[0_12px_35px_rgba(255,31,61,0.3)] text-white relative overflow-hidden"
      >
        {/* Subtle Cyber Sheen Accent */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ff1f3d]/15 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

        {/* Product Image Wrapper */}
        <div className="relative aspect-[4/3.5] w-full rounded-xl bg-[#080a0f] overflow-hidden flex items-center justify-center mb-2.5 border border-white/10 group-hover:border-[#ff1f3d]/40 transition-colors">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Neon Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#ff1f3d]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-[#ff1f3d] text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(255,31,61,0.6)] z-10 tracking-wider">
              -{discountPercent}%
            </div>
          )}

          {/* Floating Heart Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2 right-2 w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-90 z-10 ${
              isFavorite
                ? "bg-[#ff1f3d] text-white shadow-lg shadow-red-500/40 scale-105"
                : "bg-black/60 text-white/80 hover:text-white hover:bg-[#ff1f3d] border border-white/15"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Card Content Info */}
        <div className="flex flex-col flex-1 justify-between relative z-10">
          <div>
            {/* Title */}
            <h3 className="font-extrabold text-xs sm:text-base leading-snug text-white line-clamp-1 group-hover:text-[#ff2e4d] transition-colors mb-1">
              {title}
            </h3>

            {/* Description (if exists) */}
            {description && (
              <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-2 mb-2 font-normal leading-relaxed">
                {description}
              </p>
            )}

            {/* Price & Rating Row */}
            <div className="flex items-center justify-between my-1.5 gap-1.5 flex-wrap">
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="font-black text-sm sm:text-xl text-[#ff2e4d] drop-shadow-[0_0_10px_rgba(255,31,61,0.4)]">
                  {price.toLocaleString('en-US')} {isRTL ? "ج.م" : "EGP"}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through font-semibold">
                    {originalPrice.toLocaleString('en-US')} {isRTL ? "ج.م" : "EGP"}
                  </span>
                )}
              </div>

              {rating && (
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-400/30 backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart Cyber Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-md mt-2 ${
              isInCart
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30 border border-emerald-400/30"
                : "bg-gradient-to-r from-[#ff1f3d] to-[#c8102e] hover:from-[#ff3352] hover:to-[#e01833] text-white shadow-[0_4px_18px_rgba(255,31,61,0.45)] border border-[#ff3352]/30"
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.popular.inCart}</span>
              </>
            ) : (
              <>
                <span>{isRTL ? "أضف إلى السلة" : "ADD TO CART"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mask Dimensions Modal */}
      {isMask && (
        <MaskDimensionsModal
          isOpen={isMaskModalOpen}
          onClose={() => setIsMaskModalOpen(false)}
          product={product}
        />
      )}

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
