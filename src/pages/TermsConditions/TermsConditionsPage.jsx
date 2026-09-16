import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';

export default function TermsConditionsPage() {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B10] text-gray-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20 text-xs font-extrabold uppercase tracking-wider">
            <FileText size={14} />
            {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {isRTL ? 'شروط وأحكام استخدام المتجر' : 'Store Terms of Service'}
          </h1>
        </div>

        <div className="bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-gray-700 dark:text-[#AAB4C0] leading-relaxed">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">{isRTL ? '1. الأسعار والدفع:' : '1. Pricing & Payment:'}</h2>
          <p>
            {isRTL
              ? 'جميع الأسعار المعروضة بالجنيه المصري (EGP) وشاملة تكاليف التجهيز والطباعة عالية الدقة.'
              : 'All prices are listed in Egyptian Pounds (EGP) including precision print processing.'}
          </p>

          <h2 className="text-sm font-bold text-gray-900 dark:text-white pt-2">{isRTL ? '2. ملكية التصاميم:' : '2. Intellectual Property:'}</h2>
          <p>
            {isRTL
              ? 'جميع تصاميم ومجسمات Mixo 3D محمية بموجب حقوق الملكية الفكرية، ولا يجوز إعادة نسخها أو توزيعها تجارياً بدون ترخيص.'
              : 'All Mixo 3D designs are protected under intellectual property rights and may not be reproduced commercially without license.'}
          </p>
        </div>
      </div>
    </div>
  );
}
