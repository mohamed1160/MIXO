import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Sparkles, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useShopStore } from "../../store/useShopStore";
import { useLanguage } from "../../providers/LanguageContext";
import { MOCK_3D_PRODUCTS } from "../../services/products";
import MaskDimensionsModal from "../../components/MaskDimensionsModal";

export default function AccountWishlist() {
  const { isRTL } = useLanguage();
  const wishlist = useShopStore((state) => state.wishlist);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const addToCart = useShopStore((state) => state.addToCart);
  const cart = useShopStore((state) => state.cart);

  const [toastMessage, setToastMessage] = useState(null);
  const [activeMaskProduct, setActiveMaskProduct] = useState(null);

  // Normalize wishlist items against catalog if only IDs were passed
  const items = wishlist.map((rawItem) => {
    if (typeof rawItem === "object" && rawItem !== null) {
      const match = MOCK_3D_PRODUCTS.find((p) => p.id === rawItem.id);
      return {
        ...match,
        ...rawItem,
        rawItem,
        id: rawItem.id,
        title: rawItem.title || rawItem.name || match?.title || "3D Printed Model",
        price: rawItem.price || match?.price || 19.99,
        category: rawItem.category || match?.category || "3D Print",
        image: rawItem.image || rawItem.images?.[0] || match?.image || match?.images?.[0],
        isMask: rawItem.isMask || match?.isMask || (rawItem.category || "").toLowerCase().includes("mask"),
      };
    }
    // If it's a string / number ID
    const match = MOCK_3D_PRODUCTS.find((p) => p.id === rawItem);
    if (match) {
      return {
        ...match,
        rawItem,
        id: match.id,
        title: match.title,
        price: match.price,
        category: match.category,
        image: match.image || match.images?.[0],
        isMask: match.isMask || (match.category || "").toLowerCase().includes("mask"),
      };
    }
    return {
      id: rawItem,
      rawItem,
      title: `3D Model #${rawItem}`,
      price: 19.99,
      category: "3D Print",
      image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
      isMask: false,
    };
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemove = (item) => {
    toggleWishlist(item.rawItem);
    triggerToast(
      isRTL
        ? `تم إزالة "${item.title}" من قائمة المفضلة 💔`
        : `Removed "${item.title}" from wishlist 💔`
    );
  };

  const handleClearAll = () => {
    wishlist.forEach((item) => toggleWishlist(item));
    triggerToast(isRTL ? "تم إفراغ قائمة المفضلة بالكامل 🧹" : "Wishlist cleared! 🧹");
  };

  const handleAddToCart = (item) => {
    if (item.isMask) {
      setActiveMaskProduct(item);
    } else {
      addToCart(item, 1);
      triggerToast(
        isRTL
          ? `تم إضافة "${item.title}" إلى سلة الشراء! 🛍️`
          : `Added "${item.title}" to cart! 🛍️`
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-900 dark:text-[#F5F7FA] relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151C24] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#26313D] animate-bounce">
          <Sparkles size={16} className="text-[#FF1F3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#1E2630] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
            <span>{isRTL ? "قائمة المفضلة" : "Wishlist & Favorites"}</span>
            <span className="text-xs font-bold text-[#FF1F3D] bg-red-500/10 px-2.5 py-1 rounded-full border border-[#FF1F3D]/20">
              {items.length} {isRTL ? "منتج" : "Items"}
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1">
            {isRTL
              ? "المنتجات والمجسمات الـ 3D التي قمت بحفظها للرجوع إليها لاحقاً."
              : "Your saved 3D prints, custom models and masks."}
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="self-start sm:self-auto text-xs font-bold text-gray-400 hover:text-[#FF1F3D] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>{isRTL ? "مسح المفضلة بالكامل" : "Clear Wishlist"}</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 dark:bg-[#0F151D] rounded-3xl border border-gray-100 dark:border-[#1E2630] flex flex-col items-center justify-center gap-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-[#FF1F3D] flex items-center justify-center shadow-inner">
            <Heart size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isRTL ? "قائمة المفضلة فارغة" : "Your Wishlist is Empty"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96] max-w-sm mt-1 leading-relaxed">
              {isRTL
                ? "انقر على أيقونة القلب ❤️ عند تصفح المتجر لإضافة المنتجات والمجسمات الـ 3D المفضلة لديك هنا."
                : "Explore our collection and click the heart icon on any product to save it here."}
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-2 px-6 py-3 bg-[#FF1F3D] hover:bg-[#E01833] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-red-500/20 transition-all flex items-center gap-2"
          >
            <ShoppingBag size={16} />
            <span>{isRTL ? "تصفح متجر ميكسو 3D" : "Explore 3D Shop"}</span>
          </Link>
        </div>
      ) : (
        /* Items Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const isInCart = cart.some((c) => c.id === item.id);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#0F151D] rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-[#0B0F14]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-[#151C24]/90 backdrop-blur-xs text-red-500 flex items-center justify-center shadow-md hover:bg-[#FF1F3D] hover:text-white transition-all cursor-pointer"
                    title={isRTL ? "إزالة من المفضلة" : "Remove item"}
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-[#FF1F3D] transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-base font-extrabold text-[#FF1F3D]">
                        ${Number(item.price).toFixed(2)}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} />
                        PLA Material
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                      isInCart
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-[#FF1F3D] hover:bg-[#E01833] text-white"
                    }`}
                  >
                    <ShoppingCart size={15} />
                    <span>
                      {isInCart
                        ? isRTL
                          ? "موجود في السلة ✓"
                          : "In Cart ✓"
                        : item.isMask
                        ? isRTL
                          ? "تحديد المقاس والشراء"
                          : "Select Mask Size"
                        : isRTL
                        ? "إضافة للسلة"
                        : "Add to Cart"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mask Dimensions Modal if a mask was selected from Wishlist */}
      {activeMaskProduct && (
        <MaskDimensionsModal
          isOpen={!!activeMaskProduct}
          onClose={() => setActiveMaskProduct(null)}
          product={activeMaskProduct}
        />
      )}

    </div>
  );
}
