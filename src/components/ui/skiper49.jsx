"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingBag, Star, Check, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useShopStore } from "../../store/useShopStore";
import { useLanguage } from "../../providers/LanguageContext";
import MaskDimensionsModal from "../MaskDimensionsModal";
import QuickViewModal from "../../pages/Shop/components/QuickViewModal";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

export function Skiper49({
  products = [],
  showPagination = true,
  showNavigation = true,
  loop = true,
  autoplay = false,
}) {
  const [activeProduct, setActiveProduct] = useState(null);
  const [isMaskModalOpen, setIsMaskModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();
  const wishlist = useShopStore((state) => state.wishlist);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const cart = useShopStore((state) => state.cart);

  if (!products || products.length === 0) return null;

  const handleProductClick = (product) => {
    setActiveProduct(product);
  };

  const handleClose = () => {
    setActiveProduct(null);
  };

  const isMask = activeProduct
    ? activeProduct.isMask ||
      (activeProduct.category || "").toLowerCase().includes("mask") ||
      (activeProduct.category || "").includes("ماسكات") ||
      (activeProduct.category || "").includes("أقنعة")
    : false;

  const isInCart = activeProduct ? cart?.some((item) => item.id === activeProduct.id) : false;

  const css = `
  .Skiper49_Swiper {
    width: 100%;
    padding-top: 20px !important;
    padding-bottom: 50px !important;
    mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
  }
  
  .Skiper49_Swiper .swiper-slide {
    width: 270px;
    height: auto;
    transition: all 0.3s ease;
  }

  @media (min-width: 640px) {
    .Skiper49_Swiper .swiper-slide {
      width: 310px;
    }
  }

  .Skiper49_Swiper .swiper-pagination-bullet {
    background-color: #ffffff !important;
    opacity: 0.4;
    width: 8px;
    height: 8px;
    transition: all 0.3s ease;
  }

  .Skiper49_Swiper .swiper-pagination-bullet-active {
    opacity: 1;
    width: 24px;
    border-radius: 4px;
    background-color: #ffffff !important;
  }
`;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 select-none"
    >
      <style>{css}</style>

      {/* Soft Side Fade Overlays */}
      <div className="absolute top-0 left-0 bottom-12 w-12 sm:w-24 bg-gradient-to-r from-white dark:from-[#07090c] via-white/50 dark:via-[#07090c]/50 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 bottom-12 w-12 sm:w-24 bg-gradient-to-l from-white dark:from-[#07090c] via-white/50 dark:via-[#07090c]/50 to-transparent pointer-events-none z-10" />

      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={loop && products.length > 2}
        autoplay={
          autoplay
            ? {
                delay: 2500,
                disableOnInteraction: false,
              }
            : false
        }
        coverflowEffect={{
          rotate: 35,
          stretch: 0,
          depth: 120,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: ".skiper-btn-next",
                prevEl: ".skiper-btn-prev",
              }
            : false
        }
        className="Skiper49_Swiper"
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {products.map((product, index) => {
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
            <SwiperSlide key={`${id}-${index}`}>
              <div
                onClick={() => handleProductClick(product)}
                style={{
                  maskImage: 'radial-gradient(circle 11px at 0% 68.5%, transparent 10.5px, black 11px), radial-gradient(circle 11px at 100% 68.5%, transparent 10.5px, black 11px)',
                  WebkitMaskImage: 'radial-gradient(circle 11px at 0% 68.5%, transparent 10.5px, black 11px), radial-gradient(circle 11px at 100% 68.5%, transparent 10.5px, black 11px)',
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'destination-in',
                }}
                className="group relative w-full bg-[#0f1219]/95 hover:bg-[#141824] border border-white/20 hover:border-white/50 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-[0_18px_45px_rgba(0,0,0,0.85)] text-white transition-all duration-300 transform overflow-hidden cursor-pointer min-h-[490px] sm:min-h-[530px]"
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

                {/* 1. TOP TICKET BOX (Larger Image Frame with Dashed Border & Corner Stars) */}
                <div className="relative flex-1 w-full min-h-[270px] sm:min-h-[300px] rounded-xl bg-[#080a0f] border-2 border-dashed border-white/20 group-hover:border-white/40 p-1 flex items-center justify-center overflow-hidden">
                  {/* Corner Stars */}
                  <span className="absolute top-2 left-2 text-[10px] text-white/40 z-10 pointer-events-none select-none">★</span>
                  <span className="absolute top-2 right-2 text-[10px] text-white/40 z-10 pointer-events-none select-none">★</span>
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/40 z-10 pointer-events-none select-none">★</span>
                  <span className="absolute bottom-2 right-2 text-[10px] text-white/40 z-10 pointer-events-none select-none">★</span>

                  {/* Primary Product Image */}
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Secondary Hover Image (if product has multiple images) */}
                  {Array.isArray(product.images) && product.images.length > 1 && (
                    <img
                      src={product.images[1]}
                      alt={`${title} - view 2`}
                      className="absolute inset-0 w-full h-full object-cover object-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"
                      loading="lazy"
                      decoding="async"
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
                    <div className="absolute top-2.5 left-2.5 bg-white text-black text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-md z-10 tracking-wider">
                      -{discountPercent}%
                    </div>
                  )}

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-10 ${
                      isFavorite
                        ? "bg-white text-black shadow-lg scale-105"
                        : "bg-black/60 text-white/80 hover:text-white hover:bg-black/90 border border-white/15"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* 2. PERFORATED TICKET WHITE DOTTED DIVIDER */}
                <div className="relative my-2.5 flex items-center justify-center px-1">
                  <svg className="w-full h-[3px]" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="1.5" x2="100%" y2="1.5" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.5" strokeDasharray="0 12" strokeLinecap="round" />
                  </svg>
                </div>

                {/* 3. BOTTOM TICKET STUB BOX (Info Box with Title, Barcode, Price & CTA) */}
                <div className="relative rounded-xl bg-[#080a0f]/80 border border-white/15 group-hover:border-white/30 p-2.5 sm:p-3 flex flex-col gap-2 text-center flex-1 justify-between">
                  <span className="absolute top-1.5 left-2 text-[8px] text-white/30 pointer-events-none select-none">★</span>
                  <span className="absolute top-1.5 right-2 text-[8px] text-white/30 pointer-events-none select-none">★</span>

                  <h3 className="font-extrabold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-gray-200 transition-colors px-1 mt-0.5">
                    {title}
                  </h3>

                  {/* Price & Barcode Row */}
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                      <span className="font-black text-sm sm:text-base text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        {price.toLocaleString("en-US")} {isRTL ? "ج.م" : "EGP"}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">
                          {originalPrice.toLocaleString("en-US")}
                        </span>
                      )}
                    </div>

                    {/* Decorative Cinema Ticket Barcode SVG */}
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
                      <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.2em] text-white/60 -mt-0.5">MIXO-TICKET-{index + 101}</span>
                    </div>
                  </div>

                  {/* VIEW 3D CTA Button (Monochrome Black & White) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                    className="w-full py-1.5 sm:py-2 rounded-xl bg-white text-black hover:bg-white/90 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-all duration-200 border border-white active:scale-95 cursor-pointer mt-0.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-black" />
                    <span>{isRTL ? "معاينة 3D" : "VIEW 3D"}</span>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          <button
            className="skiper-btn-prev absolute top-1/2 -left-2 sm:left-0 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="skiper-btn-next absolute top-1/2 -right-2 sm:right-0 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Expanded Product Modal */}
      <AnimatePresence mode="sync">
        {activeProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6"
            onClick={handleClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#0f1219] border-2 border-white/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(255,255,255,0.2)] text-white flex flex-col gap-4 overflow-hidden"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white hover:text-black text-white transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full aspect-4/3 rounded-2xl bg-[#080a0f] overflow-hidden border border-white/10 flex items-center justify-center">
                <img
                  src={activeProduct.image || (activeProduct.images && activeProduct.images[0])}
                  alt={activeProduct.title || activeProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

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
                  <span className="font-black text-2xl text-white">
                    {Number(activeProduct.price).toLocaleString("en-US")} {isRTL ? "ج.م" : "EGP"}
                  </span>
                  {activeProduct.rating && (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{Number(activeProduct.rating).toFixed(1)}</span>
                    </div>
                  )}
                </div>

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

export default Skiper49;
