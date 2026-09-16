import React, { useState } from "react";
import { X, Sparkles, ShoppingBag, Check } from "lucide-react";
import { useLanguage } from "../providers/LanguageContext";
import { useShopStore } from "../store/useShopStore";

export default function MaskDimensionsModal({ isOpen, onClose, product }) {
  const { isRTL } = useLanguage();
  const addToCart = useShopStore((state) => state.addToCart);

  const [maskHeight, setMaskHeight] = useState("");
  const [circularWidth, setCircularWidth] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !product) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    const h = Number(maskHeight);
    const w = Number(circularWidth);

    if (!maskHeight || isNaN(h) || h <= 0 || h > 150) {
      setError(
        isRTL
          ? "يرجى إدخال ارتفاع الماسك بشكل صحيح (بين 0.1 و 150 سم)."
          : "Please enter a valid mask height (between 0.1 and 150 cm)."
      );
      return;
    }

    if (!circularWidth || isNaN(w) || w <= 0 || w > 150) {
      setError(
        isRTL
          ? "يرجى إدخال عرض/محيط الوجه الدائري بشكل صحيح (بين 0.1 و 150 سم)."
          : "Please enter a valid circular face width (between 0.1 and 150 cm)."
      );
      return;
    }

    setError("");

    // Create mask product item with custom dimensions
    const maskProductItem = {
      ...product,
      maskHeight: h,
      circularWidth: w,
      size: `${h}×${w} cm (Circular)`,
    };

    addToCart(maskProductItem, 1);

    alert(
      isRTL
        ? `تمت إضافة ${product.title || product.name} إلى السلة بأبعادك الخاصة (${h} × ${w} سم)!`
        : `Added ${product.title || product.name} to cart with your custom mask dimensions (${h} × ${w} cm)!`
    );

    setMaskHeight("");
    setCircularWidth("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#0F151D] text-gray-900 dark:text-[#F5F7FA] rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#1E2630] bg-gray-50/50 dark:bg-[#151C24]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF1F3D]/10 text-[#FF1F3D] flex items-center justify-center font-bold">
              🎭
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight">
                {isRTL ? "تحديد مقاسات الماسك الخاصة بك" : "Specify Your Mask Dimensions"}
              </h3>
              <p className="text-[11px] text-gray-400 dark:text-[#7F8A96]">
                {product.title || product.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#151C24] text-gray-500 hover:text-black dark:text-[#AAB4C0] dark:hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirm} className="p-5 space-y-4">
          <p className="text-xs text-gray-500 dark:text-[#AAB4C0] leading-relaxed">
            {isRTL
              ? "لضمان ملاءمة الماسك تماماً لوجهك بدون عيوب، يرجى إدخال الارتفاع والعرض الدائري للوجه بالسم:"
              : "To ensure your mask fits your face perfectly, please specify your facial height and circular width:"}
          </p>

          {/* Mask Height */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA] mb-1">
              {isRTL ? "ارتفاع الماسك (سم) *" : "Mask Height (cm) *"}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="150"
                required
                value={maskHeight}
                onChange={(e) => setMaskHeight(e.target.value)}
                placeholder={isRTL ? "مثال: 22 سم" : "e.g. 22 cm"}
                className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 px-3.5 border border-transparent dark:border-[#26313D] focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 dark:text-[#7F8A96]">
                cm
              </span>
            </div>
          </div>

          {/* Circular Width / Circumference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA] mb-1">
              {isRTL ? "عرض/محيط الوجه بشكل دائري (سم) *" : "Circular Face Width / Contour (cm) *"}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="150"
                required
                value={circularWidth}
                onChange={(e) => setCircularWidth(e.target.value)}
                placeholder={isRTL ? "مثال: 18 سم" : "e.g. 18 cm"}
                className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 px-3.5 border border-transparent dark:border-[#26313D] focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 dark:text-[#7F8A96]">
                cm
              </span>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#FF1F3D] hover:bg-[#E01833] text-white font-bold py-3 px-5 rounded-xl text-xs sm:text-sm shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isRTL ? "تأكيد وإضافة إلى السلة" : "Confirm & Add to Cart"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
