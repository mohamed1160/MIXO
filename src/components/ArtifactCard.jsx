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
        className="group cursor-pointer bg-[#12151c] hover:bg-[#161a24] border border-white/10 hover:border-[#ff1f3d]/60 rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl text-white"
      >
        {/* Product Image */}
        <div className="relative aspect-[4/3.5] w-full rounded-xl bg-[#090b0e] overflow-hidden flex items-center justify-center mb-3">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2.5 left-2.5 bg-[#ff1f3d] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md z-10">
              -{discountPercent}%
            </div>
          )}

          {/* Floating Heart Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-90 z-10 ${
              isFavorite
                ? "bg-[#ff1f3d] text-white shadow-lg shadow-red-500/30 scale-105"
                : "bg-black/50 text-white/70 hover:text-[#ff1f3d] hover:bg-black/80"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Card Info */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            {/* Title */}
            <h3 className="font-extrabold text-sm sm:text-base leading-snug text-white line-clamp-1 group-hover:text-[#ff1f3d] transition-colors mb-1">
              {title}
            </h3>

            {/* Description (if exists) */}
            {description && (
              <p className="text-xs text-gray-400 line-clamp-2 mb-2 font-normal leading-relaxed">
                {description}
              </p>
            )}

            {/* Price & Rating Row */}
            <div className="flex items-center justify-between my-2 gap-2 flex-wrap">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-black text-lg sm:text-xl text-[#ff2e4d]">
                  {price.toLocaleString('en-US')} {isRTL ? "ج.م" : "EGP"}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through font-semibold">
                    {originalPrice.toLocaleString('en-US')} {isRTL ? "ج.م" : "EGP"}
                  </span>
                )}
              </div>

              {rating && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 sm:py-3 rounded-full text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md mt-2 ${
              isInCart
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/30"
                : "bg-[#ff1f3d] hover:bg-[#e01833] text-white shadow-[0_4px_15px_rgba(255,31,61,0.4)]"
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
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
