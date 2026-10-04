"use client";

import React, { memo, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Star, ShoppingBag, Heart, Check, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShopStore } from "../../store/useShopStore";
import { useLanguage } from "../../providers/LanguageContext";
import MaskDimensionsModal from "../MaskDimensionsModal";
import QuickViewModal from "../../pages/Shop/components/QuickViewModal";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(query, { defaultValue = false, initializeWithValue = true } = {}) {
  const getMatches = (query) => {
    if (IS_SERVER) return defaultValue;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(() => {
    if (initializeWithValue) return getMatches(query);
    return defaultValue;
  });

  const handleChange = () => {
    setMatches(getMatches(query));
  };

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();
    matchMedia.addEventListener("change", handleChange);
    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

const transition = { duration: 0.15, ease: [0.32, 0.72, 0, 1] };
const transitionOverlay = { duration: 0.4, ease: [0.32, 0.72, 0, 1] };

const Carousel = memo(
  ({
    handleClick,
    controls,
    products = [],
    isCarouselActive,
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)");
    const cylinderWidth = isScreenSizeSm ? 1100 : 1800;
    const count = products.length;
    const faceCount = count > 0 ? (count < 4 ? 6 : count) : 1;
    const faceWidth = cylinderWidth / faceCount;
    const radius = cylinderWidth / (2 * Math.PI);
    const rotation = useMotionValue(0);
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    );

    useEffect(() => {
      rotation.set(0);
      if (controls) {
        controls.set({ rotateY: 0 });
      }
    }, [products, rotation, controls]);

    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const wishlist = useShopStore((state) => state.wishlist);
    const toggleWishlist = useShopStore((state) => state.toggleWishlist);

    return (
      <div
        className="flex h-full items-center justify-center select-none"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing items-center"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) =>
            isCarouselActive &&
            rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) =>
            isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
          animate={controls}
        >
          {products.map((product, i) => {
            const id = product.id;
            const title = product.title || product.name || "";
            const image = product.image || (product.images && product.images[0]);
            const price = Number(product.price) || 0;
            const originalPrice = product.originalPrice || product.oldPrice
              ? Number(product.originalPrice || product.oldPrice)
              : price > 0
              ? Math.round(price * 1.25)
              : null;
            const hasDiscount = originalPrice && originalPrice > price;
            const discountPercent = hasDiscount
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : 0;

            const isFavorite = wishlist?.some(
              (item) => (typeof item === "object" ? item.id : item) === id
            );

            return (
              <motion.div
                key={`key-${id}-${i}`}
                className="absolute flex origin-center items-center justify-center p-2"
                style={{
                  width: `${faceWidth}px`,
                  transform: `rotateY(${
                    i * (360 / faceCount)
                  }deg) translateZ(${radius}px)`,
                }}
              >
                <div
                  onClick={() => handleClick(product, i)}
                  className="group relative w-full bg-[#0f1219]/95 hover:bg-[#141824] border border-[#ff1f3d]/30 hover:border-[#ff1f3d]/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_15px_40px_rgba(255,31,61,0.35)] text-white transition-all duration-300 transform group-hover:-translate-y-2 overflow-hidden cursor-pointer"
                >
                  {/* Subtle Top Red Sheen */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#ff1f3d]/20 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform" />

                  {/* Image Container */}
                  <div className="relative aspect-square w-full rounded-xl bg-[#080a0f] overflow-hidden flex items-center justify-center mb-2.5 border border-white/10 group-hover:border-[#ff1f3d]/40">
                    <motion.img
                      src={image}
                      alt={title}
                      layoutId={`img-${id}`}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out pointer-events-none"
                      initial={{ filter: "blur(4px)" }}
                      animate={{ filter: "blur(0px)" }}
                      transition={transition}
                    />

                    {/* Hover Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#ff1f3d]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="absolute top-2 left-2 bg-[#ff1f3d] text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(255,31,61,0.6)] z-10 tracking-wider">
                        -{discountPercent}%
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-10 ${
                        isFavorite
                          ? "bg-[#ff1f3d] text-white shadow-lg shadow-red-500/40"
                          : "bg-black/60 text-white/80 hover:text-white hover:bg-[#ff1f3d] border border-white/15"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Info Block */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    {/* Title */}
                    <h3 className="font-extrabold text-xs sm:text-sm text-white line-clamp-1 text-center group-hover:text-[#ff2e4d] transition-colors">
                      {title}
                    </h3>

                    {/* Price Row */}
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                      <span className="font-black text-sm sm:text-base text-[#ff2e4d] drop-shadow-[0_0_10px_rgba(255,31,61,0.4)]">
                        {price.toLocaleString("en-US")} {isRTL ? "ج.م" : "EGP"}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">
                          {originalPrice.toLocaleString("en-US")}
                        </span>
                      )}
                    </div>

                    {/* Full-width VIEW 3D CTA Button (Monochrome Black & White) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(product, i);
                      }}
                      className="w-full py-1.5 sm:py-2 rounded-xl bg-white text-black hover:bg-white/90 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-all duration-200 border border-white active:scale-95 mt-0.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-black" />
                      <span>{isRTL ? "معاينة 3D" : "VIEW 3D"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }
);

export function ThreeDPhotoCarousel({ products = [] }) {
  const [activeProduct, setActiveProduct] = useState(null);
  const [isCarouselActive, setIsCarouselActive] = useState(true);
  const [isMaskModalOpen, setIsMaskModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const controls = useAnimation();
  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();
  const cart = useShopStore((state) => state.cart);

  const handleClick = (product) => {
    setActiveProduct(product);
    setIsCarouselActive(false);
    controls.stop();
  };

  const handleClose = () => {
    setActiveProduct(null);
    setIsCarouselActive(true);
  };

  if (!products || products.length === 0) return null;

  const isMask = activeProduct
    ? activeProduct.isMask || (activeProduct.category || "").toLowerCase().includes("mask") || (activeProduct.category || "").includes("ماسكات") || (activeProduct.category || "").includes("أقنعة")
    : false;

  const isInCart = activeProduct ? cart?.some((item) => item.id === activeProduct.id) : false;

  return (
    <motion.div layout className="relative w-full overflow-hidden py-4">
      {/* 3D Carousel Cylinder Container */}
      <div className="relative h-[460px] sm:h-[520px] w-full overflow-hidden">
        <Carousel
          handleClick={handleClick}
          controls={controls}
          products={products}
          isCarouselActive={isCarouselActive}
        />
      </div>

      {/* Expanded Product Lightbox / Modal */}
      <AnimatePresence mode="sync">
        {activeProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            layoutId={`img-container-${activeProduct.id}`}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6"
            onClick={handleClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#0f1219] border-2 border-[#ff1f3d] rounded-3xl p-6 shadow-[0_0_50px_rgba(255,31,61,0.5)] text-white flex flex-col gap-4 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-[#ff1f3d] text-white transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Image */}
              <div className="relative w-full aspect-4/3 rounded-2xl bg-[#080a0f] overflow-hidden border border-white/10 flex items-center justify-center">
                <motion.img
                  layoutId={`img-${activeProduct.id}`}
                  src={activeProduct.image || (activeProduct.images && activeProduct.images[0])}
                  alt={activeProduct.title || activeProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-2xl font-black tracking-wider text-white">
                  {activeProduct.title || activeProduct.name}
                </h3>
                {activeProduct.description && (
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {activeProduct.description}
                  </p>
                )}
                <div className="flex items-center justify-between my-2">
                  <span className="font-black text-2xl text-[#ff2e4d] drop-shadow-[0_0_12px_rgba(255,31,61,0.5)]">
                    {Number(activeProduct.price).toLocaleString("en-US")} {isRTL ? "ج.م" : "EGP"}
                  </span>
                  {activeProduct.rating && (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{Number(activeProduct.rating).toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={() => navigate(`/product/${activeProduct.id}`)}
                    className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{isRTL ? "التفاصيل الكاملة" : "VIEW DETAILS"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isMask) {
                        setIsMaskModalOpen(true);
                      } else {
                        setIsQuickViewOpen(true);
                      }
                    }}
                    className="py-3 rounded-xl bg-white text-black hover:bg-white/90 font-black text-xs uppercase tracking-wider shadow-lg border border-white transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isInCart ? (isRTL ? "في السلة" : "IN CART") : (isRTL ? "أضف للسلة" : "ADD TO CART")}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals for Cart flow */}
      {activeProduct && isMask && (
        <MaskDimensionsModal
          isOpen={isMaskModalOpen}
          onClose={() => setIsMaskModalOpen(false)}
          product={activeProduct}
        />
      )}

      {activeProduct && isQuickViewOpen && (
        <QuickViewModal
          product={activeProduct}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </motion.div>
  );
}

export default ThreeDPhotoCarousel;
