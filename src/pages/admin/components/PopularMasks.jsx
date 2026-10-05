import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  GripVertical
} from "lucide-react";
import { useLanguage } from "../../../providers/LanguageContext";
import { getSupabaseProducts, getPopularMasksOrder, savePopularMasksOrder } from "../../../services/db.service";

export default function PopularMasks() {
  const { isRTL } = useLanguage();
  const [allProducts, setAllProducts] = useState([]);
  const [selectedMaskIds, setSelectedMaskIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Load products & saved order
  useEffect(() => {
    loadProductsAndOrder();
  }, []);

  const loadProductsAndOrder = async () => {
    setIsLoading(true);
    let loadedProducts = [];

    try {
      const supaProducts = await getSupabaseProducts();
      if (supaProducts && supaProducts.length > 0) {
        loadedProducts = supaProducts;
      } else {
        const saved = localStorage.getItem("MIXO_products");
        if (saved) {
          loadedProducts = JSON.parse(saved);
        }
      }
    } catch (e) {
      console.warn("Failed to load Supabase products in PopularMasks admin:", e);
      const saved = localStorage.getItem("MIXO_products");
      if (saved) {
        try { loadedProducts = JSON.parse(saved); } catch (err) {}
      }
    }

    setAllProducts(loadedProducts);

    // Load saved custom popular masks order from Supabase / localStorage fallback
    try {
      const savedOrder = await getPopularMasksOrder();
      if (savedOrder && Array.isArray(savedOrder) && savedOrder.length > 0) {
        setSelectedMaskIds(savedOrder.map(String));
      } else {
        // Default: select all mask products
        const isMask = (p) => {
          const catRaw = String(p.category || "").toLowerCase();
          return p.isMask || catRaw.includes("mask") || catRaw.includes("أقنعة") || catRaw.includes("ماسكات");
        };
        const defaultMaskIds = loadedProducts.filter(isMask).slice(0, 8).map((p) => String(p.id));
        setSelectedMaskIds(defaultMaskIds);
      }
    } catch (err) {
      console.error("Error loading saved popular masks order:", err);
    }

    setIsLoading(false);
  };


  // Helper to check if a product is a mask
  const isMaskProduct = (p) => {
    const catRaw = String(p.category || "").toLowerCase();
    return p.isMask || catRaw.includes("mask") || catRaw.includes("أقنعة") || catRaw.includes("ماسكات");
  };

  // Map of products by ID
  const productMap = new Map(allProducts.map((p) => [String(p.id), p]));

  // Ordered list of selected masks
  const selectedMasks = selectedMaskIds
    .map((id) => productMap.get(String(id)))
    .filter(Boolean);

  // Available masks to add
  const availableMasks = allProducts.filter((p) => {
    const isAlreadySelected = selectedMaskIds.includes(String(p.id));
    if (isAlreadySelected) return false;

    // Filter by search query if provided
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = String(p.title || p.name || "").toLowerCase();
      const cat = String(p.category || "").toLowerCase();
      return title.includes(q) || cat.includes(q);
    }

    return isMaskProduct(p);
  });

  // Handle Drag & Drop reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...selectedMaskIds];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setSelectedMaskIds(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle button reordering (Up / Down)
  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...selectedMaskIds];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setSelectedMaskIds(updated);
  };

  const moveDown = (index) => {
    if (index === selectedMaskIds.length - 1) return;
    const updated = [...selectedMaskIds];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setSelectedMaskIds(updated);
  };

  const removeMask = (id) => {
    setSelectedMaskIds(selectedMaskIds.filter((item) => String(item) !== String(id)));
  };

  const addMask = (id) => {
    const strId = String(id);
    if (!selectedMaskIds.includes(strId)) {
      setSelectedMaskIds([...selectedMaskIds, strId]);
    }
  };

  // Save changes
  const handleSave = async () => {
    await savePopularMasksOrder(selectedMaskIds);

    setIsSaved(true);
    setSaveMessage(isRTL ? "تم حفظ ترتيب الماسكات بالسيرفر (Supabase) وسيظهر على جميع الأجهزة!" : "Popular masks order saved to database successfully!");

    setTimeout(() => {
      setIsSaved(false);
      setSaveMessage("");
    }, 3500);
  };

  // Reset to default
  const handleReset = async () => {
    const defaultMaskIds = allProducts.filter(isMaskProduct).slice(0, 8).map((p) => String(p.id));
    setSelectedMaskIds(defaultMaskIds);
    await savePopularMasksOrder(defaultMaskIds);
  };


  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-400 font-sans">
        <div className="w-8 h-8 border-4 border-[#FF1F3D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>{isRTL ? "جاري تحميل أقنعة المتجر..." : "Loading store masks..."}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans text-gray-900 dark:text-white">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] p-6 rounded-2xl shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF1F3D]/10 border border-[#FF1F3D]/20 flex items-center justify-center text-[#FF1F3D] shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isRTL ? "ترتيب أقنعة الهيرو (Popular Masks)" : "Hero Popular Masks Order"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#FF1F3D] shrink-0" />
              <span>
                {isRTL
                  ? "يمكنك سحب وإفلات العناصر بالماوس 🖐️ أو استخدام الأسهم ⬆️ ⬇️ للتحكم في الترتيب."
                  : "Drag and drop items with mouse 🖐️ or use ⬆️ ⬇️ arrows to reorder."}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-transparent rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            title={isRTL ? "استعادة الترتيب التلقائي" : "Reset to default"}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isRTL ? "إعادة ضبط" : "Reset"}</span>
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#FF1F3D] hover:bg-[#e01833] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 active:scale-95 transition"
          >
            <Save className="w-4 h-4" />
            <span>{isRTL ? "حفظ التغييرات" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert Notification */}
      {isSaved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-3 animate-fade-in">
          <Check className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Dual Grid Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Main Column: Active Ordered Masks */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm dark:shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1E2630] pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{isRTL ? "الماسكات المختارة والترتيب" : "Active Masks & Display Order"}</span>
                <span className="bg-[#FF1F3D] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {selectedMasks.length}
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isRTL
                  ? "اسحب القناع بالماوس من المقبض ☰ أو استخدم الأسهم ⬆️ ⬇️ لتغيير الموضع."
                  : "Drag item using ☰ handle or use ⬆️ ⬇️ arrows to change position."}
              </p>
            </div>
          </div>

          {selectedMasks.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400">
              <p>{isRTL ? "لم تقم باختيار أي ماسك بعد! اختر من القائمة على اليمين." : "No masks selected yet! Pick masks from the right column."}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedMasks.map((product, idx) => (
                <div
                  key={product.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#151C24] hover:bg-slate-100 dark:hover:bg-[#1C2530] border p-3 sm:p-4 rounded-xl transition cursor-grab active:cursor-grabbing group ${
                    draggedIndex === idx
                      ? "opacity-40 border-dashed border-[#FF1F3D] scale-95"
                      : dragOverIndex === idx
                      ? "border-[#FF1F3D] bg-red-500/10 scale-[1.01]"
                      : "border-gray-200 dark:border-[#26313D]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="text-gray-400 dark:text-gray-500 group-hover:text-[#FF1F3D] transition-colors shrink-0 cursor-grab" title={isRTL ? "اسحب لإعادة الترتيب" : "Drag to reorder"}>
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <span className="w-7 h-7 bg-red-100 dark:bg-black/40 text-[#FF1F3D] border border-red-200 dark:border-[#FF1F3D]/30 rounded-lg text-xs font-black flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <img
                      src={product.image || product.images?.[0]}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-gray-800 shrink-0 pointer-events-none"
                    />
                    <div className="min-w-0 select-none">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                        {product.title || product.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                        <span className="text-[#FF1F3D] font-bold">{product.price} ج.م</span>
                        <span>•</span>
                        <span className="truncate">{product.category || "Mask"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-30 text-gray-800 dark:text-white rounded-lg transition border border-gray-300 dark:border-transparent"
                      title={isRTL ? "تحريك لأعلى" : "Move Up"}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === selectedMasks.length - 1}
                      className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-30 text-gray-800 dark:text-white rounded-lg transition border border-gray-300 dark:border-transparent"
                      title={isRTL ? "تحريك لأسفل" : "Move Down"}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeMask(product.id)}
                      className="p-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-transparent rounded-lg transition"
                      title={isRTL ? "حذف من القائمة" : "Remove"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Available Masks / Products to Add */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm dark:shadow-xl">
          <div className="border-b border-gray-100 dark:border-[#1E2630] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {isRTL ? "إضافة ماسك للقائمة" : "Available Masks"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isRTL ? "ابحث واختر الماسكات التي تريد إضافتها للعرض." : "Search & add available mask products to the active list."}
            </p>

            {/* Search Input */}
            <div className="relative mt-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? "بحث عن ماسك..." : "Search mask..."}
                className="w-full bg-slate-100 dark:bg-[#151C24] border border-gray-200 dark:border-[#26313D] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl text-xs pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#FF1F3D]"
              />
            </div>
          </div>

          {availableMasks.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              {isRTL ? "لا يوجد ماسكات إضافية متوفرة" : "No available masks found"}
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {availableMasks.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#151C24] hover:bg-slate-100 dark:hover:bg-[#1C2530] border border-gray-200 dark:border-[#26313D] p-3 rounded-xl transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image || product.images?.[0]}
                      alt={product.title}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-gray-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {product.title || product.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{product.price} ج.م</p>
                    </div>
                  </div>

                  <button
                    onClick={() => addMask(product.id)}
                    className="px-3 py-1.5 bg-[#FF1F3D]/10 hover:bg-[#FF1F3D] text-[#FF1F3D] hover:text-white border border-[#FF1F3D]/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRTL ? "إضافة" : "Add"}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
