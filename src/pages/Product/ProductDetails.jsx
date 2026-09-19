import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Box,
  Layers,
  Zap,
  Plus,
  Minus,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getProducts, MOCK_3D_PRODUCTS } from '../../services/products';
import { getSupabaseReviews, saveSupabaseReview } from '../../services/db.service';
import { useShopStore } from '../../store/useShopStore';
import { useLanguage } from '../../providers/LanguageContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { useSEO } from '../../hooks/useSEO';
import JsonLd, { buildProductSchema, buildBreadcrumbSchema } from '../../components/seo/JsonLd';
import { SITE_URL } from '../../config/seo';
import MaskDimensionsModal from '../../components/MaskDimensionsModal';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRTL, lang } = useLanguage();
  const addToCart = useShopStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [colorError, setColorError] = useState(false);

  const toggleColor = (colorName) => {
    setColorError(false);
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };
  const [selectedScale, setSelectedScale] = useState('100% (Standard)');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('specs');

  // Mask Dimensions Modal State
  const [isMaskModalOpen, setIsMaskModalOpen] = useState(false);
  const [pendingBuyNow, setPendingBuyNow] = useState(false);

  // Customer Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerComment, setReviewerComment] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) {
      toast.error(isRTL ? 'برجاء كتابة الاسم والتعليق' : 'Please enter your name and review');
      return;
    }
    const ratingNum = Number(newRating) || 5;

    try {
      await saveSupabaseReview({
        productId: product.id,
        userName: reviewerName.trim(),
        rating: ratingNum,
        comment: reviewerComment.trim(),
        status: 'Published'
      });

      toast.success(
        isRTL
          ? 'شكراً لك! تم إضافة تقييمك للمنتج بنجاح 🎉'
          : 'Thank you! Your review has been added successfully 🎉'
      );

      const updated = await getSupabaseReviews(product.id);
      setReviews(updated);
      setIsReviewModalOpen(false);
      setReviewerName('');
      setReviewerComment('');
      setNewRating(5);
    } catch (err) {
      console.error(err);
      toast.error(isRTL ? 'حدث خطأ أثناء حفظ التقييم' : 'Failed to submit review');
    }
  };

  const COLOR_OPTIONS = [
    { name: isRTL ? 'بيج' : 'Beige', colorCode: '#E5D3B3' },
    { name: isRTL ? 'أبيض' : 'White', colorCode: '#FFFFFF' },
    { name: isRTL ? 'أسود' : 'Black', colorCode: '#000000' },
    { name: isRTL ? 'أحمر' : 'Red', colorCode: '#FF1F3D' },
    { name: isRTL ? 'أصفر' : 'Yellow', colorCode: '#EAB308' },
    { name: isRTL ? 'أخضر' : 'Green', colorCode: '#22C55E' },
    { name: isRTL ? 'رمادي' : 'Grey', colorCode: '#6B7280' },
    { name: isRTL ? 'أزرق' : 'Blue', colorCode: '#3B82F6' },
    { name: isRTL ? 'بينك' : 'Pink', colorCode: '#EC4899' },
    { name: isRTL ? 'بني' : 'Brown', colorCode: '#8B4513' },
  ];

  const SCALE_OPTIONS = [
    { label: '75% (Compact)', multiplier: 0.85 },
    { label: '100% (Standard)', multiplier: 1.0 },
    { label: '150% (Large)', multiplier: 1.45 },
  ];

  useEffect(() => {
    loadProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProductDetails = async () => {
    const all = await getProducts({ limit: 100 });
    const found = all.find((p) => String(p.id) === String(id));
    
    if (found) {
      setProduct(found);
      setSelectedImage(found.image || found.images?.[0] || '');
      // Find related products in same category
      const related = all
        .filter((p) => String(p.id) !== String(id) && (p.category === found.category || p.categoryId === found.categoryId))
        .slice(0, 4);
      setRelatedProducts(related.length > 0 ? related : all.filter(p => String(p.id) !== String(id)).slice(0, 4));

      // Fetch customer reviews from API / Supabase
      const productReviews = await getSupabaseReviews(found.id);
      setReviews(productReviews);
    } else {
      // Fallback to first mock product
      const fallback = MOCK_3D_PRODUCTS[0];
      setProduct(fallback);
      setSelectedImage(fallback.image);
    }
  };

  const finalPrice = product ? (Number(product.price) || 0) : 0;
  const productName = product ? (product.title || product.name) : '';
  const isMask = product?.isMask ||
    String(product?.category || '').toLowerCase().includes('mask') ||
    String(product?.category || '').includes('ماسكات') ||
    String(product?.category || '').includes('أقنعة');

  // ── Dynamic SEO (Hooks MUST be called unconditionally before early return) ──
  useSEO({
    title: productName ? `${productName} — MIXO 3D` : undefined,
    description: product?.description
      ? product.description.substring(0, 160)
      : (lang === 'ar'
        ? `${productName} — مجسم ثلاثي الأبعاد عالي الجودة من MIXO 3D. اطلب الآن مع الشحن لجميع المحافظات.`
        : `${productName} — Premium 3D printed product by MIXO 3D. Order now with fast shipping across Egypt.`),
    ogType: 'product',
    ogImage: (product?.image || product?.images?.[0] || ''),
  });

  // ── Structured Data ──
  const productSchema = useMemo(() => (product ? buildProductSchema(product, SITE_URL) : null), [product]);
  const breadcrumbSchema = useMemo(() => (product ? buildBreadcrumbSchema([
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
    { name: lang === 'ar' ? 'المتجر' : 'Shop', url: '/shop' },
    { name: productName },
  ], SITE_URL) : null), [product, lang, productName]);

  if (!product) return null;

  const checkColorSelected = () => {
    if (!selectedColors || selectedColors.length === 0) {
      setColorError(true);
      toast.error(
        isRTL
          ? '⚠️ يرجى اختيار لون واحد على الأقل للمجسم!'
          : '⚠️ Please select at least one color!'
      );
      return false;
    }
    return true;
  };

  const activeColorValue = selectedColors.join(' + ');

  const handleAddToCart = () => {
    if (!checkColorSelected()) return;
    setColorError(false);

    if (isMask) {
      setPendingBuyNow(false);
      setIsMaskModalOpen(true);
      return;
    }
    addToCart({
      ...product,
      color: activeColorValue,
      price: finalPrice,
      quantity,
    });
    toast.success(
      isRTL
        ? `تمت إضافة (${product.title || product.name}) بلون (${activeColorValue}) إلى السلة 🚀`
        : `Added ${product.title || product.name} (${activeColorValue}) to cart 🚀`
    );
  };

  const handleBuyNow = () => {
    if (!checkColorSelected()) return;
    setColorError(false);

    if (isMask) {
      setPendingBuyNow(true);
      setIsMaskModalOpen(true);
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };

  const NextIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B10] text-gray-900 dark:text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      {/* JSON-LD Structured Data */}
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#7F8A96]">
          <Link to="/" className="hover:text-[#FF1F3D] transition-colors">
            {isRTL ? 'الرئيسية' : 'Home'}
          </Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <Link to="/shop" className="hover:text-[#FF1F3D] transition-colors">
            {isRTL ? 'المتجر' : 'Shop'}
          </Link>
          <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[200px]">
            {product.title || product.name}
          </span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Gallery Left Column (5 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] overflow-hidden shadow-xl group">
              <img
                src={selectedImage}
                alt={`${productName} — 3D printed product by MIXO 3D`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute top-4 right-4 flex items-center gap-2">
                {product.isBestSeller && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF1F3D] text-white shadow-md shadow-red-600/30">
                    {isRTL ? 'الأكثر مبيعاً' : 'Best Seller'}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-black/60 text-white backdrop-blur-md border border-white/20">
                  {product.category || '3D Model'}
                </span>
              </div>
            </div>

            {/* Thumbnail list */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-[#FF1F3D] scale-105 shadow-md shadow-red-600/20'
                        : 'border-gray-200 dark:border-[#1E2630] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${productName} — view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white dark:bg-[#0F151D] rounded-2xl border border-gray-200 dark:border-[#1E2630] text-center space-y-1">
                <Box size={20} className="mx-auto text-[#FF1F3D]" />
                <p className="text-[11px] font-bold">{isRTL ? 'دقة 0.12 مم' : '0.12mm Precision'}</p>
                <p className="text-[10px] text-gray-500 dark:text-[#7F8A96]">{isRTL ? 'تفاصيل فائقة' : 'Ultra High Detail'}</p>
              </div>
              <div className="p-3 bg-white dark:bg-[#0F151D] rounded-2xl border border-gray-200 dark:border-[#1E2630] text-center space-y-1">
                <Layers size={20} className="mx-auto text-[#FF1F3D]" />
                <p className="text-[11px] font-bold">{isRTL ? 'خامة PLA+ المقواة' : 'Reinforced PLA+'}</p>
                <p className="text-[10px] text-gray-500 dark:text-[#7F8A96]">{isRTL ? 'صديقة للبيئة ومتينة' : 'Eco-Friendly & Tough'}</p>
              </div>
              <div className="p-3 bg-white dark:bg-[#0F151D] rounded-2xl border border-gray-200 dark:border-[#1E2630] text-center space-y-1">
                <Zap size={20} className="mx-auto text-[#FF1F3D]" />
                <p className="text-[11px] font-bold">{isRTL ? 'تغليف وتجهيز متقن' : 'Careful Packaging'}</p>
                <p className="text-[10px] text-gray-500 dark:text-[#7F8A96]">{isRTL ? 'ضمان سلامة الوصول' : 'Safe Transit Delivery'}</p>
              </div>
            </div>
          </div>

          {/* Details Right Column (7 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {product.title || product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} className="fill-current" />
                  <span className="font-bold text-gray-900 dark:text-white">
                    {reviews.length > 0
                      ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
                      : (product.rating ? Number(product.rating).toFixed(1) : '5.0')}
                  </span>
                  <span className="text-gray-500 dark:text-[#7F8A96]">
                    ({(product.reviewCount || product.reviewsCount || 0) + reviews.length} {isRTL ? 'تقييم' : 'reviews'})
                  </span>
                </div>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-2.5 py-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-full text-[11px] font-bold border border-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Star size={12} className="fill-current" />
                  <span>{isRTL ? 'أضف تقييمك للمنتج ✍️' : 'Add Your Review ✍️'}</span>
                </button>

                <span className="text-gray-300 dark:text-[#26313D]">•</span>

                <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                  <CheckCircle2 size={15} />
                  <span>{isRTL ? 'متوفر للطباعة والشحن الفوري' : 'In Stock for 3D Printing'}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-black text-[#FF1F3D]">
                  {formatCurrency(finalPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-[#AAB4C0] leading-relaxed border-t border-b border-gray-200 dark:border-[#1E2630] py-4">
              {product.description ||
                (isRTL
                  ? 'مجسم ثلاثي الأبعاد مصمم بدقة عالية ومطبوع باستخدام تقنيات الطباعة الحديثة بخامات PLA+ المقواة. يتميز بالمتانة والخفة والتفاصيل المذهلة.'
                  : 'High-precision 3D printed model created using state-of-the-art additive manufacturing with eco-friendly reinforced PLA+ filaments.')}
            </p>

            {/* Mandatory Color Selection Section */}
            <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
              colorError
                ? 'bg-red-500/10 border-red-500 ring-2 ring-red-500/30 animate-pulse'
                : 'bg-white dark:bg-[#0F151D] border-gray-200 dark:border-[#1E2630]'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>{isRTL ? "تحديد ألوان الـ 3D المطلوبة:" : "Select 3D Color(s):"}</span>
                  <span className="text-[#FF1F3D] font-bold text-[11px]">* ({isRTL ? "يمكن تحديد أكثر من لون" : "Multi-select supported"})</span>
                </label>
                {activeColorValue ? (
                  <span className="text-xs font-bold text-[#FF1F3D] bg-red-500/10 px-2.5 py-0.5 rounded-full border border-[#FF1F3D]/30 max-w-[220px] truncate">
                    {activeColorValue}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {isRTL ? "اختر لوناً أو أكثر" : "Select one or more colors"}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => {
                  const isSelected = selectedColors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#FF1F3D] text-white border-[#FF1F3D] shadow-md shadow-red-500/20 scale-105 ring-2 ring-red-500/40"
                          : "bg-gray-50 dark:bg-[#151C24] text-gray-700 dark:text-[#AAB4C0] border-gray-200 dark:border-[#26313D] hover:border-gray-400"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border shrink-0 shadow-xs flex items-center justify-center ${
                          c.colorCode === '#FFFFFF' ? 'border-gray-400' : 'border-black/20'
                        }`}
                        style={{ backgroundColor: c.colorCode }}
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                        )}
                      </span>
                      <span>{c.name}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-white/25 px-1.5 py-0.2 rounded-md font-extrabold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {colorError && (
                <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 pt-1">
                  <span>⚠️ {isRTL ? "يرجى اختيار لون واحد على الأقل للمجسم أولاً." : "Please select at least one color for the product."}</span>
                </p>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-white dark:bg-[#151C24] hover:bg-gray-100 dark:hover:bg-[#1E2630] border border-gray-300 dark:border-[#26313D] text-gray-900 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <ShoppingBag size={18} className="text-[#FF1F3D]" />
                  <span>{isRTL ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full h-12 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 cursor-pointer"
              >
                <span>{isRTL ? 'الشراء الآن وحساب التوصيل' : 'Buy Now & Checkout'}</span>
                <NextIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-gray-200 dark:border-[#1E2630] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isRTL ? 'منتجات ومجسمات قد تعجبك' : 'Related 3D Models'}
              </h2>
              <Link to="/shop" className="text-xs font-bold text-[#FF1F3D] hover:underline">
                {isRTL ? 'عرض المتجر بالكامل' : 'View All Shop'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/product/${rel.id}`}
                  className="group bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-2xl overflow-hidden hover:border-[#FF1F3D] transition-all shadow-sm flex flex-col"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-[#151C24] overflow-hidden relative">
                    <img
                      src={rel.image || rel.images?.[0]}
                      alt={`${rel.title || rel.name} — 3D printed product`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-[#7F8A96]">{rel.category}</p>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {rel.title || rel.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-extrabold text-[#FF1F3D]">
                        {formatCurrency(rel.price)}
                      </span>
                      <span className="text-[10px] font-bold text-[#FF1F3D] group-hover:translate-x-1 transition-transform">
                        {isRTL ? 'التفاصيل ←' : 'View →'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews List */}
        <div className="pt-10 border-t border-gray-200 dark:border-[#1E2630] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="text-amber-400 fill-current" size={20} />
              <span>{isRTL ? `آراء وتقييمات العملاء (${reviews.length})` : `Customer Reviews (${reviews.length})`}</span>
            </h2>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2 bg-[#FF1F3D] hover:bg-[#D91832] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isRTL ? 'كتابة تقييم جديد' : 'Write a Review'}
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="p-6 bg-white dark:bg-[#0F151D] rounded-2xl border border-gray-200 dark:border-[#1E2630] text-center space-y-2">
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                {isRTL ? 'لا توجد تقييمات مكتوبة لهذا المنتج حتى الآن. كن أول من يكتب رأيه!' : 'No reviews written for this product yet. Be the first to leave a review!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-white dark:bg-[#0F151D] rounded-2xl border border-gray-200 dark:border-[#1E2630] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900 dark:text-white">{rev.userName}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} className={s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-700'} />
                      ))}
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 mr-1">{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed font-normal">{rev.comment}</p>
                  <span className="text-[10px] text-gray-400 block pt-1">{rev.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white p-1"
            >
              ✕
            </button>

            <div className="space-y-1 text-center">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {isRTL ? 'إضافة تقييمك للمنتج' : 'Add Product Review'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#7F8A96]">
                {product.title || product.name}
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              {/* Star Rating Picker */}
              <div className="space-y-2 text-center">
                <label className="block font-bold text-gray-700 dark:text-gray-300">
                  {isRTL ? 'درجة التقييم:' : 'Your Rating:'}
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        size={24}
                        className={star <= newRating ? 'text-amber-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="block font-bold text-gray-700 dark:text-gray-300">
                  {isRTL ? 'اسمك:' : 'Your Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder={isRTL ? 'مثال: محمد أحمد' : 'e.g. Mohamed Ahmed'}
                  className="w-full bg-gray-50 dark:bg-[#151C24] border border-gray-200 dark:border-[#26313D] rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1">
                <label className="block font-bold text-gray-700 dark:text-gray-300">
                  {isRTL ? 'تعليقك وتجربتك مع المجسم:' : 'Review & Feedback:'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder={isRTL ? 'اكتب رأيك وتجربتك في جودة المجسم 3D والتفاصيل...' : 'Write your feedback on print quality, details...'}
                  className="w-full bg-gray-50 dark:bg-[#151C24] border border-gray-200 dark:border-[#26313D] rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-[#151C24] hover:bg-gray-200 dark:hover:bg-[#1E2630] text-gray-700 dark:text-white rounded-xl font-bold transition-all"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all"
                >
                  {isRTL ? 'إرسال التقييم' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mask Dimensions Modal */}
      <MaskDimensionsModal
        isOpen={isMaskModalOpen}
        onClose={() => {
          setIsMaskModalOpen(false);
          setPendingBuyNow(false);
        }}
        product={product}
        quantity={quantity}
        onSuccess={(itemWithDimensions) => {
          toast.success(
            isRTL
              ? `تم تحديد المقاسات وإضافة (${product.title || product.name}) للسلة 🎭`
              : `Added (${product.title || product.name}) to cart with your mask size 🎭`
          );
          if (pendingBuyNow) {
            setPendingBuyNow(false);
            navigate('/checkout');
          }
        }}
      />
    </div>
  );
}
