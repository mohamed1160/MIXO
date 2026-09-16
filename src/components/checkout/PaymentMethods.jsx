import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Copy, Check, Trash2, Banknote, AlertCircle, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateTotals } from '../../utils/calculateTotals';
import { useLanguage } from '../../providers/LanguageContext';

import instapayIcon from '../../assets/icons/instapay-icon.png';
import vodafoneIcon from '../../assets/icons/vodafoneCash-icon.png';
import codIcon from '../../assets/icons/cashOnDelivery-icon.png';

export default function PaymentMethods({ register, errors, watch, setValue, cart }) {
  const { isRTL } = useLanguage();
  const selectedMethod = watch("paymentMethod");
  const transferReceipt = watch("transferReceipt");

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedIPA, setCopiedIPA] = useState(false);

  const { total } = calculateTotals(cart || []);

  const adminSettings = (() => {
    try {
      const s = localStorage.getItem('MIXO_store_settings') || localStorage.getItem('MIXO_admin_settings');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const walletNumber = adminSettings?.vodafoneCashNumber || adminSettings?.paymentSettings?.vodafoneCash?.phoneNumber || "01012345678";
  const instapayIPA = adminSettings?.instapayAccount || adminSettings?.paymentSettings?.instapay?.handle || "01198765432 / mixo@instapay";

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'number') {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    } else {
      setCopiedIPA(true);
      setTimeout(() => setCopiedIPA(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert(isRTL ? 'برجاء اختيار صورة إيصال صحيحة (PNG, JPG, WEBP)' : 'Please select a valid image file (PNG, JPG, JPEG, WEBP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setValue("transferReceipt", event.target?.result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setValue("transferReceipt", "", { shouldValidate: true });
  };

  const methods = [
    {
      id: "instapay",
      label: isRTL ? "إنستا باي (InstaPay)" : "InstaPay",
      subtitle: isRTL ? "تحويل فوري مباشر عبر التطبيق" : "Instant bank & wallet transfer",
      iconImg: instapayIcon,
    },
    {
      id: "vodafone",
      label: isRTL ? "فودافون كاش (Vodafone Cash)" : "Vodafone Cash",
      subtitle: isRTL ? "تحويل كاش مباشر للمحفظة" : "Direct wallet transfer",
      iconImg: vodafoneIcon,
    },
    {
      id: "cod",
      label: isRTL ? "الدفع عند الاستلام (COD)" : "Cash on Delivery",
      subtitle: isRTL ? "الدفع نقداً لمندوب الشحن عند التسليم" : "Pay cash upon delivery",
      iconImg: codIcon,
    },
  ];

  return (
    <div className={`bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6 font-sans text-gray-900 dark:text-white transition-colors ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      <div>
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
          <CreditCard className="w-6 h-6 text-[#FF1F3D]" />
          <span>{isRTL ? "وسيلة الدفع وسداد القيمة" : "3. Payment Method"}</span>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isRTL ? "اختر طريقة الدفع المناسبة واحتفظ بإيصال التحويل" : "Select payment method and upload transfer receipt if applicable"}
        </p>
      </div>

      {/* Hidden inputs registered to react-hook-form */}
      <input type="hidden" {...register("paymentMethod")} />
      <input type="hidden" {...register("transferReceipt")} />

      {/* Payment Selection List */}
      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <div
              key={method.id}
              onClick={() => setValue("paymentMethod", method.id, { shouldValidate: true })}
              className={`relative flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'border-[#FF1F3D] bg-red-50/50 dark:bg-[#16202E] shadow-lg shadow-[#FF1F3D]/10 ring-1 ring-[#FF1F3D]' 
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121923] hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-[#16202E]/60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-[#FF1F3D] bg-[#FF1F3D]' : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {isSelected && <CheckCircle2 size={14} className="text-white" />}
                </div>

                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#1A2332] p-1.5 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <img src={method.iconImg} alt={method.label} className="w-full h-full object-contain" />
                </div>

                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                    {method.label}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {method.subtitle}
                  </span>
                </div>
              </div>

              {isSelected && (
                <span className="text-[10px] font-bold text-[#FF1F3D] uppercase tracking-wider bg-[#FF1F3D]/10 px-2.5 py-1 rounded-lg border border-[#FF1F3D]/30">
                  {isRTL ? "محدد" : "Selected"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {errors.paymentMethod && (
        <p className="text-red-500 dark:text-red-400 text-xs font-bold flex items-center gap-1">
          <AlertCircle size={14} /> {errors.paymentMethod.message}
        </p>
      )}

      {/* Transfer Details & Screenshot Upload for InstaPay / Vodafone Cash */}
      {(selectedMethod === "instapay" || selectedMethod === "vodafone") && (
        <div className="bg-gray-50 dark:bg-[#1A2332] border border-gray-200 dark:border-[#FF1F3D]/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF1F3D] animate-pulse"></span>
              {selectedMethod === "instapay" 
                ? (isRTL ? "تفاصيل تحويل إنستا باي (InstaPay)" : "InstaPay Transfer Details") 
                : (isRTL ? "تفاصيل تحويل محفظة فودافون كاش" : "Vodafone Cash Transfer Details")}
            </h3>
            <span className="text-[11px] font-bold text-amber-600 dark:text-yellow-400">{isRTL ? "تحويل مباشر" : "Direct Transfer"}</span>
          </div>

          {/* Amount to transfer */}
          <div className="bg-white dark:bg-[#121923] rounded-xl p-4 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{isRTL ? "المبلغ المطلوب تحويله تماماً:" : "Exact Required Amount:"}</p>
              <p className="text-xl font-extrabold text-[#FF1F3D]">{total.toLocaleString()} {isRTL ? "ج.م" : "EGP"}</p>
            </div>
            <span className="px-3 py-1 bg-[#FF1F3D]/10 border border-[#FF1F3D]/30 text-[#FF1F3D] text-[10px] font-bold rounded-lg">
              {isRTL ? "تثبت القيمة" : "Exact Amount"}
            </span>
          </div>

          {/* Transfer Account Number Box */}
          <div className="space-y-3">
            {selectedMethod === "vodafone" && (
              <div className="bg-white dark:bg-[#121923] p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">{isRTL ? "رقم محفظة فودافون كاش الرسمية:" : "Official Vodafone Cash Wallet Number:"}</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white font-mono tracking-wider" dir="ltr">{walletNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(walletNumber, 'number')}
                  className="flex items-center gap-1 text-xs font-bold text-[#FF1F3D] bg-[#FF1F3D]/10 hover:bg-[#FF1F3D] hover:text-white px-3 py-1.5 rounded-lg border border-[#FF1F3D]/30 transition-all"
                >
                  {copiedNumber ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedNumber ? (isRTL ? "تم النسخ" : "Copied") : (isRTL ? "نسخ الرقم" : "Copy Number")}</span>
                </button>
              </div>
            )}

            {selectedMethod === "instapay" && (
              <div className="bg-white dark:bg-[#121923] p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">{isRTL ? "عنوان أو رقم حساب إنستا باي (IPA):" : "InstaPay Account / IPA Handle:"}</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white font-mono tracking-wider" dir="ltr">{instapayIPA}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(instapayIPA, 'ipa')}
                  className="flex items-center gap-1 text-xs font-bold text-[#FF1F3D] bg-[#FF1F3D]/10 hover:bg-[#FF1F3D] hover:text-white px-3 py-1.5 rounded-lg border border-[#FF1F3D]/30 transition-all"
                >
                  {copiedIPA ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedIPA ? (isRTL ? "تم النسخ" : "Copied") : (isRTL ? "نسخ الحساب" : "Copy Account")}</span>
                </button>
              </div>
            )}
          </div>

          {/* Receipt Screenshot Upload Section */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-gray-900 dark:text-white">
              {isRTL ? "إرفاق صورة أو سكرين شوت إيصال التحويل *" : "Attach Payment Receipt Screenshot *"}
            </label>

            {!transferReceipt ? (
              <label className="border-2 border-dashed border-[#FF1F3D]/40 hover:border-[#FF1F3D] bg-white dark:bg-[#121923] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-[#FF1F3D]/10 text-[#FF1F3D] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud size={22} />
                </div>
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                  {isRTL ? "اضغط هنا لرفع إيصال التحويل أو اسحب الصورة هنا" : "Click to upload transfer receipt or drag image here"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {isRTL ? "(الصورة المقبولة: PNG, JPG, JPEG, WEBP)" : "(Accepted formats: PNG, JPG, JPEG, WEBP)"}
                </p>
              </label>
            ) : (
              <div className="bg-white dark:bg-[#121923] border border-green-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={transferReceipt}
                    alt="Receipt Preview"
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-xs">
                      <CheckCircle2 size={16} />
                      <span>{isRTL ? "تم إرفاق إيصال التحويل بنجاح" : "Transfer receipt attached successfully"}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {isRTL ? "سيتم مراجعته وتأكيد شحنتك فوراً" : "Receipt will be reviewed and order confirmed"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveReceipt}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-500/30 transition-all"
                >
                  <Trash2 size={14} />
                  <span>{isRTL ? "حذف" : "Remove"}</span>
                </button>
              </div>
            )}

            {errors.transferReceipt && (
              <p className="text-red-500 dark:text-red-400 text-xs font-bold flex items-center gap-1 mt-1">
                <AlertCircle size={14} /> {errors.transferReceipt.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Cash on Delivery Notice */}
      {selectedMethod === "cod" && (
        <div className="bg-gray-50 dark:bg-[#1A2332] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-start gap-3">
          <Banknote className="text-amber-500 dark:text-yellow-400 mt-0.5 shrink-0" size={20} />
          <div className="text-xs">
            <p className="font-bold text-gray-900 dark:text-white mb-0.5">
              {isRTL ? "الدفع نقداً عند استلام الشحنة (Cash on Delivery)" : "Cash on Delivery (COD)"}
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isRTL 
                ? "سوف تقوم بدفع المبلغ كاش لمندوب التوصيل عند تسليمك الطرد ودون الحاجة لإيصال تحويل مسبق."
                : "You will pay in cash directly to the courier upon delivery of your package."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
