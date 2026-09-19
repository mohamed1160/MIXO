import React from 'react';
import { Sparkles, Users, Send, Box, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';
import { useSEO } from '../../hooks/useSEO';

export default function CareersPage() {
  const { isRTL } = useLanguage();

  // ── SEO ──
  useSEO();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B10] text-gray-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20 text-xs font-extrabold uppercase tracking-wider">
            <Users size={14} />
            {isRTL ? 'الوظائف والانضمام لفريق Mixo 3D' : 'Careers at Mixo 3D'}
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {isRTL ? 'اصنع مستقبل الطباعة ثلاثية الأبعاد معنا' : 'Shape the Future of 3D Printing'}
          </h1>

          <p className="text-xs text-gray-600 dark:text-[#AAB4C0] max-w-md mx-auto leading-relaxed">
            {isRTL
              ? 'نبحث دائماً عن مصممي 3D ومهندسي نمذجة متميزين للانضمام إلى استوديو Mixo 3D.'
              : 'We are always looking for talented 3D designers and CAD engineers to join Mixo 3D.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-200 dark:border-[#1E2630] space-y-3">
            <span className="px-3 py-1 bg-red-500/10 text-[#FF1F3D] rounded-full text-[10px] font-bold">
              Full-time / Remote
            </span>
            <h3 className="text-base font-bold">{isRTL ? 'مصمم مجسمات 3D (3D Character Artist)' : '3D Model & Character Artist'}</h3>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96] leading-relaxed">
              {isRTL ? 'خبرة في Blender / ZBrush لتصميم مجسمات قابلة للطباعة 3D.' : 'Expertise in Blender/ZBrush for print-ready 3D modeling.'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-200 dark:border-[#1E2630] space-y-3">
            <span className="px-3 py-1 bg-red-500/10 text-[#FF1F3D] rounded-full text-[10px] font-bold">
              Full-time / On-site
            </span>
            <h3 className="text-base font-bold">{isRTL ? 'مهندس تشغيل وفحص طابعات 3D' : '3D Printing Operations Engineer'}</h3>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96] leading-relaxed">
              {isRTL ? 'إدارة وتشغيل طابعات FDM & Resin وحساب الخامات والمعالجة.' : 'Operating FDM & Resin printer fleets and post-processing.'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#FF1F3D]/10 via-[#0F151D] to-[#FF1F3D]/5 border border-[#FF1F3D]/20 rounded-3xl p-8 text-center space-y-3">
          <h2 className="text-lg font-bold">{isRTL ? 'جاهز للانضمام؟ ارسل أعمالك' : 'Ready to Join? Send Your Portfolio'}</h2>
          <p className="text-xs text-gray-500 dark:text-[#7F8A96]">careers@mixo3d.com</p>
        </div>
      </div>
    </div>
  );
}
