import React from 'react';
import { RotateCcw, ShieldAlert, CheckCircle2, HelpCircle, Phone } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';
import { useSEO } from '../../hooks/useSEO';

export default function ReturnsExchangesPage() {
  const { isRTL } = useLanguage();

  // ── SEO ──
  useSEO();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B10] text-gray-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20 text-xs font-extrabold uppercase tracking-wider">
            <RotateCcw size={14} />
            {isRTL ? 'سياسة الاستبدال والاسترجاع' : 'Returns & Exchange Policy'}
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {isRTL ? 'ضمان جودة الطباعة 100%' : '100% Quality Satisfaction Guarantee'}
          </h1>

          <p className="text-xs text-gray-600 dark:text-[#AAB4C0] max-w-lg mx-auto leading-relaxed">
            {isRTL
              ? 'نهتم برضاك الكامل عن جميع مجسماتنا ثلاثية الأبعاد ونلتزم باستبدال أي منتج متضرر خلال النقل فوراً.'
              : 'We ensure full satisfaction with all 3D printed models and replace any shipping-damaged item immediately.'}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-4 text-xs leading-relaxed text-gray-700 dark:text-[#AAB4C0]">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#FF1F3D]" />
              <span>{isRTL ? 'حالات الاستبدال والاسترجاع المقبولة:' : 'Eligible Return & Exchange Cases:'}</span>
            </h2>

            <ul className="list-disc pr-5 pl-5 space-y-2">
              <li>
                {isRTL
                  ? 'وصول المجسم تالفاً أو به عيب تصنيع في أبعاد الطباعة.'
                  : 'Item arrived damaged or with printing manufacturing defect.'}
              </li>
              <li>
                {isRTL
                  ? 'استلام منتج مختلف عن اللون أو الحجم المطلوب في الطلب.'
                  : 'Receiving a different color or scale than ordered.'}
              </li>
              <li>
                {isRTL
                  ? 'يجب الإبلاغ خلال 3 أيام من تاريخ استلام الشحنة.'
                  : 'Notification must be sent within 3 days of order delivery.'}
              </li>
            </ul>

            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-[#1E2630]">
              <ShieldAlert size={18} className="text-[#FF1F3D]" />
              <span>{isRTL ? 'الطلبات المخصصة (Custom 3D Orders):' : 'Custom 3D Orders Exception:'}</span>
            </h2>

            <p>
              {isRTL
                ? 'الطلبات المخصصة التي يتم تصميمها وطباعتها بناءً على ملحقات أو ملفات CAD خاصة بالعميل يتم مراجعتها ومعاينتها قبل الشحن، ولا يمكن استرجاعها إلا في حالة التلف الناتج عن الشحن فقط.'
                : 'Custom 3D orders manufactured specifically per CAD/STL upload are inspected prior to dispatch and eligible for replacement only if damaged during shipping.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
