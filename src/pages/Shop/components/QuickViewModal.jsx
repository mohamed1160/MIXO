import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useShopStore } from "../../../store/useShopStore";
import { useLanguage } from "../../../providers/LanguageContext";
import { useState } from "react";
import { cn } from "../../../lib/utils";

export default function QuickViewModal({ product, onClose }) {
  const { isRTL } = useLanguage();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const addToCart = useShopStore((state) => state.addToCart);

  const displayTitle = isRTL 
    ? (product.nameAr || product.titleAr || product.name || product.title)
    : (product.nameEn || product.title || product.name);

  const displayCategory = isRTL
    ? (product.categoryAr || product.category || "مجسمات 3D")
    : (product.categoryEn || product.category || "3D Prints");

  const currencyText = isRTL ? "ج.م" : "EGP";

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart({
        ...product,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
      onClose();
    }
  };

  const images = product.images?.length ? product.images : [product.image];

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#121820] text-gray-900 dark:text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-gray-200 dark:border-gray-800"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 bg-gray-100 dark:bg-[#1C2533] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Images */}
          <div className="w-full md:w-1/2 flex flex-col bg-gray-50 dark:bg-[#171F2A] p-4">
            <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-white dark:bg-[#121820] shadow-sm">
              <img
                src={images[activeImage]}
                alt={displayTitle}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {images.length > 1 && (
              <div className="flex p-2 gap-3 overflow-x-auto hide-scrollbar mt-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "w-16 aspect-square rounded-lg overflow-hidden border-2 transition-all shrink-0",
                      activeImage === idx
                        ? "border-[#FF1F3D] ring-2 ring-[#FF1F3D]/20"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto">
            <span className="text-xs font-bold tracking-widest text-[#FF1F3D] uppercase mb-1.5">
              {displayCategory}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              {displayTitle}
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400 text-sm">★</div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {product.rating || "4.9"} ({product.reviewCount || product.sold || 28} {isRTL ? "تقييم" : "Reviews"})
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-black text-[#FF1F3D]">
                {product.price} {currencyText}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                  {product.oldPrice} {currencyText}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {product.description || (isRTL 
                ? "منتج ثلاثي الأبعاد عالي الجودة مطبوع بأدق التفاصيل وخامات متينة جداً يناسب الديكور والاستخدام اليومي."
                : "High quality 3D printed product crafted with precision and ultra-durable materials ideal for decor and everyday use.")}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block mb-2">
                  {isRTL ? "اللون" : "Color"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-3 py-1.5 border rounded-lg text-xs font-bold transition-all",
                        selectedColor === color
                          ? "border-[#FF1F3D] text-[#FF1F3D] bg-[#FF1F3D]/10 dark:bg-[#FF1F3D]/20"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#FF1F3D]"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block mb-2">
                  {isRTL ? "المقاس" : "Size"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-3 py-1.5 border rounded-lg text-xs font-bold transition-all",
                        selectedSize === size
                          ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden bg-gray-50 dark:bg-[#171F2A]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="w-9 h-9 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-10 bg-[#FF1F3D] hover:bg-[#E01833] active:scale-95 text-white font-bold text-xs uppercase tracking-wide rounded-full flex items-center justify-center gap-2 shadow-md shadow-[#FF1F3D]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock === 0 ? (isRTL ? "نفذت الكمية" : "Out of Stock") : (isRTL ? "إضافة للسلة" : "Add to Cart")}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
