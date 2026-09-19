import React, { useState, useEffect } from "react";
import { Star, RotateCcw } from "lucide-react";
import { useShopStore } from "../../../store/useShopStore";
import { useLanguage } from "../../../providers/LanguageContext";
import { getAllCategories, getCategoryCounts } from "../../../services/products";
import { getSupabaseProducts } from "../../../services/db.service";

export default function FilterSidebar() {
  const { isRTL } = useLanguage();
  const filters = useShopStore((state) => state.filters);
  const setFilter = useShopStore((state) => state.setFilter);
  const resetFilters = useShopStore((state) => state.resetFilters);

  const [categoriesList, setCategoriesList] = useState(() => getAllCategories());
  const [countsMap, setCountsMap] = useState({});

  useEffect(() => {
    let isMounted = true;
    const loadCounts = async () => {
      try {
        let prods = [];
        const supa = await getSupabaseProducts();
        if (supa && supa.length > 0) {
          prods = supa;
        } else {
          const saved = localStorage.getItem('MIXO_products');
          if (saved) {
            prods = JSON.parse(saved);
          }
        }
        if (isMounted) {
          setCategoriesList(getAllCategories());
          setCountsMap(getCategoryCounts(prods));
        }
      } catch (e) {
        console.error("Error loading category counts:", e);
      }
    };

    loadCounts();

    const handleUpdate = () => loadCounts();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('mixo_products_updated', handleUpdate);
    window.addEventListener('mixo_categories_updated', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('mixo_products_updated', handleUpdate);
      window.removeEventListener('mixo_categories_updated', handleUpdate);
    };
  }, []);

  const selectedCategories =
    Array.isArray(filters.categories) && filters.categories.length > 0
      ? filters.categories
      : filters.category && filters.category !== "All"
      ? [filters.category]
      : [];

  const inStock = filters.inStock || false;

  const handleCategoryChange = (catId) => {
    let updated;
    if (selectedCategories.includes(catId)) {
      updated = selectedCategories.filter((id) => id !== catId);
    } else {
      updated = [...selectedCategories, catId];
    }
    setFilter("categories", updated);
    setFilter("category", updated.length === 1 ? updated[0] : "All");
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block space-y-6 bg-white dark:bg-[#0F151D] p-5 rounded-2xl border border-gray-100 dark:border-[#1E2630] shadow-sm h-fit">
      
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#1E2630]">
        <h3 className="font-bold text-base text-gray-900 dark:text-[#F5F7FA]">
          {isRTL ? "الفلاتر" : "Filters"}
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-[#FF1F3D] hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{isRTL ? "إعادة ضبط" : "Clear All"}</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
          {isRTL ? "الأقسام (اختر أكثر من قسم)" : "Categories (Multi-Select)"}
        </h4>
        <div className="space-y-1 text-xs">
          {categoriesList.map((cat) => {
            const isSelected =
              selectedCategories.includes(cat.id) ||
              selectedCategories.includes(cat.defaultName);
            const count = countsMap[cat.id] || 0;

            return (
              <label
                key={cat.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryChange(cat.id);
                }}
                className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-red-500/10 text-[#FF1F3D] font-bold"
                    : "text-gray-700 dark:text-[#AAB4C0] hover:bg-gray-50 dark:hover:bg-[#151C24]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="rounded accent-[#FF1F3D]"
                  />
                  <span>{cat.defaultName}</span>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-[#7F8A96] font-normal">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pt-3 border-t border-gray-100 dark:border-[#1E2630]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
          {isRTL ? "نطاق السعر (ج.م)" : "Price Range (EGP)"}
        </h4>
        <div className="grid grid-cols-2 gap-2 items-center">
          <div>
            <label className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 block">
              {isRTL ? "من (الأدنى)" : "From (Min)"}
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => setFilter("minPrice", e.target.value ? Number(e.target.value) : 0)}
              className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-[#151C24] border border-gray-200 dark:border-[#1E2630] rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D] transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 block">
              {isRTL ? "إلى (الأقصى)" : "To (Max)"}
            </label>
            <input
              type="number"
              min="0"
              placeholder="50000"
              value={filters.maxPrice === 50000 || !filters.maxPrice ? '' : filters.maxPrice}
              onChange={(e) => setFilter("maxPrice", e.target.value ? Number(e.target.value) : 50000)}
              className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-[#151C24] border border-gray-200 dark:border-[#1E2630] rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-[#1E2630]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
          {isRTL ? "التقييم" : "Rating"}
        </h4>
        <div className="space-y-1 text-xs">
          {[4, 3, 2, 1].map((stars) => (
            <label
              key={stars}
              onClick={() => setFilter("minRating", stars)}
              className="flex items-center gap-2 py-1 text-gray-700 dark:text-[#AAB4C0] cursor-pointer hover:text-black dark:hover:text-white"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === stars}
                onChange={() => {}}
                className="accent-[#FF1F3D]"
              />
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < stars ? "fill-current" : "text-gray-300 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-500">& up</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-[#1E2630]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
          {isRTL ? "التوفر" : "Availability"}
        </h4>
        <label
          onClick={() => setFilter("inStock", !inStock)}
          className="flex items-center gap-2 text-xs text-gray-700 dark:text-[#AAB4C0] cursor-pointer"
        >
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => {}}
            className="rounded accent-[#FF1F3D]"
          />
          <span>{isRTL ? "متوفر في المخزون" : "In Stock"}</span>
        </label>
      </div>

    </aside>
  );
}
