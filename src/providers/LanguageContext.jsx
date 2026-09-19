import React, { createContext, useContext, useState, useEffect } from "react";

export const translations = {
  en: {
    brandName: "Mixo",
    tagline: "Ideas Into Reality",
    nav: {
      home: "Home",
      shop: "Shop",
      categories: "Categories",
      customOrders: "Custom Orders",
      aboutUs: "About Us",
      contact: "Contact",
      faq: "FAQ",
      searchPlaceholder: "Search for products...",
      myAccount: "My Account",
      wishlist: "Wishlist",
      cart: "Cart",
    },
    hero: {
      eyebrow: "CUSTOM 3D PRINTING",
      titleLine1: "Unique Designs.",
      titleLine2: "Real Products.",
      subtitle: "High-quality 3D printed products & custom models.",
      cta: "Shop Now",
      features: {
        quality: "High Quality Prints",
        fast: "Fast Shipping",
        custom: "Custom Orders",
      },
    },
    categories: {
      title: "Explore Categories",
      figures: "Figures & Collectibles",
      homeDecor: "Home Decor",
      phoneStands: "Phone Stands",
      tools: "Tools & Functional",
      vases: "Vases & Art",
      gaming: "Gaming",
      keychains: "Keychains",
      more: "More",
    },
    popular: {
      title: "Popular Products",
      subtitle: "Top rated 3D models & best sellers.",
      viewAll: "View All",
      addToCart: "Add to Cart",
      inCart: "In Cart",
      reviews: "reviews",
    },
    customBanner: {
      eyebrow: "CUSTOM PRINTING",
      title: "Custom 3D Printing",
      description: "Send us your 3D / STL file or idea and we will print it with precision.",
      cta: "Customize Order",
    },
    filamentsBanner: {
      eyebrow: "100% ECO PLA MATERIAL",
      title: "High-Grade Eco PLA Filament",
      description: "Durable, non-toxic, eco-friendly 100% PLA materials for smooth and detailed 3D prints.",
      cta: "Shop Filaments",
    },
    whyChooseUs: {
      title: "Why Choose Us?",
      subtitle: "Precision, durability and fast delivery.",
      f1Title: "Premium Quality",
      f1Desc: "Clean & durable prints",
      f2Title: "Fast Shipping",
      f2Desc: "Express doorstep delivery",
      f3Title: "Secure Payments",
      f3Desc: "Card, InstaPay & COD",
      f4Title: "24/7 Support",
      f4Desc: "Always here to help",
    },
    qna: {
      title: "Quick FAQ",
      subtitle: "Common questions about 3D printing & delivery.",
      q1: "What is 3D printing?",
      a1: "Layer-by-layer manufacturing turning digital CAD models into real physical products.",
      q2: "What materials do you use?",
      a2: "Premium PLA+, PETG, Resin, and flexible TPU depending on requirements.",
      q3: "How long does printing & shipping take?",
      a3: "Orders ship in 1-3 business days across Egypt.",
      q4: "Can I request a custom design?",
      a4: "Yes! Upload your STL/CAD file or idea on our Custom Orders page.",
      q5: "Can I send my own 3D model?",
      a5: "Yes, we accept STL, OBJ, 3MF, and STEP files.",
      q6: "What file formats do you accept?",
      a6: "STL, OBJ, 3MF, STEP, and IGES.",
      q7: "Are 3D printed items durable?",
      a7: "Yes, engineered with reinforced infill and high wall thickness.",
      q8: "How to care for PLA items?",
      a8: "Keep away from heat above 55°C and wipe clean with soft cloth.",
      q9: "Do you ship across Egypt?",
      a9: "Yes, express shipping to all governorates.",
      q10: "Can I choose custom color or scale?",
      a10: "Yes, select over 20+ PLA colors and custom sizes.",
    },
    footer: {
      about: "Ideas Into Reality",
      quickLinks: "Quick Links",
      customerService: "Customer Service",
      newsletter: "Newsletter",
      newsletterDesc: "Get the latest updates, new products and exclusive offers.",
      emailPlaceholder: "Your email address",
      subscribe: "Subscribe",
      rights: "© 2026 3DPrintHub. All rights reserved.",
      privacy: "Privacy",
      cookies: "Cookies",
      terms: "Terms",
    },
  },
  ar: {
    brandName: "3DPrintHub",
    tagline: "تحويل الأفكار إلى واقع",
    nav: {
      home: "الرئيسية",
      shop: "المتجر",
      categories: "الأقسام",
      customOrders: "طلبات خاصة",
      aboutUs: "من نحن",
      contact: "تواصل معنا",
      faq: "الأسئلة الشائعة",
      searchPlaceholder: "ابحث عن المنتجات...",
      myAccount: "حسابي",
      wishlist: "المفضلة",
      cart: "السلة",
    },
    hero: {
      eyebrow: "طباعة ثلاثية الأبعاد مخصصة",
      titleLine1: "تصاميم فريدة.",
      titleLine2: "منتجات حقيقية.",
      subtitle: "مجسمات 3D عالية الجودة وتصاميم مخصصة حسب طلبك.",
      cta: "تسوق الآن",
      features: {
        quality: "طباعة فائقة الدقة",
        fast: "شحن سريع",
        custom: "تصاميم مخصصة",
      },
    },
    categories: {
      title: "استكشف الأقسام",
      figures: "مجسمات ومقتنيات",
      homeDecor: "ديكور المنزل",
      phoneStands: "حوامل الهواتف",
      tools: "أدوات ومستلزمات",
      vases: "فازات وتحف فنية",
      gaming: "ألعاب وإكسسوارات",
      keychains: "ميداليات مفاتيح",
      more: "المزيد",
    },
    popular: {
      title: "الأكثر شعبية",
      subtitle: "المجسمات الأكثر مبيعاً وتقييماً.",
      viewAll: "عرض الكل",
      addToCart: "إضافة للسلة",
      inCart: "في السلة",
      reviews: "تقييم",
    },
    customBanner: {
      eyebrow: "طباعة مخصصة",
      title: "نفذ فكرتك 3D معنا",
      description: "أرسل لنا ملف الـ 3D / STL أو فكرتك وسنقوم بطباعتها لك بدقة.",
      cta: "طلب تصميم خاص",
    },
    filamentsBanner: {
      eyebrow: "خامة PLA 100% صديقة للبيئة",
      title: "أجود خامات الـ PLA الفاخرة",
      description: "نستخدم خامة PLA ناعمة وغير سامة وصديقة للبيئة تمتاز بصلابة فائقة ودقة عالية في طباعة المجسمات 3D.",
      cta: "تسوق الخامات",
    },
    whyChooseUs: {
      title: "لماذا تختارنا؟",
      subtitle: "دقة عالية، متانة، وتوصيل سريع.",
      f1Title: "جودة فائقة",
      f1Desc: "طباعة ناعمة ودقيقة",
      f2Title: "شحن سريع",
      f2Desc: "توصيل لجميع المحافظات",
      f3Title: "دفع آمن",
      f3Desc: "إنستا باي، كاش، وبطاقات",
      f4Title: "دعم متواصل",
      f4Desc: "جاهزون لمساعدتك دائماً",
    },
    qna: {
      title: "أسئلة شائعة",
      subtitle: "إجابات سريعة لأهم استفسارات الطباعة 3D.",
      q1: "ما هي الطباعة ثلاثية الأبعاد (3D Printing)؟",
      a1: "عملية تصنيع وبناء المجسمات طبقة تلو الأخرى من النماذج الرقمية باستخدام خامات متينة.",
      q2: "ما هي المواد المستخدمة؟",
      a2: "خامات مقواة مثل PLA+ و PETG و Resin حسب استخدام المنتج.",
      q3: "كم يستغرق التوصيل؟",
      a3: "تشحن الطلبات خلال 1 إلى 3 أيام عمل لجميع المحافظات.",
      q4: "هل يمكنني طلب تصميم خاص؟",
      a4: "نعم! ارفع ملفك أو فكرتك في صفحة الطلبات المخصصة.",
      q5: "هل يمكنني إرسال ملف 3D الخاص بي؟",
      a5: "نعم، نقبل ملفات STL, OBJ, 3MF, STEP.",
      q6: "ما هي صيغ الملفات المقبولة؟",
      a6: "نقبل ملفات STL, OBJ, 3MF, STEP, IGES.",
      q7: "هل المنتجات المطبوعة متينة؟",
      a7: "نعم، مصممة بحشو داخلي مقوى وسماكة عالية.",
      q8: "كيف أعتني بالمنتج المطبوع؟",
      a8: "تجنب تعريضه للحرارة الشديدة وتنظيفه بقطعة قماش ناعمة.",
      q9: "هل الشحن متوفر لجميع المحافظات؟",
      a9: "نعم، شحن سريع لكل محافظات مصر.",
      q10: "هل يمكنني طلب لون أو مقاس خاص؟",
      a10: "نعم، تتوفر ألوان عديدة ومقاسات قابلة للتعديل.",
    },
    footer: {
      about: "تحويل الأفكار إلى واقع",
      quickLinks: "روابط سريعة",
      customerService: "خدمة العملاء",
      newsletter: "النشرة البريدية",
      newsletterDesc: "احصل على آخر التحديثات، المنتجات الجديدة والعروض الحصرية.",
      emailPlaceholder: "عنوان بريدك الإلكتروني",
      subscribe: "اشتراك",
      rights: "© 2026 3DPrintHub. جميع الحقوق محفوظة.",
      privacy: "الخصوصية",
      cookies: "ملفات الكوكيز",
      terms: "الشروط والأحكام",
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("3dprinthub_lang") || "en";
  });

  const isRTL = lang === "ar";
  const dir = isRTL ? "rtl" : "ltr";
  const t = translations[lang] || translations.en;

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("3dprinthub_lang", lang);
  }, [lang, dir]);

  const setLanguage = (newLang) => {
    if (newLang === "en" || newLang === "ar") {
      setLang(newLang);
    }
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, isRTL, t, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
