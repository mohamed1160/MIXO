import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Printer,
  ShieldCheck,
  Zap,
  Ruler,
  CheckCircle2,
  Phone,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Award,
  Layers,
  Heart,
  Users,
} from "lucide-react";
import { useLanguage } from "../../providers/LanguageContext";
import mixoLogoImg from "../../assets/images/logo/mixo_red_logo.png";
import heroDragonImg from "../../assets/images/3dprint/hero_dragon.jpg";
import customVaseImg from "../../assets/images/3dprint/custom_vase.jpg";
import filamentImg from "../../assets/images/3dprint/filament_spools.jpg";
import CustomDesignModal from "../../components/CustomDesignModal";

export default function OurStory() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B10] text-gray-900 dark:text-[#F5F7FA] font-sans pb-24 transition-colors duration-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111823] via-[#0D131C] to-[#070B10] text-white py-16 sm:py-24 border-b border-[#1E2630]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF1F3D]/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            
            {/* Logo & Tag */}
            <div className="inline-flex items-center gap-2 bg-[#FF1F3D]/10 border border-[#FF1F3D]/30 text-[#FF1F3D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Printer className="w-4 h-4" />
              <span>{isRTL ? "عن ميكسو للطباعة ثلاثية الأبعاد" : "About Mixo 3D Print Hub"}</span>
            </div>

            <img
              src={mixoLogoImg}
              alt="Mixo Logo"
              className="h-16 sm:h-20 w-auto object-contain my-2"
            />

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {isRTL ? (
                <>
                  نحول الأفكار والرموز إلى <span className="text-[#FF1F3D]">واقع ملموس</span>
                </>
              ) : (
                <>
                  Transforming Ideas Into <span className="text-[#FF1F3D]">Tangible Reality</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-base text-gray-400 max-w-2xl leading-relaxed">
              {isRTL
                ? "ميكسو هي وجهتك الأولى في عالم الطباعة 3D. نقدم أدق التفاصيل بخامات PLA العالية الجودة، مع دعم تصميم الموديلات وتوفير المقاسات المخصصة للماسكات والأقنعة والمجسمات."
                : "Mixo is your premier destination for additive manufacturing & 3D printing. We craft high-precision models with premium PLA filaments and custom mask fitting options."}
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setIsCustomModalOpen(true)}
                className="bg-[#FF1F3D] hover:bg-[#E01833] text-white px-6 py-3 rounded-2xl shadow-lg shadow-red-600/25 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span>{isRTL ? "صمم طلبك الآن" : "Customize Your Order"}</span>
              </button>
              <Link
                to="/shop"
                className="bg-[#151C24] hover:bg-[#1E2630] border border-[#26313D] text-gray-200 px-6 py-3 rounded-2xl transition-all flex items-center gap-2"
              >
                <span>{isRTL ? "تصفح الكتالوج" : "Browse Catalog"}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-[#0F151D] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#1E2630] shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#FF1F3D]">1,200+</div>
            <div className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1 font-medium">
              {isRTL ? "طلب مخصص تم تسليمه" : "Custom Prints Delivered"}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#FF1F3D]">100%</div>
            <div className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1 font-medium">
              {isRTL ? "خامة PLA صديقة للبيئة" : "High-Quality Eco PLA"}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#FF1F3D]">4.9★</div>
            <div className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1 font-medium">
              {isRTL ? "تقييم عملاء ميكسو" : "Customer Satisfaction"}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#FF1F3D]">24/7</div>
            <div className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1 font-medium">
              {isRTL ? "تواصل وتحديد أسعار" : "Fast Price Quotes"}
            </div>
          </div>
        </div>
      </div>

      {/* 3. OUR STORY & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#1E2630]">
                <img
                  src={heroDragonImg}
                  alt="3D Printed Dragon"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#1E2630]">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                  alt="3D Printed Mask"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#1E2630]">
                <img
                  src={customVaseImg}
                  alt="Spiral Vase 3D Print"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#1E2630]">
                <img
                  src={filamentImg}
                  alt="Filament Spools"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Text Story */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-[#FF1F3D] font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{isRTL ? "قصتنا ورؤيتنا" : "Our Story & Vision"}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              {isRTL ? (
                <>
                  من مجرد مجسم رقمي إلى قطعة فنية <span className="text-[#FF1F3D]">بين يديك</span>
                </>
              ) : (
                <>
                  From Digital 3D Models to <span className="text-[#FF1F3D]">Masterpieces</span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-[#AAB4C0] leading-relaxed">
              {isRTL
                ? "تأسست ميكسو لتجسيد الشغف بالابتكار والتقنية الحديثة. نحن نؤمن بأن كل مجسم أو تصميم يحمل قصة خاصة؛ سواء كان ماسك كوزبلاي بمقاسات دائرية مضبوطة، أو مجسم تنين مفصلي، أو ديكور مكتبي راقي."
                : "Mixo was founded to blend innovation with high-precision manufacturing. We believe every 3D design tells a story — from custom-fitted cosplay masks to articulated dragon figures and modular office stands."}
            </p>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-[#AAB4C0] leading-relaxed">
              {isRTL
                ? "نحن نستخدم أحدث طابعات الـ 3D بخامة PLA العالية الجودة، ونتيح للعملاء إمكانية اختيار مجسماتهم من موقع MakerWorld.com أو رفع صورهم وتواصل فريقنا معهم مباشرة لتحديد الأسعار والمقاسات."
                : "We utilize state-of-the-art 3D printers with premium PLA filaments. Customers can easily pick models from MakerWorld.com or upload their images for instant consultation and pricing."}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-[#FF1F3D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                    {isRTL ? "جودة مضمونة" : "Guaranteed Quality"}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#7F8A96]">
                    {isRTL ? "فحص كل قطعة قبل الشحن" : "Hand inspected before shipping"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-[#FF1F3D] flex items-center justify-center shrink-0">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                    {isRTL ? "مقاسات دائرية" : "Circular Mask Fitting"}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#7F8A96]">
                    {isRTL ? "أبعاد خاصة للوجه والماسك" : "Custom face height & contour"}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. CORE VALUES / WHY CHOOSE MIXO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {isRTL ? "لماذا تختار ميكسو (Mixo)؟" : "Why Choose Mixo 3D Print Hub?"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#7F8A96]">
            {isRTL
              ? "نلتزم بأعلى معايير الدقة والسرعة لتوفير تجربة طباعة ثلاثية الأبعاد ممتازة."
              : "We commit to the highest standards of accuracy, speed, and material durability."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Printer,
              titleEn: "100% Premium PLA",
              titleAr: "خامة PLA عالية الجودة",
              descEn: "Non-toxic, eco-friendly filament providing rigid structure and fine surface resolution.",
              descAr: "خامة ناعمة وصديقة للبيئة تضمن متانة وجودة طبقات متميزة.",
            },
            {
              icon: ExternalLink,
              titleEn: "MakerWorld Integration",
              titleAr: "ربط كامل بـ MakerWorld",
              descEn: "Easily search MakerWorld.com, copy model links and submit them directly in your order.",
              descAr: "ابحث في موقع MakerWorld.com وانسخ رابط أي مجسم لطباعته فوراً.",
            },
            {
              icon: Ruler,
              titleEn: "Mask Fitting Options",
              titleAr: "أبعاد دائرية للماسك",
              descEn: "Specify face height & circular face contour in cm for perfectly fitting cosplay masks.",
              descAr: "تحديد ارتفاع الوجه والعرض الدائري بالسم لضمان مقاس مضبوط لكل ماسك.",
            },
            {
              icon: Phone,
              titleEn: "Personalized Price Quotes",
              titleAr: "تواصل شخصي لتحديد السعر",
              descEn: "Enter your phone number in custom order form for fast communication and price quotes.",
              descAr: "أدخل رقم تليفونك لنتواصل معك سريعاً ونحدد السعر والتفاصيل المناسبة.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#0F151D] rounded-3xl p-6 border border-gray-100 dark:border-[#1E2630] shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-[#2E3A4A] transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF1F3D]/10 text-[#FF1F3D] flex items-center justify-center font-bold">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                {isRTL ? item.titleAr : item.titleEn}
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#7F8A96] leading-relaxed">
                {isRTL ? item.descAr : item.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS / STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28">
        <div className="bg-gradient-to-r from-red-500/10 via-orange-500/5 to-red-500/10 dark:from-[#151C24] dark:to-[#0F151D] rounded-3xl p-8 sm:p-12 border border-red-500/20 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-[#FF1F3D] font-bold text-xs uppercase tracking-wider">
              {isRTL ? "خطوات الطلب المخصص" : "How Custom Order Works"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isRTL ? "كيف تطلب تصميمك الـ 3D من ميكسو؟" : "4 Simple Steps to Get Your 3D Print"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                titleEn: "Choose or Search Model",
                titleAr: "ابحث في MakerWorld",
                descEn: "Find your 3D design on MakerWorld.com or upload your design images.",
                descAr: "ادخل على MakerWorld.com أو ارفع صور الموديل اللي معاك.",
              },
              {
                step: "02",
                titleEn: "Provide Phone & Specs",
                titleAr: "أدخل تليفونك والأبعاد",
                descEn: "Enter your phone number and dimensions (Mask circular width or box length).",
                descAr: "أدخل رقم تليفونك والتفاصيل والأبعاد (أبعاد دائرية للماسك أو أبعاد عادية).",
              },
              {
                step: "03",
                titleEn: "We Contact You",
                titleAr: "نتواصل معك للسعر",
                descEn: "Our team contacts you on your phone number to give you exact price quote.",
                descAr: "يتواصل معك فريقنا هاتفياً لتأكيد السعر وميعاد التسليم.",
              },
              {
                step: "04",
                titleEn: "Precision Printing & Delivery",
                titleAr: "الطباعة والتسليم",
                descEn: "We print using high-grade PLA and ship directly to your door.",
                descAr: "نطبع الموديل بخامة PLA الفاخرة ونوصله حتى باب بيتك.",
              },
            ].map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-[#0F151D] p-5 rounded-2xl border border-gray-100 dark:border-[#1E2630] space-y-2 relative">
                <span className="text-2xl font-black text-[#FF1F3D]/30">{step.step}</span>
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                  {isRTL ? step.titleAr : step.titleEn}
                </h4>
                <p className="text-xs text-gray-500 dark:text-[#7F8A96] leading-relaxed">
                  {isRTL ? step.descAr : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROMO CTA BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-start">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {isRTL ? "جاهز لتحويل فكرتك إلى مجسم 3D؟" : "Ready to Bring Your 3D Idea to Life?"}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {isRTL
                ? "اضغط على زر صمم طلبك، ضع رابط MakerWorld أو ارفع صورك، وأدخل رقم تليفونك لنتواصل معك وتحديد السعر."
                : "Click Customize Order, paste your MakerWorld link or upload images, and we'll contact you with price quotes."}
            </p>
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="bg-white hover:bg-gray-100 text-[#FF1F3D] font-extrabold px-7 py-4 rounded-2xl text-xs sm:text-sm shadow-xl transition-all shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FF1F3D]" />
            <span>{isRTL ? "صمم طلبك المخصص الآن" : "Customize Your Order Now"}</span>
          </button>
        </div>
      </div>

      {/* 7. Custom Design Modal */}
      <CustomDesignModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

    </div>
  );
}
