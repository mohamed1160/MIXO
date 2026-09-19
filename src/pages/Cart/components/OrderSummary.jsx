import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck, Truck, Tag, Lock, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useLanguage } from "../../../providers/LanguageContext";

export default function OrderSummary({ subtotal }) {
  const { isRTL } = useLanguage();
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const shippingLimit = 1000;
  const isFreeShipping = subtotal >= shippingLimit;
  const remainingForFree = Math.max(0, shippingLimit - subtotal);
  const progress = Math.min(100, (subtotal / shippingLimit) * 100);

  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setCouponError("");

    const codeClean = couponCode.trim().toUpperCase();

    let adminPromos = [];
    try {
      adminPromos = JSON.parse(localStorage.getItem('MIXO_admin_promos') || '[]');
    } catch (err) {
      console.error(err);
    }

    const matchedPromo = adminPromos.find(
      (p) => p.code?.toUpperCase() === codeClean && (p.status === 'Active' || p.status === 'Active / Scheduled')
    );

    if (matchedPromo) {
      let calcDiscount = 0;
      const val = parseFloat(matchedPromo.discountValue || matchedPromo.value || 10);
      const isPct = (matchedPromo.discountType || matchedPromo.type || '').toLowerCase().includes('percent');
      if (isPct) {
        calcDiscount = Math.round(subtotal * (val / 100));
      } else {
        calcDiscount = val;
      }
      setDiscountAmount(calcDiscount);
      setAppliedCode(codeClean);
      setCouponError("");
    } else if (codeClean === 'MIXO3D' || codeClean === 'MIXO20' || codeClean === 'WELCOME10') {
      const calcDiscount = codeClean === 'MIXO3D' ? Math.round(subtotal * 0.15) : (codeClean === 'MIXO20' ? Math.round(subtotal * 0.2) : 100);
      setDiscountAmount(calcDiscount);
      setAppliedCode(codeClean);
      setCouponError("");
    } else {
      setCouponError(isRTL ? "كود الخصم غير صحيح أو منتهي الصلاحية" : "Invalid or expired coupon code.");
      setDiscountAmount(0);
      setAppliedCode("");
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`sticky top-28 bg-white dark:bg-[#121923] rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col gap-5 text-gray-900 dark:text-white transition-colors ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}
    >
      <h2 className="text-base font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-[#FF1F3D]" />
        <span>{isRTL ? "ملخص الطلب والإجمالي" : "Order Summary"}</span>
      </h2>

      {/* Free Shipping Progress Indicator */}
      <div className="p-3.5 bg-gray-50 dark:bg-[#1A2332] rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
        {isFreeShipping ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-xs">
            <Truck size={16} />
            <span>{isRTL ? "تهانينا! حققت الحد الأدنى للشحن المجاني 🚚" : "You qualify for Free Shipping! 🚚"}</span>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              <span>
                {isRTL 
                  ? `أضف بقيمة ${remainingForFree} ج.م للحصول على شحن مجاني` 
                  : `Add ${remainingForFree} EGP more for Free Shipping`}
              </span>
              <span className="text-[#FF1F3D]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-[#0F151D] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FF1F3D] to-orange-500 transition-all duration-300 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Prices Breakdown */}
      <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex justify-between items-center">
          <span>{isRTL ? "مجموع المنتجات بالسلة:" : "Subtotal:"}</span>
          <span className="font-bold text-gray-900 dark:text-white">{subtotal.toLocaleString()} {isRTL ? "ج.م" : "EGP"}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-green-600 dark:text-green-400 font-bold">
            <span>{isRTL ? "الخصم المطبق:" : "Discount Applied:"}</span>
            <span>-{discountAmount.toLocaleString()} {isRTL ? "ج.م" : "EGP"}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>{isRTL ? "الشحن والتوصيل:" : "Shipping:"}</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {isFreeShipping ? (
              <span className="text-green-600 dark:text-green-400 font-bold">{isRTL ? "مجـاناً" : "FREE"}</span>
            ) : (
              isRTL ? "يحسب عند الشحن" : "Calculated at checkout"
            )}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />

      {/* Final Total */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-extrabold text-gray-900 dark:text-white">{isRTL ? "المبلغ الإجمالي:" : "Total:"}</span>
        <span className="text-2xl font-extrabold text-[#FF1F3D]">{total.toLocaleString()} {isRTL ? "ج.م" : "EGP"}</span>
      </div>

      {/* Coupon Code Input */}
      <form onSubmit={handleApplyCoupon} className="space-y-1.5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={isRTL ? "أدخل كود الخصم (MIXO3D)" : "Coupon code (MIXO3D)"}
              className="w-full h-10 pl-9 pr-3 bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white uppercase outline-none focus:border-[#FF1F3D]"
            />
          </div>
          <button 
            type="submit"
            className="px-4 h-10 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            {isRTL ? "تطبيق" : "Apply"}
          </button>
        </div>
        {couponError && <p className="text-red-500 dark:text-red-400 text-[11px] font-bold">{couponError}</p>}
        {appliedCode && (
          <p className="text-green-600 dark:text-green-400 text-[11px] font-bold">
            {isRTL ? `تم تطبيق الخصم بالكود (${appliedCode}) 🎉` : `Discount applied with code (${appliedCode}) 🎉`}
          </p>
        )}
      </form>

      {/* Checkout Button */}
      <button
        onClick={() => {
          navigate('/checkout');
        }}
        className="group w-full h-12 rounded-xl bg-[#FF1F3D] hover:bg-[#D91832] text-white flex items-center justify-center gap-2 font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#FF1F3D]/25 hover:scale-[1.01] active:scale-95"
      >
        <Lock size={15} />
        <span>{isRTL ? "الانتقال لصفحة الشراء والتأكيد" : "Proceed to Checkout"}</span>
        <ArrowIcon size={16} className="group-hover:scale-110 transition-transform" />
      </button>

      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
        <ShieldCheck className="w-4 h-4 text-[#FF1F3D]" />
        <span>{isRTL ? "عملية شراء وتأكيد آمنة 100%" : "100% Secure Checkout"}</span>
      </div>
    </motion.div>
  );
}
