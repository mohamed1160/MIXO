import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';
import { useSEO } from '../../hooks/useSEO';

export default function PrivacyPolicyPage() {
  const { isRTL } = useLanguage();

  // ── SEO ──
  useSEO();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B10] text-gray-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20 text-xs font-extrabold uppercase tracking-wider">
            <Lock size={14} />
            {isRTL ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy'}
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {isRTL ? 'حماية خصوصيتك أولوية مطلقة' : 'Your Privacy is Our Priority'}
          </h1>
        </div>

        <div className="bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-gray-700 dark:text-[#AAB4C0] leading-relaxed">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">{isRTL ? '1. جمع البيانات واستخدامها:' : '1. Data Collection & Usage:'}</h2>
          <p>
            {isRTL
              ? 'نحن في Mixo 3D نجمع فقط البيانات الضرورية لتنفيذ وتوصيل طلباتك (مثل الاسم، رقم الهاتف، والعنوان). لا نشارك بياناتك مطلقاً مع أي طرف ثالث خارج إطار توصيل الشحنة.'
              : 'At Mixo 3D, we only collect data required for fulfilling and shipping your orders (name, phone, address). We never share data with third parties outside shipping partners.'}
          </p>

          <h2 className="text-sm font-bold text-gray-900 dark:text-white pt-2">{isRTL ? '2. حماية ملحقات النماذج 3D (CAD/STL):' : '2. Protection of 3D Models & Files (CAD/STL):'}</h2>
          <p>
            {isRTL
              ? 'الملفات والنماذج الخاصة التي ترفعها لطلب طباعة مخصصة تكون محمية بسرية تامة وتُحذف بعد إنهاء وطباعة الطلب، ولا تُستخدم في أي أغراض أخرى بدون موافقتك الصريحة.'
              : 'Files uploaded for custom 3D orders are kept strictly confidential and deleted post fulfillment, never reused without your explicit authorization.'}
          </p>
        </div>
      </div>
    </div>
  );
}
