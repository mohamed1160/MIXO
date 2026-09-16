import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopStore } from "../../../store/useShopStore";
import { useLanguage } from "../../../providers/LanguageContext";

export default function Pagination({ totalPages }) {
  const { isRTL } = useLanguage();
  const currentPage = useShopStore((state) => state.page);
  const setPage = useShopStore((state) => state.setPage);

  const effectiveTotalPages = totalPages || 21;

  const getPageNumbers = () => {
    const pages = [];
    if (effectiveTotalPages <= 5) {
      for (let i = 1; i <= effectiveTotalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, "...", effectiveTotalPages);
      } else if (currentPage >= effectiveTotalPages - 2) {
        pages.push(1, "...", effectiveTotalPages - 4, effectiveTotalPages - 3, effectiveTotalPages - 2, effectiveTotalPages - 1, effectiveTotalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", effectiveTotalPages);
      }
    }
    return pages;
  };

  const handlePageChange = (p) => {
    if (typeof p === "number") {
      setPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-8 gap-1.5 sm:gap-2">
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-[#26313D] text-gray-700 dark:text-[#AAB4C0] hover:bg-gray-100 dark:hover:bg-[#151C24] disabled:opacity-30 transition"
        aria-label="Previous page"
      >
        {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {getPageNumbers().map((p, idx) => (
        <button
          key={idx}
          onClick={() => handlePageChange(p)}
          disabled={p === "..."}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition ${
            p === currentPage
              ? "bg-[#0F151D] dark:bg-[#FF1F3D] text-white shadow-sm"
              : p === "..."
              ? "text-gray-400 dark:text-[#7F8A96] cursor-default"
              : "text-gray-700 dark:text-[#AAB4C0] hover:bg-gray-100 dark:hover:bg-[#151C24]"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(Math.min(effectiveTotalPages, currentPage + 1))}
        disabled={currentPage === effectiveTotalPages}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-[#26313D] text-gray-700 dark:text-[#AAB4C0] hover:bg-gray-100 dark:hover:bg-[#151C24] disabled:opacity-30 transition"
        aria-label="Next page"
      >
        {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
