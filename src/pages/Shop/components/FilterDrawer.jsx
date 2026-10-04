import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Star, Check } from "lucide-react";
import { useShopStore } from "../../../store/useShopStore";
import { useLanguage } from "../../../providers/LanguageContext";
import { getAllCategories, getCategoryCounts } from "../../../services/products";
import { getSupabaseProducts } from "../../../services/db.service";

export default function FilterDrawer() {
  const { isRTL } = useLanguage();
  const isDrawerOpen = useShopStore((state) => state.isDrawerOpen);
  const setDrawerOpen = useShopStore((state) => state.setDrawerOpen);
  const filters = useShopStore((state) => state.filters);
  const setFilters = useShopStore((state) => state.setFilters);
  const resetFilters = useShopStore((state) => state.resetFilters);

  const [localFilters, setLocalFilters] = useState(filters);
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
        console.error("Error loading category counts in drawer:", e);
      }
    };

    if (isDrawerOpen) {
      loadCounts();
    }
    return () => {
      isMounted = false;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isDrawerOpen]);

  const handleApply = () => {
    setFilters(localFilters);
    setDrawerOpen(false);
  };

  const handleClear = () => {
    resetFilters();
    setDrawerOpen(false);
  };

  const localCategories =
    Array.isArray(localFilters.categories) && localFilters.categories.length > 0
      ? localFilters.categories
      : localFilters.category && localFilters.category !== "All"
      ? [localFilters.category]
      : [];

  const handleCategoryToggle = (catId) => {
    let updated;
    if (localCategories.includes(catId)) {
      updated = localCategories.filter((id) => id !== catId);
    } else {
      updated = [...localCategories, catId];
    }
    setLocalFilters({
      ...localFilters,
      categories: updated,
      category: updated.length === 1 ? updated[0] : "All",
    });
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className={`fixed top-0 bottom-0 ${
              isRTL ? "left-0" : "right-0"
            } w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#0F151D] text-gray-900 dark:text-[#F5F7FA] z-50 shadow-2xl flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#1E2630] bg-gray-50/50 dark:bg-[#151C24]/50">
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
                {isRTL ? "فلاتر الشوب" : "Shop Filters"}
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-gray-400 hover:text-black dark:hover:text-white rounded-full transition-colors"
                aria-label="Close filters drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Categories Tag Chips */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "الأقسام" : "Categories"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoriesList.map((cat) => {
                    const isSelected =
                      localCategories.includes(cat.id) ||
                      localCategories.includes(cat.defaultName);
                    const count = countsMap[cat.id] || 0;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-gray-900 dark:border-white shadow-sm font-bold"
                            : "bg-gray-100/80 dark:bg-[#151C24] text-gray-700 dark:text-[#AAB4C0] hover:bg-gray-200/80 dark:hover:bg-[#1E2630] border-transparent"
                        }`}
                      >
                        <span>{isRTL ? cat.arName : cat.defaultName}</span>
                        {isSelected ? (
                          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white/20 dark:bg-black/20 text-current ml-0.5">
                            ✕
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">
                            ({count})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-[#1E2630]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "نطاق السعر (ج.م)" : "Price Range (EGP)"}
                </h3>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 block">
                      {isRTL ? "من (الأدنى)" : "From (Min)"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={localFilters.minPrice || ''}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          minPrice: e.target.value ? Number(e.target.value) : 0,
                        })
                      }
                      className="w-full px-2.5 py-2 bg-gray-50 dark:bg-[#151C24] border border-gray-200 dark:border-[#1E2630] rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D] transition-colors"
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
                      value={localFilters.maxPrice === 50000 || !localFilters.maxPrice ? '' : localFilters.maxPrice}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          maxPrice: e.target.value ? Number(e.target.value) : 50000,
                        })
                      }
                      className="w-full px-2.5 py-2 bg-gray-50 dark:bg-[#151C24] border border-gray-200 dark:border-[#1E2630] rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* In Stock Only */}
              <div className="pt-3 border-t border-gray-100 dark:border-[#1E2630]">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-gray-800 dark:text-[#F5F7FA]">
                  <input
                    type="checkbox"
                    checked={localFilters.inStock}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        inStock: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded accent-[#FF1F3D]"
                  />
                  <span>{isRTL ? "المنتجات المتوفرة فقط" : "In Stock Items Only"}</span>
                </label>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-gray-100 dark:border-[#1E2630] flex gap-3 bg-gray-50 dark:bg-[#151C24]">
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 border border-gray-300 dark:border-[#26313D] text-gray-700 dark:text-[#AAB4C0] hover:bg-white dark:hover:bg-[#1C2530] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRTL ? "إعادة ضبط" : "Clear All"}</span>
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2.5 bg-[#FF1F3D] hover:bg-[#E01833] text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all"
              >
                {isRTL ? "تطبيق الفلاتر" : "Apply Filters"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
