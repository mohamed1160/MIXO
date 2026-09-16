import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';

export default function DeliveryMethodCard({ method, isSelected, onSelect, governorateRate = 50, isFreeShipping = false }) {
  const { isRTL } = useLanguage();

  const calculatedPrice = isFreeShipping ? 0 : governorateRate;

  const methodName = isRTL
    ? (method.nameAr || 'الشحن القياسي لجميع المحافظات')
    : (method.name || 'Standard Shipping');

  const methodDesc = isRTL
    ? (method.descriptionAr || 'التوصيل وسرعة التجهيز خلال 2-4 أيام عمل')
    : (method.descriptionEn || method.description || 'Delivered in 2-4 business days');

  const estimatedText = isRTL
    ? (method.estimatedDaysAr || 'خلال 2 - 4 أيام عمل')
    : (method.estimatedDays || '2 - 4 business days');

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(method._id)}
      className={`relative w-full rounded-2xl border p-5 cursor-pointer transition-all duration-300 flex items-center justify-between font-sans ${
        isSelected
          ? 'border-[#FF1F3D] bg-red-50/50 dark:bg-[#16202E] shadow-lg shadow-[#FF1F3D]/10 ring-1 ring-[#FF1F3D]'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121923] hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-[#16202E]/60'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Radio Indicator */}
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          isSelected ? 'border-[#FF1F3D] bg-[#FF1F3D]' : 'border-gray-300 dark:border-gray-600'
        }`}>
          {isSelected && <CheckCircle2 size={14} className="text-white" />}
        </div>

        {/* Method Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isSelected ? 'bg-[#FF1F3D]/20 text-[#FF1F3D]' : 'bg-gray-100 dark:bg-[#1A2332] text-gray-600 dark:text-gray-400'
        }`}>
          <Truck size={20} />
        </div>

        {/* Method Text */}
        <div>
          <span className="font-bold text-sm text-gray-900 dark:text-white block">
            {methodName}
          </span>
          <span className="text-xs font-semibold text-[#FF1F3D] dark:text-red-400 block mt-0.5">{estimatedText}</span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">{methodDesc}</span>
        </div>
      </div>

      {/* Price Display */}
      <div className={isRTL ? "text-right shrink-0 mr-3" : "text-left shrink-0 ml-3"}>
        {calculatedPrice === 0 ? (
          <div>
            <span className="text-sm font-extrabold text-green-600 dark:text-green-400">{isRTL ? "مجـاناً" : "FREE"}</span>
            <span className="text-xs line-through text-gray-400 dark:text-gray-500 block">{governorateRate} {isRTL ? "ج.م" : "EGP"}</span>
          </div>
        ) : (
          <div>
            <span className="text-base font-extrabold text-[#FF1F3D]">{calculatedPrice} {isRTL ? "ج.م" : "EGP"}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block">{isRTL ? "حسب المحافظة" : "Governorate Rate"}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
