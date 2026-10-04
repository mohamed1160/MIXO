import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart, Check } from "lucide-react";
import { useShopStore } from "../store/useShopStore";
import { useLanguage } from "../providers/LanguageContext";
import MaskDimensionsModal from "./MaskDimensionsModal";
import QuickViewModal from "../pages/Shop/components/QuickViewModal";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const [isMaskModalOpen, setIsMaskModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const wishlist = useShopStore((state) => state.wishlist);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const cart = useShopStore((state) => state.cart);
  const addToCart = useShopStore((state) => state.addToCart);

  if (!product) return null;

  const id = product.id;
  const title = product.title || product.name;
  const image = product.image || (product.images && product.images[0]);
  const price = Number(product.price) || 0;
  const originalPrice = (product.originalPrice || product.oldPrice) ? Number(product.originalPrice || product.oldPrice) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const rating = product.rating || null;
  const reviewCount = product.reviewCount || product.reviewsCount || 0;
  const category = product.category || "3D Print";
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
      // Open mask dimensions modal for mask items
      setIsMaskModalOpen(true);
    } else {
      // Open quick view modal to select color
      setIsQuickViewOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        style={{
          maskImage: 'radial-gradient(circle 11px at 0% 61.5%, transparent 10.5px, black 11px), radial-gradient(circle 11px at 100% 61.5%, transparent 10.5px, black 11px)',
          WebkitMaskImage: 'radial-gradient(circle 11px at 0% 61.5%, transparent 10.5px, black 11px), radial-gradient(circle 11px at 100% 61.5%, transparent 10.5px, black 11px)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'destination-in',
        }}
        className="group relative cursor-pointer bg-[#0f1219] hover:bg-[#141824] dark:bg-[#0F151D] dark:hover:bg-[#151C24] text-white rounded-2xl border border-gray-200 dark:border-[#1E2630] hover:border-black dark:hover:border-white/50 p-3.5 sm:p-4 flex flex-col justify-between shadow-lg transition-all duration-300 transform overflow-hidden min-h-[490px] sm:min-h-[530px]"
      >
        {/* Top-Left Spiderweb Corner Accent */}
        <div className="absolute top-0 left-0 z-20 pointer-events-none p-0.5">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 sm:w-12 sm:h-12 text-white/60 group-hover:text-white/90 transition-colors"
          >
            <line x1="0" y1="0" x2="100" y2="0" />
            <line x1="0" y1="0" x2="0" y2="100" />
            <line x1="0" y1="0" x2="95" y2="95" />
            <line x1="0" y1="0" x2="42" y2="95" />
            <line x1="0" y1="0" x2="95" y2="42" />

            <path d="M 22 0 Q 22 22 0 22" />
            <path d="M 44 0 Q 44 44 0 44" />
            <path d="M 66 0 Q 66 66 0 66" />
            <path d="M 88 0 Q 88 88 0 88" />
          </svg>
        </div>

        {/* 1. TOP TICKET BOX (Image Box with Dashed Frame & Corner Stars) */}
        <div className="relative aspect-square w-full rounded-xl bg-[#080a0f] border-2 border-dashed border-white/20 group-hover:border-white/40 p-1 flex items-center justify-center overflow-hidden">
          {/* Corner Stars */}
          <span className="absolute top-2 left-2 text-[10px] text-white/40 z-10 pointer-events-none select-none">★</span>
          <span className="absolute top-2 right-2 text-[10px] text-white/40 z-10 pointer-events-none select-none">★</span>
          <span className="absolute bottom-2 left-2 text-[10px] text-white/40 z-10 pointer-events-none select-none">★</span>
          <span className="absolute bottom-2 right-2 text-[10px] text-white/40 z-10 pointer-events-none select-none">★</span>

          {/* Primary Product Image */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Secondary Hover Image (if product has multiple images) */}
          {Array.isArray(product.images) && product.images.length > 1 && (
            <img
              src={product.images[1]}
              alt={`${title} - view 2`}
              className="absolute inset-0 w-full h-full object-cover object-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"
              loading="lazy"
            />
          )}

          {/* Multiple Images Badge */}
          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm border border-white/10 z-10 pointer-events-none flex items-center gap-1">
              <span>📷</span>
              <span>1/{product.images.length}</span>
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2.5 left-2.5 bg-[#FF1F3D] text-white text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-md shadow-md z-10">
              -{discountPercent}%
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-200 active:scale-90 z-10 ${
              isFavorite
                ? "bg-[#FF1F3D] text-white shadow-red-500/20 scale-105"
                : "bg-black/60 text-white hover:bg-black/90 border border-white/20"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isFavorite ? "fill-current scale-110" : ""}`} />
          </button>
        </div>

        {/* 2. PERFORATED TICKET DOTTED DIVIDER */}
        <div className="relative my-2.5 flex items-center justify-center px-1">
          <svg className="w-full h-[3px]" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="1.5" x2="100%" y2="1.5" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.5" strokeDasharray="0 12" strokeLinecap="round" />
          </svg>
        </div>

        {/* 3. BOTTOM TICKET STUB BOX (Info Box with Title, Barcode, Price & CTA) */}
        <div className="relative rounded-xl bg-[#080a0f]/80 dark:bg-[#0B0F14]/90 border border-white/15 group-hover:border-white/30 p-2.5 sm:p-3 flex flex-col gap-2 text-center flex-1 justify-between">
          <span className="absolute top-1.5 left-2 text-[8px] text-white/30 pointer-events-none select-none">★</span>
          <span className="absolute top-1.5 right-2 text-[8px] text-white/30 pointer-events-none select-none">★</span>

          <div>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400 leading-tight mb-0.5 block">
              {category}
            </span>

            <h3 className="font-extrabold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-gray-200 transition-colors">
              {title}
            </h3>
          </div>

          <div className="flex flex-col gap-2 mt-0.5">
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <span className="font-extrabold text-sm sm:text-base text-white">
                {price.toLocaleString('en-US')} {isRTL ? "ج.م" : "EGP"}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through font-semibold">
                  {originalPrice.toLocaleString('en-US')}
                </span>
              )}
            </div>

            {/* Decorative Ticket Barcode SVG */}
            <div className="w-full flex flex-col items-center opacity-40 group-hover:opacity-75 transition-opacity">
              <svg className="w-28 sm:w-32 h-4 sm:h-5 text-white fill-current" viewBox="0 0 100 20">
                <rect x="2" y="2" width="2" h="16"/>
                <rect x="6" y="2" width="1" h="16"/>
                <rect x="9" y="2" width="3" h="16"/>
                <rect x="14" y="2" width="1" h="16"/>
                <rect x="17" y="2" width="4" h="16"/>
                <rect x="23" y="2" width="1" h="16"/>
                <rect x="26" y="2" width="2" h="16"/>
                <rect x="30" y="2" width="1" h="16"/>
                <rect x="33" y="2" width="3" h="16"/>
                <rect x="38" y="2" width="2" h="16"/>
                <rect x="42" y="2" width="1" h="16"/>
                <rect x="45" y="2" width="4" h="16"/>
                <rect x="51" y="2" width="2" h="16"/>
                <rect x="55" y="2" width="1" h="16"/>
                <rect x="58" y="2" width="3" h="16"/>
                <rect x="63" y="2" width="1" h="16"/>
                <rect x="66" y="2" width="2" h="16"/>
                <rect x="70" y="2" width="4" h="16"/>
                <rect x="76" y="2" width="1" h="16"/>
                <rect x="79" y="2" width="2" h="16"/>
                <rect x="83" y="2" width="3" h="16"/>
                <rect x="88" y="2" width="1" h="16"/>
                <rect x="91" y="2" width="2" h="16"/>
                <rect x="95" y="2" width="3" h="16"/>
              </svg>
              <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.2em] text-white/60 -mt-0.5">MIXO-TICKET-{id}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-1.5 sm:py-2 px-2 sm:px-4 rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                isInCart
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  : "bg-white text-black hover:bg-white/90 border border-white shadow-sm"
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

      {/* Quick View Modal for Color Selection */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
