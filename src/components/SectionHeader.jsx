import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../providers/LanguageContext";

export default function SectionHeader({
  title,
  subtitle,
  linkText,
  linkUrl,
  className = "",
}) {
  const { isRTL } = useLanguage();

  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3 ${className}`}>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-[#F5F7FA]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-[#AAB4C0]">
            {subtitle}
          </p>
        )}
      </div>

      {linkText && linkUrl && (
        <Link
          to={linkUrl}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#F5F7FA] hover:text-black dark:hover:text-[#FF1F3D] group self-start sm:self-auto transition-colors"
        >
          <span>{linkText}</span>
          {isRTL ? (
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          )}
        </Link>
      )}
    </div>
  );
}
