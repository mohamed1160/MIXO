import React from 'react';
import { Layers, Box, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';
import { useSEO } from '../../hooks/useSEO';

export default function SizeGuidePage() {
  const { isRTL } = useLanguage();

  // ── SEO ──
  useSEO();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B10] text-gray-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20 text-xs font-extrabold uppercase tracking-wider">
            <Box size={14} />
            {isRTL ? 'دليل أحجام ومقاييس الطباعة 3D' : '3D Print Scale & Size Guide'}
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {isRTL ? 'اختيار مقاس المجسم المناسب' : 'How to Choose Your Model Scale'}
          </h1>

          <p className="text-xs text-gray-600 dark:text-[#AAB4C0] max-w-lg mx-auto leading-relaxed">
            {isRTL
              ? 'دليل تبسيطي لفهم أبعاد ومقاييس الطباعة ثلاثية الأبعاد ونسبة التعبئة (Infill) لضمان النتيجة المثالية.'
              : 'A quick guide to understanding 3D printing scale percentages, volume & infill density.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-200 dark:border-[#1E2630] space-y-3">
            <span className="px-3 py-1 bg-red-500/10 text-[#FF1F3D] rounded-full text-xs font-bold">
              75% (Compact)
            </span>
            <h3 className="text-sm font-bold">{isRTL ? 'المقاس المدمج / الصغير' : 'Compact Desk Size'}</h3>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96] leading-relaxed">
              {isRTL ? 'مثالي للمكتب أو الميداليات ومقتنيات الرفوف الصغيرة (ارتفاع حولي 8-12 سم).' : 'Ideal for desk shelves & small collectibles (8-12 cm height).'}`
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-[#FF1F3D] shadow-lg shadow-red-600/10 space-y-3">
            <span className="px-3 py-1 bg-[#FF1F3D] text-white rounded-full text-xs font-bold">
              100% (Standard)
            </span>
            <h3 className="text-sm font-bold">{isRTL ? 'المقاس القياسي الأساسي' : 'Standard Full Scale'}</h3>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96] leading-relaxed">
              {isRTL ? 'الحجم الأصلي المصمم به المجسم (ارتفاع من 15-22 سم) مع أعلى درجات التفاصيل.' : 'The original designed scale (15-22 cm height) with balanced detail.'}`
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-200 dark:border-[#1E2630] space-y-3">
            <span className="px-3 py-1 bg-red-500/10 text-[#FF1F3D] rounded-full text-xs font-bold">
              150% (Large)
            </span>
            <h3 className="text-sm font-bold">{isRTL ? 'المقاس الكبيرة والتأثير الفخم' : 'Extra Large Display'}</h3>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96] leading-relaxed">
              {isRTL ? 'أكبر بنسبة 50% للعرض الرئيسي في الغرفة أو الصالة (ارتفاع من 25-35 سم).' : '50% larger size for centerpiece display (25-35 cm height).'}`
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
