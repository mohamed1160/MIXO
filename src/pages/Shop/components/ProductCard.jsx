import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useShopStore } from "../../../store/useShopStore";
import { useLanguage } from "../../../providers/LanguageContext";
import { cn } from "../../../lib/utils";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setQuickViewOpen] = useState(false);
  
  const { isRTL } = useLanguage();
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const wishlist = useShopStore((state) => state.wishlist);
  const addToCart = useShopStore((state) => state.addToCart);
  
  const isWishlisted = wishlist.some(
    (item) => (typeof item === "object" ? item.id : item) === product.id
  );
  const hasSecondaryImage = product.images?.length > 1;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const rating = product.rating || null;
  const sold = product.sold || product.reviewCount || product.salesCount || 0;
  
  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  // Bilingual Title & Category
  const displayTitle = isRTL 
    ? (product.nameAr || product.titleAr || product.name || product.title)
    : (product.nameEn || product.title || product.name);

  const displayCategory = isRTL
    ? (product.categoryAr || product.category || "مجسمات 3D")
    : (product.categoryEn || product.category || "3D Prints");

  const currencyText = isRTL ? "ج.م" : "EGP";

  return (
    <>
      <motion.div
        className="group relative flex flex-col w-full bg-white dark:bg-[#121820] rounded-[22px] border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-xl hover:shadow-[#FF1F3D]/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.4 }}
      >
        {/* Top Image Container */}
        <div 
          className="relative w-full aspect-square bg-gray-50 dark:bg-[#171F2A] overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleQuickView}
        >
          <img
            src={product.images?.[0] || product.image}
            alt={displayTitle}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 ease-out"
            loading="lazy"
          />

          <AnimatePresence>
            {hasSecondaryImage && isHovered && (
              <motion.img
                src={product.images[1]}
                alt={`${displayTitle} view 2`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                loading="lazy"
              />
            )}
          </AnimatePresence>

          {/* New Arrival Badge */}
          {product.isNewArrival && (
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-[#FF1F3D] text-white text-[10px] font-extrabold tracking-wider rounded-full px-2.5 py-0.5 shadow-md shadow-[#FF1F3D]/30">
                NEW
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-[#121820]/90 backdrop-blur-md shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isWishlisted ? "fill-[#FF1F3D] text-[#FF1F3D]" : "text-gray-400 hover:text-[#FF1F3D]"
              )}
            />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col flex-1 bg-white dark:bg-[#121820]">
          
          {/* Category */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF1F3D] mb-1.5 line-clamp-1">
            {displayCategory}
          </span>
          
          {/* Title */}
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 mb-2 group-hover:text-[#FF1F3D] transition-colors">
            {displayTitle}
          </h3>

          {/* Rating & Sold count */}
          {(sold > 0 || rating > 0) && (
            <div className="flex items-center gap-1.5 mb-3 text-xs">
              <div className="flex text-amber-400 text-xs">
                ★
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-bold">
                {rating || 5.0}
              </span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium text-[11px]">
                {sold} {isRTL ? "مُباع" : "Sold"}
              </span>
            </div>
          )}

          {/* Price & Actions */}
          <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800/60">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-base sm:text-lg font-black text-[#FF1F3D]">
                {product.price} {currencyText}
              </span>
              
              {product.oldPrice && (
                <>
                  <span className="text-gray-400 dark:text-gray-500 text-xs line-through font-medium">
                    {product.oldPrice} {currencyText}
                  </span>
                  {discountPercent > 0 && (
                    <span className="ml-auto bg-red-500/10 text-[#FF1F3D] dark:bg-[#FF1F3D]/20 dark:text-red-400 text-[9px] font-black uppercase rounded-full px-2 py-0.5">
                      -{discountPercent}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                aria-label="Add to cart"
                className="w-full h-9 rounded-full bg-[#FF1F3D] hover:bg-[#E01833] active:scale-95 text-white flex items-center justify-center gap-1.5 text-[11px] font-bold tracking-wide transition-all shadow-md shadow-[#FF1F3D]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? (
                  isRTL ? "نفذت الكمية" : "Out of Stock"
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isRTL ? "إضافة للسلة" : "Add to Cart"}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleQuickView}
                aria-label="Quick view"
                className="w-full h-9 rounded-full border border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1.5 text-[11px] font-bold tracking-wide transition-all active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isRTL ? "نظرة سريعة" : "Quick View"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
