import React from "react";
import { useLanguage } from "../../../providers/LanguageContext";
import customVaseImg from "../../../assets/images/3dprint/custom_vase.jpg";

export default function ShopHero() {
  const { isRTL } = useLanguage();

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#0F151D] text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-slate-800 dark:border-[#1E2630]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Text */}
            <div className="md:col-span-7 space-y-2 sm:space-y-3 z-10">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FF1F3D]">
                {isRTL ? "متجرنا" : "OUR SHOP"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                {isRTL ? "منتجات طباعة 3D احترافية" : "Premium 3D Printing Products"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 dark:text-[#AAB4C0] max-w-lg leading-relaxed">
                {isRTL
                  ? "اكتشف منتجات مطبوعة ثلاثية الأبعاد عالية الجودة، تصاميم مخصصة، وحلول مبتكرة لاحتياجاتك اليومية."
                  : "Discover high-quality 3D printed items, custom designs, and innovative solutions for your everyday needs."}
              </p>
            </div>

            {/* Right Image */}
            <div className="md:col-span-5 relative">
              <div className="aspect-16/9 md:aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800 dark:border-[#1E2630] shadow-inner">
                <img
                  src={customVaseImg}
                  alt="3D Printing Products Shop Hero"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
