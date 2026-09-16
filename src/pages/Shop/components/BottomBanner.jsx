import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../../providers/LanguageContext";
import customVaseImg from "../../../assets/images/3dprint/custom_vase.jpg";

export default function BottomBanner({ onOpenCustomModal }) {
  const { isRTL } = useLanguage();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
      <div className="rounded-2xl sm:rounded-3xl bg-[#0F151D] text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-slate-800 dark:border-[#1E2630] relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-2 sm:space-y-3 z-10">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FF1F3D]">
              BIGGER IDEAS
            </span>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
              {isRTL ? "طباعة 3D مخصصة لك خصيصاً" : "Custom 3D Printing Just for You"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 dark:text-[#AAB4C0] max-w-md leading-relaxed">
              {isRTL
                ? "أرسل لنا تصميمك أو فكرتك، وسنقوم بتحويلها إلى واقع بدقة وجودة عالية."
                : "Send us your design or idea, and we'll bring it to life with precision and quality."}
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenCustomModal}
                className="bg-[#FF1F3D] hover:bg-[#E01833] text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md shadow-red-600/20 flex items-center gap-2"
              >
                <span>{isRTL ? "طلب تصميم خاص" : "Customize Order"}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <div className="aspect-16/9 md:aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800 dark:border-[#1E2630] shadow-inner">
              <img
                src={customVaseImg}
                alt="Custom 3D Printing Vase"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
