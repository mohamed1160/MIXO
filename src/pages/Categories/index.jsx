import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft, Search, Layers, ShoppingBag, ShieldCheck, Ruler } from "lucide-react";
import { useLanguage } from "../../providers/LanguageContext";
import heroDragonImg from "../../assets/images/3dprint/hero_dragon.jpg";
import customVaseImg from "../../assets/images/3dprint/custom_vase.jpg";
import filamentImg from "../../assets/images/3dprint/filament_spools.jpg";
import CustomDesignModal from "../../components/CustomDesignModal";
import { getCategoryCounts } from "../../services/products";
import { useSEO } from "../../hooks/useSEO";

const CATEGORY_LIST = [
  {
    id: "figures",
    icon: "🐉",
    titleEn: "Figures & Collectibles",
    titleAr: "مجسمات ومقتنيات",
    descEn: "Articulated dragons, anime statues, and detailed 3D printed collectibles.",
    descAr: "تنانين مفصلية، مجسمات أنمي، وتحف مخصصة عالية الدقة.",
    count: 58,
    image: heroDragonImg,
    badgeEn: "Popular",
    badgeAr: "الأكثر طلباً",
    featured: true,
  },
  {
    id: "masks",
    icon: "🎭",
    titleEn: "Masks & Wearables",
    titleAr: "ماسكات وأقنعة",
    descEn: "Cyberpunk, Cosplay & Samurai masks with custom face height & circular width options.",
    descAr: "أقنعة كوزبلاي وسايبربانك مع إمكانية تحديد ارتفاع الوجه وعرضه الدائري.",
    count: 32,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    badgeEn: "Circular Fitting",
    badgeAr: "مقاسات دائرية",
    isMask: true,
    featured: true,
  },
  {
    id: "decor",
    icon: "🪴",
    titleEn: "Home Decor",
    titleAr: "ديكور المنزل",
    descEn: "Geometric planters, modern lamps, aesthetic shelf ornaments and art pieces.",
    descAr: "أصص زراعية هندسية، إضاءات حديثة، وديكورات رفوف راقية.",
    count: 42,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    badgeEn: "Modern Design",
    badgeAr: "تصميم عصري",
  },
  {
    id: "stands",
    icon: "📱",
    titleEn: "Phone & Tablet Stands",
    titleAr: "حوامل الهواتف والتابلت",
    descEn: "Ergonomic desktop phone holders, multi-angle tablet mounts and charging docks.",
    descAr: "حوامل هواتف مكتبية مريحة، قواعد تابلت متعددة الزوايا وشواحن.",
    count: 36,
    image: "https://images.unsplash.com/photo-1586775548406-f94d93540e1a?auto=format&fit=crop&w=800&q=80",
    badgeEn: "Practical",
    badgeAr: "عملي جداً",
  },
  {
    id: "tools",
    icon: "⚙️",
    titleEn: "Tools & Functional",
    titleAr: "أدوات ومستلزمات مكتبية",
    descEn: "Desk organizers, mechanical fidget toys, cable guides and custom utility parts.",
    descAr: "منظمات مكاتب، ألعاب فيجيت ميكانيكية، ومستلزمات تنظيم الكابلات.",
    count: 28,
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    badgeEn: "Utility",
    badgeAr: "استخدام يومي",
  },
  {
    id: "vases",
    icon: "🏺",
    titleEn: "Vases & Art",
    titleAr: "فازات وتحف فنية",
    descEn: "Spiralized silk finish vases, 3D textured pots and artistic sculptures.",
    descAr: "فازات حريرية حلزونية، تحف مموجة 3D ومجسمات فنية فريدة.",
    count: 24,
    image: customVaseImg,
    badgeEn: "Silk PLA",
    badgeAr: "لمعان حريري",
  },
  {
    id: "gaming",
    icon: "🎮",
    titleEn: "Gaming & Cosplay",
    titleAr: "ألعاب وإكسسوارات جيمنج",
    descEn: "Controller stands, headset mounts, keycaps, and custom gaming gear.",
    descAr: "حوامل أذرع التحكم، قواعد السماعات، وأكسسوارات الألعاب.",
    count: 20,
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80",
    badgeEn: "Gamer Choice",
    badgeAr: "خيار الجيمرز",
  },
  {
    id: "keychains",
    icon: "🔑",
    titleEn: "Keychains & Tags",
    titleAr: "ميداليات وإكسسوارات",
    descEn: "Custom logo keychains, embossed name tags, and small gift items.",
    descAr: "ميداليات بالشعار المخصص، تعليقات أسماء مفرغة وهدايا صغيرة.",
    count: 18,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    badgeEn: "Customizable",
    badgeAr: "قابل للتخصيص",
  },
];

