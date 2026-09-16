import React from "react";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../providers/LanguageContext";

export default function CustomDesignButton({ onClick, className = "" }) {
  const { isRTL } = useLanguage();

  return (
    <button
      onClick={onClick}
      className={`bg-[#FF1F3D] hover:bg-[#E01833] text-white font-bold py-2.5 px-5 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg shadow-red-600/25 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-h-[44px] ${className}`}
      aria-label={isRTL ? "صمم طلبك" : "Customize Your Design"}
    >
      <Sparkles className="w-4.5 h-4.5 fill-current" />
      <span className="text-xs sm:text-sm tracking-wide">
        {isRTL ? "صمم طلبك (طلب مخصص)" : "Customize Your Design"}
      </span>
      {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
