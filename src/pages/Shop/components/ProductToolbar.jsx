import React from "react";
import { SlidersHorizontal, Sparkles, LayoutGrid, List } from "lucide-react";
import { useShopStore } from "../../../store/useShopStore";
import { useLanguage } from "../../../providers/LanguageContext";
import CustomDesignButton from "../../../components/CustomDesignButton";

export default function ProductToolbar({
  totalProducts,
  currentPage,
  limit,
  onOpenCustomModal,
}) {
  const { isRTL } = useLanguage();
  const setDrawerOpen = useShopStore((state) => state.setDrawerOpen);
  const sort = useShopStore((state) => state.sort);
  const setSort = useShopStore((state) => state.setSort);

  const start = totalProducts === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalProducts);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      {/* Top Header Row with Title, Count, Customize Button, and Sort/Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#1E2630]">
        
        {/* Title & Product Count */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-[#F5F7FA]">
            {isRTL ? "جميع المنتجات" : "All Products"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-[#AAB4C0] mt-0.5">
            {totalProducts === 0
              ? isRTL ? "عرض 0 منتجات" : "Showing 0 products"
              : isRTL
              ? `عرض ${start}–${end} من إجمالي ${totalProducts} منتج`
              : `Showing ${start}–${end} of ${totalProducts} products`}
          </p>
        </div>

        {/* Action Controls: Customize Button, Filter, Sort */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Prominent "Customize Your Design" CTA Button */}
          <CustomDesignButton onClick={onOpenCustomModal} />

          {/* Filter Drawer Button (Mobile/Tablet) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-100 dark:bg-[#151C24] border border-gray-200 dark:border-[#26313D] text-gray-800 dark:text-[#F5F7FA] rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-200 dark:hover:bg-[#1C2530] transition-colors min-h-[44px]"
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isRTL ? "الفلاتر" : "Filters"}</span>
          </button>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-100 dark:bg-[#151C24] border border-gray-200 dark:border-[#26313D] text-gray-800 dark:text-[#F5F7FA] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none min-h-[44px]"
          >
            <option value="Featured">{isRTL ? "الأكثر شعبية" : "Most Popular"}</option>
            <option value="Newest">{isRTL ? "الأحدث" : "Newest"}</option>
            <option value="PriceLowHigh">{isRTL ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
            <option value="PriceHighLow">{isRTL ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
            <option value="Rating">{isRTL ? "الأعلى تقييماً" : "Highest Rated"}</option>
          </select>

        </div>
      </div>
    </div>
  );
}
