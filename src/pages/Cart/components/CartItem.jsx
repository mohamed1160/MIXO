import React from "react";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, Sparkles } from "lucide-react";
import { useShopStore } from "../../../store/useShopStore";
import { useLanguage } from "../../../providers/LanguageContext";

export default function CartItem({ item }) {
  const { isRTL } = useLanguage();
  const updateQuantity = useShopStore((state) => state.updateQuantity);
  const removeFromCart = useShopStore((state) => state.removeFromCart);

  const isCustom = item.type === "custom";
  const itemImage =
    item.image ||
    (item.images && item.images[0]) ||
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative flex flex-col sm:flex-row bg-white dark:bg-[#121923] rounded-2xl sm:rounded-3xl p-4 sm:p-5 gap-4 sm:gap-6 shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300"
    >
      {/* Image Thumbnail */}
      <div className="w-full sm:w-32 h-32 shrink-0 bg-gray-100 dark:bg-[#0B0F14] rounded-xl overflow-hidden relative flex items-center justify-center border border-gray-200 dark:border-gray-800">
        <img
          src={itemImage}
          alt={item.title || item.name}
          className="w-full h-full object-cover object-center"
        />
        {isCustom && (
          <span className="absolute top-2 left-2 bg-[#FF1F3D] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{isRTL ? "مخصص 3D" : "Custom 3D"}</span>
          </span>
        )}
      </div>

      {/* Item Details */}
      <div className="flex flex-col flex-1 py-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight mb-1">
              {item.title || item.name}
            </h3>

            {isCustom ? (
              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1 mt-1">
                <p>
                  <span className="font-bold text-gray-700 dark:text-gray-400">
                    {isRTL ? "الأبعاد:" : "Dimensions:"}{" "}
                  </span>
                  {item.length || item.maskHeight || '15'} × {item.width || item.circularWidth || '12'} {item.unit || "cm"}
                </p>
                {item.material && (
                  <p>
                    <span className="font-bold text-gray-700 dark:text-gray-400">
                      {isRTL ? "الخامة:" : "Material:"}{" "}
                    </span>
                    {item.material}
                  </p>
                )}
                {item.description && (
                  <p className="text-[11px] italic text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    "{item.description}"
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.category || "3D Print Product"}
              </p>
            )}
          </div>
        </div>

        {/* Controls & Price Row */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#1A2332] rounded-xl px-3 py-1.5 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
              className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors disabled:opacity-40"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
              className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Price & Remove */}
          <div className="flex items-center gap-4">
            <span className="text-base font-extrabold text-[#FF1F3D]">
              {isCustom
                ? item.priceText || (isRTL ? "في انتظار تحديد السعر" : "Pending Quote")
                : `${((item.price || 0) * item.quantity).toLocaleString()} ${isRTL ? "ج.م" : "EGP"}`}
            </span>
            <button
              onClick={() => removeFromCart(item.id, item.size, item.color)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors text-xs font-semibold"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isRTL ? "حذف" : "Remove"}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
