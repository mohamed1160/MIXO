import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShopStore } from "../../store/useShopStore";
import { useLanguage } from "../../providers/LanguageContext";
import CartItem from "./components/CartItem";
import OrderSummary from "./components/OrderSummary";
import EmptyCart from "./components/EmptyCart";
import RecommendedProducts from "./components/RecommendedProducts";
import { useSEO } from "../../hooks/useSEO";

import cartHeroImg from "../../assets/images/3dprint/cart_hero_3d.jpg";

export default function Cart() {
  const { isRTL } = useLanguage();

  // ── SEO (noindex) ──
  useSEO({ noindex: true });

  const cart = useShopStore((state) => state.cart) || [];
  
  // Filter out any invalid items
  const validCart = cart.filter(item => item && typeof item.price === 'number');
  
  const subtotal = validCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = validCart.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-[#FAF7F2] dark:bg-[#0B0F14] text-gray-900 dark:text-white flex flex-col font-sans transition-colors ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}
    >
      {/* Hero Banner with 3D Printing Backdrop */}
      <div className="relative w-full h-[220px] sm:h-[280px] flex items-center justify-center overflow-hidden bg-gray-950">
        <img 
          src={cartHeroImg} 
          alt="Mixo 3D Cart Banner" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70 dark:opacity-55 scale-105 transition-transform duration-700 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] dark:from-[#0B0F14] via-black/40 to-black/70" />
        
        <div className="relative z-10 text-center flex flex-col items-center px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-4xl font-black text-white tracking-wider uppercase mb-3 drop-shadow-md"
          >
            {isRTL ? "سلة مشترياتك 🛒" : "Your Shopping Bag"}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#FF1F3D] text-xs sm:text-sm font-bold tracking-wide uppercase bg-[#FF1F3D]/15 border border-[#FF1F3D]/40 shadow-lg shadow-[#FF1F3D]/20 px-5 py-1.5 rounded-full backdrop-blur-md"
          >
            {isRTL 
              ? `${totalItems} ${totalItems === 1 ? 'منتج محدد للطباعة' : 'منتجات محدده للطباعة 3D'}`
              : `${totalItems} ${totalItems === 1 ? 'Piece' : 'Pieces'} Selected for 3D Print`}
          </motion.p>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {validCart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <AnimatePresence mode="popLayout">
                {validCart.map((item) => (
                  <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 relative">
              <OrderSummary subtotal={subtotal} />
            </div>
          </div>
        )}

        <RecommendedProducts />
      </main>
    </motion.div>
  );
}
