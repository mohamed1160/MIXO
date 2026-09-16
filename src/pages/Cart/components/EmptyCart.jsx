import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../providers/LanguageContext";

export default function EmptyCart() {
  const { isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center min-h-[420px] w-full bg-white dark:bg-[#121923] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-8 text-center text-gray-900 dark:text-white transition-colors ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}
    >
      <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#FF1F3D]/10 rounded-full animate-pulse" />
        <ShoppingBag className="w-14 h-14 text-[#FF1F3D] relative z-10" />
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
        {isRTL ? "سلة الشراء فارغة حالياً" : "Your Shopping Bag is Empty"}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
        {isRTL 
          ? "يبدو أنك لم تضف أي منتج أو مجسم 3D للسلة بعد. استكشف كتالوج المنتجات والموديلات المميزة المتاحة."
          : "Looks like you haven't added any 3D products to your bag yet. Explore our catalog and find something unique."}
      </p>

      <Link
        to="/shop"
        className="group inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#FF1F3D] hover:bg-[#D91832] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#FF1F3D]/25"
      >
        <span>{isRTL ? "تصفح المتجر واختيار منتجات" : "Continue Shopping"}</span>
        <ArrowIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </Link>
    </motion.div>
  );
}
