import React, { useState, useEffect } from "react";
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
  Sparkles,
  Zap,
  CreditCard,
  Headphones,
} from "lucide-react";
import { useLanguage } from "../../providers/LanguageContext";
import { getProducts, CATEGORIES } from "../../services/products";
import SectionHeader from "../../components/SectionHeader";
import ProductCard from "../../components/ProductCard";

// Assets
import heroDragonImg from "../../assets/images/3dprint/hero_dragon.jpg";
import customVaseImg from "../../assets/images/3dprint/custom_vase.jpg";
import filamentImg from "../../assets/images/3dprint/filament_spools.jpg";

export default function Home() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getProducts({ sort: "popular", limit: 6 });
        setProducts(data);
      } catch (err) {
        console.error("Failed to load popular products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const qnaItems = [
    { q: t.qna.q1, a: t.qna.a1 },
    { q: t.qna.q2, a: t.qna.a2 },
    { q: t.qna.q3, a: t.qna.a3 },
    { q: t.qna.q4, a: t.qna.a4 },
    { q: t.qna.q5, a: t.qna.a5 },
    { q: t.qna.q6, a: t.qna.a6 },
    { q: t.qna.q7, a: t.qna.a7 },
    { q: t.qna.q8, a: t.qna.a8 },
    { q: t.qna.q9, a: t.qna.a9 },
    { q: t.qna.q10, a: t.qna.a10 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B10] text-gray-900 dark:text-[#F5F7FA] transition-colors duration-200 pb-16">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-8 sm:space-y-12">
        
        {/* ========================================== */}
        {/* ========================================== */}
        {/* 1. HERO SECTION (Midnight Crimson Studio Theme) */}
        {/* ========================================== */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0B111A] via-[#121B27] to-[#1F0C14] text-white p-4 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-red-500/20"
        >
          {/* Ambient Crimson Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FF1F3D]/15 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center relative z-10">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FF1F3D] mb-1.5 sm:mb-3 bg-[#FF1F3D]/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#FF1F3D]/30 animate-pulse-glow">
                {t.hero.eyebrow}
              </span>

              <h1 className="text-xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-snug text-white">
                {t.hero.titleLine1} <br />
                <span className="text-[#FF1F3D]">{t.hero.titleLine2}</span>
              </h1>

              <p className="mt-1.5 sm:mt-4 text-xs sm:text-base text-gray-300 max-w-lg leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="mt-3 sm:mt-8">
                <Link to="/shop">
                  <button className="animate-shimmer-btn bg-[#FF1F3D] hover:bg-[#E01833] text-white font-bold px-4 py-2 sm:px-6 sm:py-3.5 rounded-full text-xs sm:text-base transition-all duration-200 shadow-lg shadow-red-600/25 hover:scale-105 active:scale-95 flex items-center gap-2">
                    <span>{t.hero.cta}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </Link>
              </div>

              {/* Feature badges at bottom */}
              <div className="hidden sm:grid mt-6 sm:mt-12 pt-4 sm:pt-6 border-t border-slate-800/80 grid-cols-3 gap-2 sm:gap-4 w-full text-[10px] sm:text-xs text-gray-300">
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#151D2A] border border-slate-700/60 flex items-center justify-center text-[#FF1F3D] flex-shrink-0 animate-float">
                    <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-medium line-clamp-1">{t.hero.features.quality}</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#151D2A] border border-slate-700/60 flex items-center justify-center text-[#FF1F3D] flex-shrink-0 animate-float" style={{ animationDelay: '0.6s' }}>
                    <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-medium line-clamp-1">{t.hero.features.fast}</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#151D2A] border border-slate-700/60 flex items-center justify-center text-[#FF1F3D] flex-shrink-0 animate-float" style={{ animationDelay: '1.2s' }}>
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-medium line-clamp-1">{t.hero.features.custom}</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="hidden sm:flex lg:col-span-5 relative items-center justify-center">
              <div className="relative w-full aspect-16/9 sm:aspect-square lg:aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-red-500/20 group">
                <img
                  src={heroDragonImg}
                  alt="3D Printed Dragon Figurine"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B111A]/80 via-transparent to-transparent" />
              </div>
            </div>

          </div>
        </motion.section>

        {/* ========================================== */}
        {/* 2. CATEGORY NAVIGATION (Sleek Horizontal Pills on Mobile) */}
        {/* ========================================== */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="pt-1"
        >
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-3 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
              const label = t.categories[cat.nameKey] || cat.defaultName;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/shop?category=${cat.id}`)}
                  className="flex-shrink-0 flex flex-row sm:flex-col items-center gap-1.5 p-2 sm:p-3.5 px-3 sm:px-3.5 w-auto sm:w-32 bg-white dark:bg-[#10161D] rounded-full sm:rounded-2xl border border-gray-100 dark:border-[#1E2630] hover:border-gray-300 dark:hover:border-[#FF1F3D]/50 hover:shadow-md transition-all duration-200 group text-center active:scale-95"
                >
                  <div className="w-6 h-6 sm:w-12 sm:h-12 rounded-full sm:rounded-xl bg-gray-100 dark:bg-[#151C24] flex items-center justify-center text-xs sm:text-2xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-[#F5F7FA] whitespace-nowrap">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* 3. CUSTOM 3D PRINTING BANNER (Midnight Crimson Theme) */}
        {/* ========================================== */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0B111A] via-[#141C28] to-[#1B0D16] text-white p-4 sm:p-10 overflow-hidden shadow-xl border border-red-500/20 relative"
        >
          {/* Ambient Crimson Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF1F3D]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center relative z-10">
            <div className="md:col-span-7 space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FF1F3D]">
                {t.customBanner.eyebrow}
              </span>
              <h2 className="text-lg sm:text-4xl font-bold tracking-tight text-white">
                {t.customBanner.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md leading-relaxed">
                {t.customBanner.description}
              </p>
              <div className="pt-1 sm:pt-2">
                <Link to="/custom-order">
                  <button className="animate-shimmer-btn bg-[#FF1F3D] hover:bg-[#E01833] text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md shadow-red-600/20 active:scale-95 flex items-center gap-2">
                    <span>{t.customBanner.cta}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </Link>
              </div>
            </div>

            <div className="hidden sm:block md:col-span-5 relative">
              <div className="aspect-16/9 md:aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden border border-red-500/20 shadow-inner group">
                <img
                  src={customVaseImg}
                  alt="Custom 3D Printing Vase"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* 5. PREMIUM FILAMENTS BANNER                */}
        {/* ========================================== */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="rounded-2xl sm:rounded-3xl bg-[#F6F4EF] dark:bg-[#151C24] text-slate-900 dark:text-[#F5F7FA] p-4 sm:p-10 overflow-hidden shadow-sm border border-amber-100 dark:border-[#26313D]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
            <div className="md:col-span-7 space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FF1F3D]">
                {t.filamentsBanner.eyebrow}
              </span>
              <h2 className="text-lg sm:text-4xl font-bold tracking-tight">
                {t.filamentsBanner.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#AAB4C0] max-w-md leading-relaxed">
                {t.filamentsBanner.description}
              </p>
              <div className="pt-1 sm:pt-2">
                <Link to="/shop?category=filaments">
                  <button className="bg-slate-950 dark:bg-[#26313D] hover:bg-slate-800 dark:hover:bg-[#323F4E] text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all duration-200 active:scale-95 flex items-center gap-2">
                    <span>{t.filamentsBanner.cta}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </Link>
              </div>
            </div>

            <div className="hidden sm:block md:col-span-5 relative">
              <div className="aspect-16/9 md:aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 dark:border-[#26313D] shadow-sm group">
                <img
                  src={filamentImg}
                  alt="Premium Filaments"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* 6. WHY CHOOSE US                           */}
        {/* ========================================== */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="py-1 sm:py-4"
        >
          <SectionHeader
            title={t.whyChooseUs.title}
            subtitle={t.whyChooseUs.subtitle}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            <div className="p-3 sm:p-5 bg-white dark:bg-[#10161D] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#1E2630] mixo-card-hover flex flex-col items-start gap-1.5 sm:gap-3">
              <div className="p-1.5 sm:p-3 bg-amber-50 dark:bg-red-500/10 text-amber-600 dark:text-[#FF1F3D] rounded-lg sm:rounded-xl animate-float">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-base text-gray-900 dark:text-[#F5F7FA]">
                  {t.whyChooseUs.f1Title}
                </h3>
                <p className="hidden sm:block text-[10px] sm:text-xs text-gray-500 dark:text-[#AAB4C0] mt-0.5 sm:mt-1">
                  {t.whyChooseUs.f1Desc}
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-5 bg-white dark:bg-[#10161D] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#1E2630] mixo-card-hover flex flex-col items-start gap-1.5 sm:gap-3">
              <div className="p-1.5 sm:p-3 bg-amber-50 dark:bg-red-500/10 text-amber-600 dark:text-[#FF1F3D] rounded-lg sm:rounded-xl animate-float" style={{ animationDelay: '0.5s' }}>
                <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-base text-gray-900 dark:text-[#F5F7FA]">
                  {t.whyChooseUs.f2Title}
                </h3>
                <p className="hidden sm:block text-[10px] sm:text-xs text-gray-500 dark:text-[#AAB4C0] mt-0.5 sm:mt-1">
                  {t.whyChooseUs.f2Desc}
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-5 bg-white dark:bg-[#10161D] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#1E2630] mixo-card-hover flex flex-col items-start gap-1.5 sm:gap-3">
              <div className="p-1.5 sm:p-3 bg-amber-50 dark:bg-red-500/10 text-amber-600 dark:text-[#FF1F3D] rounded-lg sm:rounded-xl animate-float" style={{ animationDelay: '1s' }}>
                <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-base text-gray-900 dark:text-[#F5F7FA]">
                  {t.whyChooseUs.f3Title}
                </h3>
                <p className="hidden sm:block text-[10px] sm:text-xs text-gray-500 dark:text-[#AAB4C0] mt-0.5 sm:mt-1">
                  {t.whyChooseUs.f3Desc}
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-5 bg-white dark:bg-[#10161D] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#1E2630] mixo-card-hover flex flex-col items-start gap-1.5 sm:gap-3">
              <div className="p-1.5 sm:p-3 bg-amber-50 dark:bg-red-500/10 text-amber-600 dark:text-[#FF1F3D] rounded-lg sm:rounded-xl animate-float" style={{ animationDelay: '1.5s' }}>
                <Headphones className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-base text-gray-900 dark:text-[#F5F7FA]">
                  {t.whyChooseUs.f4Title}
                </h3>
                <p className="hidden sm:block text-[10px] sm:text-xs text-gray-500 dark:text-[#AAB4C0] mt-0.5 sm:mt-1">
                  {t.whyChooseUs.f4Desc}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* 7. 3D PRINTING Q&A (FAQ)                   */}
        {/* ========================================== */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="py-1 sm:py-4"
        >
          <SectionHeader
            title={t.qna.title}
            subtitle={t.qna.subtitle}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
            {qnaItems.slice(0, 4).map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#10161D] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#1E2630] overflow-hidden transition-all duration-200 hover:border-[#FF1F3D]/40"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-3.5 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#F5F7FA] hover:bg-gray-50 dark:hover:bg-[#151C24]/50 transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 dark:text-[#7F8A96] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-[#7F8A96] flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-3.5 pb-3 sm:px-5 sm:pb-4 text-[11px] sm:text-xs text-gray-600 dark:text-[#AAB4C0] leading-relaxed border-t border-gray-100 dark:border-[#1E2630] pt-2 sm:pt-3"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-3 sm:pt-4">
            <Link
              to="/faqs"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-[#10161D] border border-gray-200 dark:border-[#1E2630] text-[#FF1F3D] rounded-xl text-xs font-bold hover:border-[#FF1F3D] transition-all shadow-sm active:scale-95"
            >
              <span>{isRTL ? "عرض جميع الأسئلة الشائعة بمركز المساعدة" : "View All FAQs in Help Center"}</span>
              {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </Link>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
