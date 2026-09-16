import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin, Sparkles, CheckCircle2, Box } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';
import { GOVERNORATE_RATES } from '../../utils/shippingRates';

export default function ShippingDeliveryPage() {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B10] text-gray-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20 text-xs font-extrabold uppercase tracking-wider">
            <Truck size={14} />
            {isRTL ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery Policy'}
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {isRTL ? 'توصيل سريع وآمن لجميع المحافظات' : 'Fast & Safe Express Shipping'}
          </h1>

          <p className="text-xs text-gray-600 dark:text-[#AAB4C0] max-w-lg mx-auto leading-relaxed">
            {isRTL
              ? 'نحرص على تغليف مجسماتك ثلاثية الأبعاد بعناية فائقة ضد الصدمات وشحنها عبر أفضل شركات الشحن السريع في مصر.'
              : 'We carefully protect and packaging every 3D printed model against shocks and ship via express delivery across Egypt.'}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#0F151D] p-5 rounded-2xl border border-gray-200 dark:border-[#1E2630] text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#FF1F3D] flex items-center justify-center mx-auto font-bold">
              <Clock size={20} />
            </div>
            <h3 className="text-xs font-bold">{isRTL ? 'تجهيز الطباعة: 1-3 أيام' : 'Print Lead Time: 1-3 Days'}</h3>
            <p className="text-[11px] text-gray-500 dark:text-[#7F8A96] leading-relaxed">
              {isRTL ? 'يتم مراجعة وتجهيز وطباعة المجسم بعناية قبل التغليف' : 'Precision slicing, printing & finishing'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F151D] p-5 rounded-2xl border border-gray-200 dark:border-[#1E2630] text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#FF1F3D] flex items-center justify-center mx-auto font-bold">
              <Truck size={20} />
            </div>
            <h3 className="text-xs font-bold">{isRTL ? 'توصيل الشحن: 2-4 أيام' : 'Transit Time: 2-4 Days'}</h3>
            <p className="text-[11px] text-gray-500 dark:text-[#7F8A96] leading-relaxed">
              {isRTL ? 'توصيل مباشر لباب المنزل لجميع المحافظات' : 'Direct doorstep delivery across governorates'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F151D] p-5 rounded-2xl border border-gray-200 dark:border-[#1E2630] text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#FF1F3D] flex items-center justify-center mx-auto font-bold">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-xs font-bold">{isRTL ? 'تغليف مقوى ضد الكسر' : 'Anti-Shock Packaging'}</h3>
            <p className="text-[11px] text-gray-500 dark:text-[#7F8A96] leading-relaxed">
              {isRTL ? 'حماية مضاعفة بالفوم والفقاعات لكل مجسم' : 'Double bubble wrap & dense foam casing'}
            </p>
          </div>
        </div>

        {/* Governorate Rates List */}
        <div className="bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#1E2630] pb-3">
            <MapPin size={18} className="text-[#FF1F3D]" />
            <span>{isRTL ? 'تعريفة أسعار الشحن حسب المحافظة' : 'Shipping Rates by Governorate'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(GOVERNORATE_RATES).map((govKey) => {
              const gov = GOVERNORATE_RATES[govKey];
              return (
                <div
                  key={govKey}
                  className="p-3 bg-gray-50 dark:bg-[#151C24] rounded-xl border border-gray-200 dark:border-[#26313D] flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {isRTL ? gov.nameAr : gov.nameEn}
                  </span>
                  <span className="font-extrabold text-[#FF1F3D]">
                    {gov.rate} {isRTL ? 'ج.م' : 'EGP'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
