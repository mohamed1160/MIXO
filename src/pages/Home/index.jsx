import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Box,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Headphones,
  PenTool,
  Sparkles,
  Package,
} from "lucide-react";
import { useLanguage } from "../../providers/LanguageContext";
import { getProducts } from "../../services/products";
import ProductCard from "../../components/ProductCard";
import { useSEO } from "../../hooks/useSEO";
import JsonLd, { buildWebSiteSchema, buildFAQSchema } from "../../components/seo/JsonLd";
import { SITE_URL, SITE_NAME } from "../../config/seo";

// Assets
import heroDragonImg from "../../assets/images/3dprint/hero_dragon.jpg";
import customVaseImg from "../../assets/images/3dprint/custom_vase.jpg";

export default function Home() {
  const { t, isRTL, lang } = useLanguage();
  const navigate = useNavigate();

  // ── SEO ──
  useSEO();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts({ sort: "popular", limit: 6 });
      setProducts(data);
    } catch (err) {
      console.error("Failed to load popular products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => loadData();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("mixo_products_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("mixo_products_updated", handleStorageChange);
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Top 4 Categories as requested
  const categoriesList = [
    {
      id: "figures",
      name: isRTL ? "مجسمات" : "Figures",
      fullName: isRTL ? "مجسمات ومقتنيات" : "Figures & Collectibles",
      icon: "🐉",
      color: "bg-red-500/10 text-[#FF1F3D]",
    },
    {
      id: "masks",
      name: isRTL ? "ماسكات" : "Masks",
      fullName: isRTL ? "ماسكات وأقنعة" : "Masks & Wearables",
      icon: "🎭",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "decor",
      name: isRTL ? "ديكور" : "Home Decor",
      fullName: isRTL ? "ديكور المنزل" : "Home Decor",
      icon: "🪴",
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "tools",
      name: isRTL ? "أدوات" : "Parts",
      fullName: isRTL ? "أجزاء وأدوات" : "Functional Parts",
      icon: "⚙️",
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  // Quick 3 FAQs
  const qnaItems = [
    {
      q: isRTL ? "ما هي الطباعة ثلاثية الأبعاد (3D Printing)؟" : "What is 3D printing?",
      a: isRTL
        ? "عملية تصنيع رقمية تحول التصاميم الثلاثية الأبعاد إلى منتجات حقيقية طبقة تلو الأخرى باستخدام خامات متينة عالية الجودة."
        : "Layer-by-layer digital manufacturing turning CAD models into physical products using durable materials.",
    },
    {
      q: isRTL ? "ما هي المواد المستخدمة في الطباعة؟" : "What materials do you use?",
      a: isRTL
        ? "نستخدم خامات PLA الفاخرة والصديقة للبيئة لضمان المتانة والدقة العالية."
        : "We use premium eco-friendly PLA for maximum durability and precision.",
    },
    {
      q: isRTL ? "كم يستغرق الشحن والتوصيل؟" : "How long does printing & shipping take?",
      a: isRTL
        ? "تجهز الطلبات وتصلك خلال 1 إلى 3 أيام عمل لجميع المحافظات."
        : "Orders are prepared and delivered within 1 to 3 business days across all governorates.",
    },
  ];

  // ── Structured Data ──
  const websiteSchema = useMemo(() => buildWebSiteSchema(SITE_URL, SITE_NAME), []);
  const faqSchema = useMemo(() => buildFAQSchema(qnaItems), [lang]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0F172A] text-gray-900 dark:text-[#F8FAFC] transition-colors duration-200 pb-16">
      {/* JSON-LD Structured Data */}
      <JsonLd data={websiteSchema} />
      <JsonLd data={faqSchema} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-10 sm:space-y-16">
        
        {/* ========================================== */}
        {/* 1. HERO SECTION                            */}
        {/* ========================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#16202E] to-[#2A1D2D] text-white p-5 sm:p-10 lg:p-12 overflow-hidden shadow-xl border border-slate-700/50 dark:border-slate-700/60"
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF1F3D]/20 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            {/* Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF1F3D] mb-2 sm:mb-3 bg-[#FF1F3D]/15 px-3 py-1 rounded-full border border-[#FF1F3D]/30">
                <Sparkles className="w-3 h-3" />
                <span>{isRTL ? "طباعة ثلاثية الأبعاد مخصصة" : "CUSTOM 3D PRINTING"}</span>
              </span>

              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                {isRTL ? "حول أفكارك إلى " : "Turn Your Ideas Into "}
                <br className="hidden sm:inline" />
                <span className="text-[#FF1F3D]">{isRTL ? "منتجات حقيقية." : "Real Products."}</span>
              </h1>

              <p className="mt-2 sm:mt-4 text-xs sm:text-base text-slate-200 max-w-lg leading-relaxed font-normal">
                {isRTL
                  ? "منتجات طباعة ثلاثية الأبعاد عالية الجودة مصممة خصيصاً لك."
                  : "Premium 3D printed products made for you."}
              </p>

              {/* Action Buttons */}
              <div className="mt-5 sm:mt-8 flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Link to="/shop" className="flex-1 sm:flex-initial">
                  <button className="w-full bg-white hover:bg-slate-100 text-slate-950 font-extrabold px-5 py-3 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-base transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                    <span>{isRTL ? "تسوق الآن" : "Shop Now"}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4 text-slate-950" /> : <ArrowRight className="w-4 h-4 text-slate-950" />}
                  </button>
                </Link>

                <Link to="/custom-order" className="flex-1 sm:flex-initial">
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-base border border-white/25 hover:border-white/50 transition-all duration-300 backdrop-blur-sm active:scale-95 flex items-center justify-center gap-2">
                    <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF1F3D]" />
                    <span>{isRTL ? "تصميم خاص" : "Custom Design"}</span>
                  </button>
                </Link>
              </div>

              {/* Feature Badges under Hero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/15 w-full text-[11px] sm:text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-[#FF1F3D] flex-shrink-0" />
                  <span className="font-medium">{isRTL ? "خامات فائقة" : "High Quality"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#FF1F3D] flex-shrink-0" />
                  <span className="font-medium">{isRTL ? "شحن سريع" : "Fast Shipping"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#FF1F3D] flex-shrink-0" />
                  <span className="font-medium">{isRTL ? "طلب خاص" : "Custom Orders"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-[#FF1F3D] flex-shrink-0" />
                  <span className="font-medium">{isRTL ? "دعم متواصل" : "24/7 Support"}</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center mt-2 lg:mt-0">
              <div className="relative w-full aspect-4/3 sm:aspect-square lg:aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/15 group">
                <img
                  src={heroDragonImg}
                  alt="3D Printed Dragon Figurine"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* 2. CATEGORIES SECTION                      */}
        {/* ========================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isRTL ? "استكشف الأقسام" : "Shop by Category"}
            </h2>
            <Link
              to="/categories"
              className="text-xs sm:text-sm font-bold text-[#FF1F3D] hover:underline flex items-center gap-1"
            >
              <span>{isRTL ? "عرض الكل" : "View All"}</span>
              {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          {/* Simple horizontal scrolling cards on mobile / grid on desktop */}
          <div className="flex sm:grid sm:grid-cols-4 gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar scroll-smooth">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/shop?category=${cat.id}`)}
                className="flex-shrink-0 w-36 sm:w-auto p-4 bg-white dark:bg-[#1E293B]/70 rounded-2xl border border-gray-200/80 dark:border-slate-700/60 hover:border-[#FF1F3D]/50 dark:hover:border-[#FF1F3D]/50 transition-all duration-200 text-left group flex flex-col items-start justify-between min-h-[100px] active:scale-95 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0F172A] flex items-center justify-center text-xl shadow-sm border border-gray-100 dark:border-slate-700/50 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="mt-3">
                  <span className="block text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#FF1F3D] transition-colors">
                    {cat.name}
                  </span>
                  <span className="block text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {cat.fullName}
                  </span>
                </div>
              </button>
            ))}

            {/* View All Card */}
            <button
              onClick={() => navigate("/categories")}
              className="flex-shrink-0 w-36 sm:w-auto p-4 bg-white dark:bg-[#1E293B]/70 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700/80 hover:border-[#FF1F3D] transition-all duration-200 text-left group flex flex-col items-start justify-between min-h-[100px] active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0F172A] flex items-center justify-center text-[#FF1F3D] shadow-sm border border-gray-100 dark:border-slate-700/50 group-hover:scale-110 transition-transform">
                {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </div>
              <div className="mt-3">
                <span className="block text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#FF1F3D] transition-colors">
                  {isRTL ? "كل الأقسام" : "More Categories"}
                </span>
                <span className="block text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                  {isRTL ? "استكشف المزيد" : "Explore All"}
                </span>
              </div>
            </button>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* 3. POPULAR PRODUCTS SECTION                */}
        {/* ========================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FF1F3D]">
                {isRTL ? "منتجات مميزة" : "FEATURED PRODUCTS"}
              </span>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-0.5">
                {isRTL ? "المنتجات الأكثر شعبية" : "Popular 3D Printed Products"}
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-bold text-[#FF1F3D] hover:underline flex items-center gap-1"
            >
              <span>{isRTL ? "عرض الكل" : "View All"}</span>
              {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-[#1E293B]/70 rounded-2xl h-64 animate-pulse border border-gray-200 dark:border-slate-700/60"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </motion.section>

        {/* ========================================== */}
        {/* 4. CUSTOM PRINTING BANNER                  */}
        {/* ========================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#16202E] to-[#2A1D2D] text-white p-5 sm:p-10 overflow-hidden shadow-xl border border-slate-700/50 dark:border-slate-700/60"
        >
          {/* Ambient Glow */}
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF1F3D]/20 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-7 space-y-2 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FF1F3D] bg-[#FF1F3D]/15 px-2.5 py-1 rounded-full border border-[#FF1F3D]/30 inline-block">
                {isRTL ? "طباعة مخصصة" : "CUSTOM 3D PRINTING"}
              </span>

              <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {isRTL ? "هل تحتاج إلى تصميم خاص؟" : "Need a Custom Design?"}
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 max-w-md leading-relaxed font-normal">
                {isRTL
                  ? "أرسل لنا فكرتك أو ملف الـ 3D وسنقوم بطباعتها بدقة فائقة وتوصيلها لك."
                  : "Send us your idea or 3D file and we'll print it with high precision."}
              </p>

              <div className="pt-2">
                <Link to="/custom-order">
                  <button className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all duration-300 shadow-md hover:scale-105 active:scale-95 flex items-center gap-2">
                    <span>{isRTL ? "طلب تصميم خاص" : "Customize"}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </Link>
              </div>
            </div>

            <div className="hidden sm:block lg:col-span-5 relative">
              <div className="aspect-16/9 lg:aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 shadow-inner group">
                <img
                  src={customVaseImg}
                  alt="3D Printer Nozzle Printing"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* 5. QUICK FAQ SECTION                       */}
        {/* ========================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isRTL ? "أسئلة شائعة" : "Quick FAQ"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              {isRTL
                ? "إجابات سريعة لأهم استفسارات الطباعة والتوصيل."
                : "Common questions about 3D printing & delivery."}
            </p>
          </div>

          <div className="space-y-3">
            {qnaItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1E293B]/70 rounded-2xl border border-gray-200/80 dark:border-slate-700/60 overflow-hidden transition-all duration-200 hover:border-[#FF1F3D]/40 shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#1E293B]/90 transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#FF1F3D] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4 sm:px-5 sm:pb-4 text-xs text-gray-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-slate-700/50 pt-3"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/faqs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF1F3D] hover:underline"
            >
              <span>{isRTL ? "عرض جميع الأسئلة بمركز المساعدة" : "View All FAQs"}</span>
              {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* 6. COMPACT BENEFITS ROW                    */}
        {/* ========================================== */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="pt-2 border-t border-gray-200/80 dark:border-slate-800"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-xs font-medium text-gray-600 dark:text-slate-300 text-center">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF1F3D]" />
              <span>{isRTL ? "جودة فائقة" : "Quality"}</span>
            </span>
            <span className="text-gray-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#FF1F3D]" />
              <span>{isRTL ? "شحن سريع" : "Fast Shipping"}</span>
            </span>
            <span className="text-gray-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF1F3D]" />
              <span>{isRTL ? "دفع آمن" : "Secure Payment"}</span>
            </span>
            <span className="text-gray-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#FF1F3D]" />
              <span>{isRTL ? "دعم متواصل" : "Support"}</span>
            </span>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
