import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateTotals } from '../../utils/calculateTotals';
import { calculateShippingFee } from '../../utils/shippingRates';
import { useApplyCoupon } from '../../hooks/useApplyCoupon';
import { ShieldCheck, Tag, Loader2, Truck, ShoppingBag, Sparkles } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';

export default function OrderSummary({ cart, control, register, watch, selectedMethodId }) {
  const { isRTL } = useLanguage();
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  const selectedGovernorate = watch ? watch("shipping.governorate") : "";
  const currentShippingMethod = selectedMethodId || (watch ? watch("shippingMethod") : "standard") || "standard";

  // Calculate Subtotal
  const subtotal = (cart || []).reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 1)), 0);

  // Calculate Shipping fee
  const { fee: shippingCost, originalFee, isFree, remainingForFree, limit } = calculateShippingFee(selectedGovernorate, subtotal, currentShippingMethod);

  // Calculate Final Total
  const { total } = calculateTotals(cart || [], shippingCost, discountAmount);

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

  return (
    <div className={`bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl sticky top-24 font-sans text-gray-900 dark:text-white space-y-6 transition-colors ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      <h3 className="text-base font-extrabold text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#FF1F3D]" />
          {isRTL ? "ملخص طلب الشراء" : "Order Summary"}
        </span>
        <span className="text-xs text-[#FF1F3D] font-bold">
          {isRTL ? `(${cart.length} منتجات)` : `(${cart.length} items)`}
        </span>
      </h3>

      {/* Free Shipping Progress Bar */}
      <div className="p-3.5 bg-gray-50 dark:bg-[#1A2332] rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
        {isFree ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-xs">
            <Truck size={16} />
            <span>{isRTL ? "تهانينا! الشحن مجاني لطلبك 🚚" : "Congratulations! Free shipping activated 🚚"}</span>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              <span>
                {isRTL 
                  ? `أضف بقيمة ${remainingForFree} ج.م للحصول على شحن مجاني`
                  : `Add ${remainingForFree} EGP more for free shipping`}
              </span>
              <span className="text-[#FF1F3D]">{Math.min(100, Math.round((subtotal / limit) * 100))}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-[#0F151D] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FF1F3D] to-orange-500 transition-all duration-300 rounded-full" 
                style={{ width: `${Math.min(100, (subtotal / limit) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cart Items List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {cart.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 p-2.5 bg-gray-50 dark:bg-[#1A2332] rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-[#121923] overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                <img
                  src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&auto=format&fit=crop&q=80'}
                  alt={item.name || item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{item.name || item.title}</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {isRTL ? "الكمية:" : "Qty:"} <span className="text-gray-900 dark:text-white font-mono">{item.quantity || 1}</span>
                  {item.material && ` • ${item.material}`}
                </p>
              </div>
            </div>

            <div className="font-extrabold text-xs text-[#FF1F3D] shrink-0">
              {((item.price || 0) * (item.quantity || 1)).toLocaleString()} {isRTL ? "ج.م" : "EGP"}
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Form */}
      <form onSubmit={handleApplyCoupon} className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
          {isRTL ? "كود الخصم / القسيمة:" : "Promo / Coupon Code:"}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={isRTL ? "مثال: MIXO3D" : "e.g. MIXO3D"}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white uppercase placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#FF1F3D]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-bold rounded-xl text-xs transition-all shadow-md"
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

      {/* Subtotal, Shipping, Discount & Final Total */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2.5 text-xs">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{isRTL ? "مجموع المنتجات:" : "Subtotal:"}</span>
          <span className="font-bold text-gray-900 dark:text-white">{subtotal.toLocaleString()} {isRTL ? "ج.م" : "EGP"}</span>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{isRTL ? "مصاريف الشحن:" : "Shipping Fee:"}</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {isFree ? (
              <span className="text-green-600 dark:text-green-400">{isRTL ? "مجـاناً" : "FREE"}</span>
            ) : (
              `${shippingCost} ${isRTL ? "ج.م" : "EGP"}`
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
            <span>{isRTL ? "الخصم المطبق:" : "Discount Applied:"}</span>
            <span>-{discountAmount.toLocaleString()} {isRTL ? "ج.م" : "EGP"}</span>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <span className="font-bold text-gray-900 dark:text-white text-sm">{isRTL ? "المبلغ الإجمالي النهائي:" : "Total Amount:"}</span>
          <span className="text-xl font-extrabold text-[#FF1F3D]">
            {total.toLocaleString()} {isRTL ? "ج.م" : "EGP"}
          </span>
        </div>
      </div>

      <div className="p-3 bg-gray-50 dark:bg-[#1A2332] rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#FF1F3D] shrink-0" />
        <span>
          {isRTL 
            ? "دفع آمن 100% مع مراجعة ومتابعة من فريق Mixo 3D."
            : "100% Secure Checkout with Mixo 3D team review."}
        </span>
      </div>
    </div>
  );
}