export default function CategoriesPage() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // ── SEO ──
  useSEO();

  const countsMap = getCategoryCounts();

  // Filter Categories
  const filteredCategories = CATEGORY_LIST.filter((cat) => {
    const title = isRTL ? cat.titleAr : cat.titleEn;
    const desc = isRTL ? cat.descAr : cat.descEn;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTag === "masks") return matchesSearch && cat.isMask;
    if (selectedTag === "featured") return matchesSearch && cat.featured;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B10] text-gray-900 dark:text-[#F5F7FA] font-sans pb-24 transition-colors duration-200">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111823] via-[#0D131C] to-[#070B10] text-white py-12 sm:py-20 border-b border-[#1E2630]">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1F3D]/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF1F3D]/10 border border-[#FF1F3D]/30 text-[#FF1F3D] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>{isRTL ? "أقسام الطباعة ثلاثية الأبعاد" : "3D Printing Categories"}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {isRTL ? (
                <>
                  استكشف عوالم <span className="text-[#FF1F3D]">Mixo</span> للطباعة 3D
                </>
              ) : (
                <>
                  Explore <span className="text-[#FF1F3D]">Mixo</span> 3D Printing Worlds
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {isRTL
                ? "تصفح تشكيلة متنوعة من أقسام المجسمات، الديكورات، وحوامل المكاتب، أو اطلب مقاسات خاصة للماسكات والأقنعة."
                : "Browse our curated catalog of 3D printed figurines, home decor, office stands, or order custom fitted masks."}
            </p>

            {/* Quick Action & Stat Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
              <button
                onClick={() => setIsCustomModalOpen(true)}
                className="bg-[#FF1F3D] hover:bg-[#E01833] text-white px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isRTL ? "طلب تصميم خاص" : "Customize Order"}</span>
              </button>
              <Link
                to="/shop"
                className="bg-[#151C24] hover:bg-[#1E2630] border border-[#26313D] text-gray-200 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#FF1F3D]" />
                <span>{isRTL ? "تصفح جميع المنتجات" : "View All Products"}</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white dark:bg-[#0F151D] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-100 dark:border-[#1E2630] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "ابحث عن قسم..." : "Search categories..."}
              className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 pl-3.5 pr-10 border border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none transition-all"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTag("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTag === "all"
                  ? "bg-[#FF1F3D] text-white"
                  : "bg-[#F3F4F6] dark:bg-[#151C24] text-gray-600 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white"
              }`}
            >
              {isRTL ? "جميع الأقسام" : "All Categories"} ({CATEGORY_LIST.length})
            </button>

            <button
              onClick={() => setSelectedTag("featured")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedTag === "featured"
                  ? "bg-[#FF1F3D] text-white"
                  : "bg-[#F3F4F6] dark:bg-[#151C24] text-gray-600 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRTL ? "الأكثر طلباً" : "Featured"}</span>
            </button>

            <button
              onClick={() => setSelectedTag("masks")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedTag === "masks"
                  ? "bg-[#FF1F3D] text-white"
                  : "bg-[#F3F4F6] dark:bg-[#151C24] text-gray-600 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white"
              }`}
            >
              <span>🎭 {isRTL ? "ماسكات وأقنعة" : "Masks"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. CATEGORIES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {filteredCategories.length === 0 ? (
          <div className="bg-white dark:bg-[#0F151D] rounded-3xl p-12 text-center border border-gray-100 dark:border-[#1E2630] space-y-3">
            <p className="text-gray-400 dark:text-[#7F8A96] text-sm">
              {isRTL ? "لم نجد أي قسم يطابق بحثك." : "No categories match your search."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag("all");
              }}
              className="text-xs font-bold text-[#FF1F3D] hover:underline"
            >
              {isRTL ? "إعادة ضبط البحث" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/shop?category=${cat.id}`)}
                className="group cursor-pointer bg-white dark:bg-[#0F151D] rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-[#1E2630] overflow-hidden shadow-sm hover:shadow-2xl hover:border-gray-300 dark:hover:border-[#2E3A4A] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Overlay Header */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-[#0B0F14]">
                  <img
                    src={cat.image}
                    alt={isRTL ? cat.titleAr : cat.titleEn}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badge */}
                  {cat.badgeEn && (
                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                      {cat.isMask && <Ruler className="w-3 h-3 text-[#FF1F3D]" />}
                      <span>{isRTL ? cat.badgeAr : cat.badgeEn}</span>
                    </div>
                  )}

                  {/* Icon & Count on Image Bottom */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-white">
                    <span className="text-xl sm:text-2xl drop-shadow-md">{cat.icon}</span>
                    <span className="bg-[#FF1F3D] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md">
                      {countsMap[cat.id] ?? cat.count ?? 0} {isRTL ? "منتج" : "Items"}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between space-y-2">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-lg text-gray-900 dark:text-[#F5F7FA] group-hover:text-[#FF1F3D] transition-colors leading-tight">
                      {isRTL ? cat.titleAr : cat.titleEn}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#7F8A96] line-clamp-2 mt-1 leading-relaxed">
                      {isRTL ? cat.descAr : cat.descEn}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2 flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#FF1F3D] group-hover:translate-x-1 transition-transform">
                    <span>{isRTL ? "استكشف المنتجات" : "Explore Category"}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 4. CUSTOM ORDER PROMO BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-start">
            <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {isRTL ? "طلب خاص من MakerWorld" : "MakerWorld Custom Orders"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isRTL ? "ملقتش الكاتيجوري أو المجسم اللي بتدور عليه؟" : "Didn't find your design or category?"}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {isRTL
                ? "تقدر تجيب رابط أي مجسم من موقع MakerWorld.com أو ترفع صورتك ونطبعلك المقاس المطلوبة بخامة PLA العالية الجودة."
                : "You can easily paste any model link from MakerWorld.com or upload your design images for custom PLA 3D printing."}
            </p>
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="bg-white hover:bg-gray-100 text-[#FF1F3D] font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl transition-all shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FF1F3D]" />
            <span>{isRTL ? "صمم طلبك المخصص الآن" : "Customize Your Order Now"}</span>
          </button>
        </div>
      </div>

      {/* 5. Custom Order Modal Trigger */}
      <CustomDesignModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

    </div>
  );
}
