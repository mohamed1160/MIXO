import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  PenTool,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLanguage } from "../../providers/LanguageContext";
import { useTheme } from "../../providers/ThemeContext";
import { getProducts, mapCategoryToId } from "../../services/products";
import ProductCard from "../../components/ProductCard";
import ArtifactCard from "../../components/ArtifactCard";
import ThreeDPhotoCarousel from "../../components/ui/3d-carousel";
import Skiper49 from "../../components/ui/skiper49";
import { useSEO } from "../../hooks/useSEO";
import JsonLd, { buildWebSiteSchema, buildFAQSchema } from "../../components/seo/JsonLd";
import { SITE_URL, SITE_NAME } from "../../config/seo";

// Assets
import spidermanHero from "../../assets/deadpool/spiderman-hero.webp";
import spidermanHanging from "../../assets/deadpool/spiderman-hanging.webp";
import spidermanIcon from "../../assets/deadpool/spiderman-icon.webp";
import maskIcon from "../../assets/deadpool/mask-icon.svg";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { t, isRTL, lang } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // ── SEO ──
  useSEO();

  // ── State ──
  const [allProducts, setAllProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("MIXO_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            id: p.id || `prod-${Math.random()}`,
            title: p.name || p.title,
            name: p.name || p.title,
            image: p.image || p.images?.[0] || "",
            images: p.images?.length ? p.images : [p.image || ""],
            price: Number(p.price) || 0,
            originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
            rating: p.rating || 0,
            reviewCount: p.reviewCount || p.reviewsCount || 0,
            reviewsCount: p.reviewsCount || p.reviewCount || 0,
            category: p.category || "Figures & Collectibles",
            categoryId: p.categoryId || mapCategoryToId(p.category),
            description: p.description || "",
            material: p.material || "PLA Plus",
            isPopular: false,
            isBestSeller: p.isBestSeller || false,
            stock: p.inStock !== false ? 10 : 0,
            inStock: p.inStock !== false,
          }));
        }
      }
    } catch (e) {}
    return [];
  });
  const [activePopularFilter, setActivePopularFilter] = useState("masks");
  const [isLoading, setIsLoading] = useState(() => allProducts.length === 0);
  const [activeFaq, setActiveFaq] = useState(null);

  // ── Refs for GSAP ──
  const mainWrapperRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroCircleRef = useRef(null);
  const heroTitleBoxRef = useRef(null);
  const deadpoolHeroImgRef = useRef(null);
  const stitchBeltRef = useRef(null);

  const transitionSectionRef = useRef(null);
  const whiteRevealRef = useRef(null);
  const maskSphereRef = useRef(null);
  const scrubTextRef = useRef(null);

  const infoSectionRef = useRef(null);
  const infoCardRef = useRef(null);

  const theatersSectionRef = useRef(null);
  const deadpoolHeartImgRef = useRef(null);
  const crosshairBgRef = useRef(null);
  const theatersContentRef = useRef(null);

  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  // ── Load Products Data ──
  const loadData = async () => {
    if (allProducts.length === 0) setIsLoading(true);
    try {
      const allData = await getProducts({ sort: "popular", limit: 30 });
      if (allData && allData.length > 0) {
        setAllProducts(allData);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const getCatId = (p) => {
      const cId = p.categoryId ? String(p.categoryId).toLowerCase() : "";
      if (cId) return cId;
      return mapCategoryToId(p.category || "").toLowerCase();
    };

    if (activePopularFilter === "masks") {
      const customMasksOrder = localStorage.getItem("MIXO_popular_masks_order");
      if (customMasksOrder) {
        try {
          const orderedIds = JSON.parse(customMasksOrder);
          if (Array.isArray(orderedIds) && orderedIds.length > 0) {
            const productMap = new Map(allProducts.map((p) => [String(p.id), p]));
            const customList = [];
            orderedIds.forEach((id) => {
              const prod = productMap.get(String(id));
              if (prod) customList.push(prod);
            });
            if (customList.length > 0) {
              return customList.slice(0, 8);
            }
          }
        } catch (e) {
          console.error("Error parsing custom popular masks order:", e);
        }
      }

      const filtered = allProducts.filter((p) => {
        const catId = getCatId(p);
        const catRaw = String(p.category || "").toLowerCase();
        return p.isMask || catId === "masks" || catRaw.includes("mask") || catRaw.includes("أقنعة") || catRaw.includes("ماسكات");
      });
      return filtered.slice(0, 8);
    }

    if (activePopularFilter === "gaming") {
      const filtered = allProducts.filter((p) => {
        const catId = getCatId(p);
        const catRaw = String(p.category || "").toLowerCase();
        return catId === "gaming" || catRaw.includes("gaming") || catRaw.includes("ألعاب") || catRaw.includes("جيمينج");
      });
      return filtered.slice(0, 8);
    }

    if (activePopularFilter === "keychains") {
      const filtered = allProducts.filter((p) => {
        const catId = getCatId(p);
        const catRaw = String(p.category || "").toLowerCase();
        return catId === "keychains" || catId === "keychain" || catRaw.includes("keychain") || catRaw.includes("ميدال") || catRaw.includes("تعليق") || catRaw.includes("مفتاح");
      });
      return filtered.slice(0, 8);
    }

    if (activePopularFilter === "others") {
      const filtered = allProducts.filter((p) => {
        const catId = getCatId(p);
        const catRaw = String(p.category || "").toLowerCase();
        const isMask = p.isMask || catId === "masks" || catRaw.includes("mask") || catRaw.includes("أقنعة") || catRaw.includes("ماسكات");
        const isGaming = catId === "gaming" || catRaw.includes("gaming") || catRaw.includes("ألعاب") || catRaw.includes("جيمينج");
        const isKeychain = catId === "keychains" || catId === "keychain" || catRaw.includes("keychain") || catRaw.includes("ميدال") || catRaw.includes("تعليق") || catRaw.includes("مفتاح");
        return !isMask && !isGaming && !isKeychain;
      });
      return filtered.slice(0, 8);
    }

    return allProducts.slice(0, 8);
  }, [allProducts, activePopularFilter]);

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

  // ── Lenis & GSAP ScrollTrigger Integration ──
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    let lenis = null;
    let updateLenis = null;

    if (!isMobile) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });

      updateLenis = (time) => {
        lenis.raf(time * 1000);
      };

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    }

    // Custom Cursor Motion
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    let xDot, yDot, xRing, yRing;
    if (dot && ring) {
      xDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
      yDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
      xRing = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" });
      yRing = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" });
    }

    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return;
      if (xDot) {
        xDot(e.clientX);
        yDot(e.clientY);
        xRing(e.clientX);
        yRing(e.clientY);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── SECTION 1: HERO LOAD ANIMATIONS ──
    if (deadpoolHeroImgRef.current) {
      gsap.set(deadpoolHeroImgRef.current, { xPercent: -50, yPercent: -50 });
    }

    const chars = heroTitleBoxRef.current?.querySelectorAll(".char-inner");
    if (chars && chars.length > 0) {
      const heroTL = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTL
        .to(heroCircleRef.current, {
          scale: 1,
          duration: 1.4,
          ease: "back.out(1.4)",
        }, 0.2)
        .to(chars, {
          y: "0%",
          duration: 1.2,
          stagger: 0.05,
        }, 0.4)
        .to(deadpoolHeroImgRef.current, {
          y: 0,
          xPercent: -50,
          yPercent: -50,
          duration: 1.5,
          ease: "back.out(1.2)",
        }, 0.6)
        .from(".hero-marquee-wrap, .hero-right-label, .hero-bottom-bar", {
          opacity: 0,
          y: 20,
          duration: 1,
          stagger: 0.1,
          clearProps: "all",
        }, 1.0);
    }

    // ── SECTION 1: HERO SCROLL SCRUB (60FPS GPU ACCELERATED) ──
    if (heroSectionRef.current) {
      const isMobile = window.innerWidth < 768;
      gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: isMobile ? "+=65%" : "bottom top",
          scrub: isMobile ? 0.3 : 1,
          pin: true,
          pinSpacing: true,
        },
      })
      .set(heroTitleBoxRef.current, { zIndex: 2 }, 0)
      .to(heroTitleBoxRef.current, { scale: isMobile ? 4.0 : 2.2, y: isMobile ? -35 : -20, force3D: true, transformOrigin: "center center", ease: "power2.out" }, 0)
      .set(heroTitleBoxRef.current, { zIndex: 20 }, 0.1)
      .to(deadpoolHeroImgRef.current, { y: isMobile ? 30 : 50, xPercent: -50, yPercent: -50, scale: isMobile ? 1.05 : 1.05, opacity: 0.9, force3D: true, ease: "power1.inOut" }, 0)
      .to(heroCircleRef.current, { scale: isMobile ? 1.8 : 1.3, opacity: 0.7, ease: "none" }, 0)
      .to(stitchBeltRef.current, { x: "-25%", opacity: 0.2, ease: "none" }, 0);
    }

    // ── SECTION 2: TRANSITION TO WHITE & STAGGERED RED TEXT ──
    if (transitionSectionRef.current) {
      const getScrubXTarget = () => {
        if (window.innerWidth >= 1024) return "-45%";
        if (!scrubTextRef.current) return "-82%";
        const totalWidth = scrubTextRef.current.scrollWidth;
        const screenW = window.innerWidth;
        const overflow = totalWidth - screenW;
        if (overflow > 0) {
          return `${-(overflow + 40)}px`;
        }
        return "-82%";
      };

      const transitionTL = gsap.timeline({
        scrollTrigger: {
          trigger: transitionSectionRef.current,
          start: "top top",
          end: window.innerWidth < 768 ? "+=220%" : "+=150%",
          scrub: 1,
          pin: true,
        },
      });

      transitionTL
        .to(maskSphereRef.current, { scale: 18, opacity: 0, duration: 1 }, 0)
        .to(whiteRevealRef.current, { clipPath: "circle(150% at 50% 50%)", duration: 1 }, 0)
        .to(scrubTextRef.current, { x: getScrubXTarget, ease: "none", duration: 1.5 }, 0.5);

      const marqueeChars = scrubTextRef.current?.querySelectorAll(".marquee-char");
      if (marqueeChars && marqueeChars.length > 0) {
        transitionTL.to(
          marqueeChars,
          {
            color: "#c8102e",
            stagger: 0.04,
            ease: "power1.inOut",
            duration: 0.2,
          },
          0.6
        );
      }
    }

    // ── SECTION 3: INFO CARD REVEAL ──
    if (infoSectionRef.current) {
      gsap.timeline({
        scrollTrigger: {
          trigger: infoSectionRef.current,
          start: "top 70%",
          end: "top 20%",
          scrub: 1,
        },
      })
      .to(infoCardRef.current, { y: 0, scale: 1, opacity: 1, duration: 1 });

      const lines = infoSectionRef.current.querySelectorAll(".line-reveal-inner");
      lines.forEach((el) => {
        gsap.to(el, {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }

    // ── SECTION 4: SCROLL SCRUB (PARALLAX) ──
    if (theatersSectionRef.current) {
      const isMobile = window.innerWidth < 768;

      const theatersTL = gsap.timeline({
        scrollTrigger: {
          trigger: theatersSectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      if (theatersContentRef.current) {
        gsap.set(theatersContentRef.current, { opacity: 0.5 });
        theatersTL.to(theatersContentRef.current, { opacity: 1, duration: 0.2 }, 0);
      }

      if (deadpoolHeartImgRef.current) {
        gsap.set(deadpoolHeartImgRef.current, { y: isMobile ? 150 : 260 });
        theatersTL.to(deadpoolHeartImgRef.current, { y: isMobile ? -180 : -320, ease: "none", duration: 1 }, 0);
      }

      if (crosshairBgRef.current) {
        gsap.set(crosshairBgRef.current, { scale: 0.8, rotation: -45, opacity: 0.5 });
        theatersTL.to(crosshairBgRef.current, { scale: 1.1, rotation: 45, opacity: 1, ease: "none", duration: 1 }, 0);
      }
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Top 4 Mixo Categories
  const categoriesList = [
    {
      id: "masks",
      name: isRTL ? "أقنعة ومقنعات" : "3D Masks",
      fullName: isRTL ? "أقنعة ودروع سينمائية" : "Cinematic Masks & Wearables",
      icon: "🎭",
    },
    {
      id: "figures",
      name: isRTL ? "مجسمات أنمي ومارفل" : "Figures",
      fullName: isRTL ? "مجسمات ومقتنيات ثلاثية الأبعاد" : "3D Figures & Collectibles",
      icon: "🐉",
    },
    {
      id: "decor",
      name: isRTL ? "ديكورات وتصاميم" : "Home Decor",
      fullName: isRTL ? "ديكورات ثلاثية الأبعاد فاخرة" : "Premium 3D Home Decor",
      icon: "🪴",
    },
    {
      id: "tools",
      name: isRTL ? "أجزاء وتعديلات" : "Custom Parts",
      fullName: isRTL ? "أجزاء مخصصة وهندسية" : "Custom Engineering Parts",
      icon: "⚙️",
    },
  ];

  // Quick FAQ Items
  const qnaItems = [
    {
      q: isRTL ? "ما هو استوديو MIXO؟" : "What is MIXO?",
      a: isRTL
        ? "ميكسو (MIXO) هو الاستوديو الرائد في الطباعة ثلاثية الأبعاد، متخصص في تحويل الأفكار والأقنعة السينمائية والمجسمات الفاخرة إلى منتجات حقيقية فائقة الجودة."
        : "MIXO is the premier studio specializing in turning ideas, cinematic masks, and figures into high-precision physical products.",
    },
    {
      q: isRTL ? "كيف يمكنني طلب تصميم خاص من MIXO؟" : "How can I request a custom design from MIXO?",
      a: isRTL
        ? "يمكنك الانتقال لصفحة 'طلب خاص' ورفع ملف الـ STL أو كتابة فكرتك، وسيقوم فريق MIXO بطباعتها بدقة وتوصيلها لك خلال 5 إلى 7 أيام."
        : "Go to Custom Order page, upload your STL file or idea, and MIXO team will print it with precision and ship it within 5-7 days.",
    },
  ];

  // Structured Data for SEO
  const websiteSchema = useMemo(() => buildWebSiteSchema(SITE_URL, SITE_NAME), []);
  const faqSchema = useMemo(() => buildFAQSchema(qnaItems), [lang]);

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-[#c8102e] selection:text-white" ref={mainWrapperRef}>
      {/* SEO Structured Data */}
      <JsonLd data={websiteSchema} />
      <JsonLd data={faqSchema} />

      {/* Custom Cursor (Hidden on Mobile) */}
      <div id="cursor-dot" ref={cursorDotRef} className="hidden md:block fixed top-0 left-0 w-2 h-2 bg-[#c8102e] rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 transition-all duration-100" />
      <div id="cursor-ring" ref={cursorRingRef} className="hidden md:block fixed top-0 left-0 w-10 h-10 border border-[#c8102e]/60 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-200" />

      {/* Decorative Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[2]">
        <div className="absolute top-0 bottom-0 left-[8vw] w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 bottom-0 right-[8vw] w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-[18vh] left-[calc(8vw-5px)] font-mono text-xs text-[#c8102e]/70">+</div>
        <div className="absolute top-[18vh] right-[calc(8vw-5px)] font-mono text-xs text-[#c8102e]/70">+</div>
        <div className="absolute bottom-[12vh] left-[calc(8vw-5px)] font-mono text-xs text-[#c8102e]/70">+</div>
        <div className="absolute bottom-[12vh] right-[calc(8vw-5px)] font-mono text-xs text-[#c8102e]/70">+</div>
      </div>

      {/* ========================================================================== */}
      {/* SECTION 1 – HERO (MIXO BRANDING ONLY WITH SPIDER-MAN IMAGE)               */}
      {/* ========================================================================== */}
      <section className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden flex flex-col justify-between p-[6rem_4vw_3rem_4vw] z-30" ref={heroSectionRef} id="hero">
        
        {/* Top MIXO Marquee */}
        <div className="hero-marquee-wrap w-full overflow-hidden mt-4 relative z-20 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="flex whitespace-nowrap gap-12 font-sans text-xs font-bold tracking-[0.35em] uppercase text-white/80 animate-[marqueeScroll_25s_linear_infinite]">
            <span>MIXO</span> <span className="w-1.5 h-1.5 bg-[#c8102e] rounded-full inline-block" />
            <span>CUSTOM 3D MASKS</span> <span className="w-1.5 h-1.5 bg-[#c8102e] rounded-full inline-block" />
            <span>SPECIAL SPIDER-MAN EDITION</span> <span className="w-1.5 h-1.5 bg-[#c8102e] rounded-full inline-block" />
            <span>ANIMATION & FIGURES</span> <span className="w-1.5 h-1.5 bg-[#c8102e] rounded-full inline-block" />
            <span>MIXO</span> <span className="w-1.5 h-1.5 bg-[#c8102e] rounded-full inline-block" />
            <span>FAST EGYPT SHIPPING</span> <span className="w-1.5 h-1.5 bg-[#c8102e] rounded-full inline-block" />
          </div>
        </div>

        {/* Right Label */}
        <div className="hero-right-label hidden md:block absolute top-[35%] right-[3vw] font-sans text-xs font-extrabold tracking-[0.4em] uppercase rotate-90 origin-right text-white/40 z-20">
          MIXO 2026
        </div>

        {/* Center Visual Assembly */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] h-[70vh] flex items-center justify-center z-5">
          {/* Solid Red Circle */}
          <div ref={heroCircleRef} className="absolute w-[min(460px,42vw)] h-[min(460px,42vw)] bg-[#c8102e] rounded-full z-1 scale-0 shadow-[0_0_80px_rgba(200,16,46,0.4)]" />

          {/* Giant Title Box - MIXO ONLY (GPU Accelerated Smooth Zoom) */}
          <div className="relative text-center w-full select-none pointer-events-none flex flex-col items-center justify-center">
            <div className="font-display text-[clamp(1.5rem,3vw,2.8rem)] tracking-[0.5em] text-[#c8102e] -mb-3 font-extrabold [text-shadow:_0_4px_12px_rgba(0,0,0,0.9)] relative z-2">
              SPECIAL SPIDER-MAN EDITION
            </div>
            <h1
              ref={heroTitleBoxRef}
              className="font-display text-[clamp(7rem,25vw,30rem)] leading-[0.82] tracking-[-0.01em] text-white uppercase whitespace-nowrap flex justify-center overflow-hidden w-[110%] -ml-[5%] [text-shadow:_0_15px_40px_rgba(0,0,0,0.95)] relative z-2 will-change-transform transform-gpu"
            >
              {"MIXO".split("").map((char, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span className="char-inner inline-block translate-y-[105%]">{char}</span>
                </span>
              ))}
            </h1>
          </div>

          {/* Spider-Man Cutout Overlay - Always Centered on Mobile & Desktop */}
          <img
            ref={deadpoolHeroImgRef}
            src={spidermanHero}
            alt="Spider-Man 3D Mask Edition"
            fetchpriority="high"
            decoding="async"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[68vh] md:h-[82vh] max-h-[850px] z-4 pointer-events-none filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] object-contain"
          />

          {/* Diagonal Stitch Belt */}
          <div ref={stitchBeltRef} className="hidden sm:flex absolute top-[58%] -left-[20%] w-[140%] h-[48px] bg-[#141414]/90 border-y-2 border-dashed border-[#c8102e] -rotate-7 z-3 items-center gap-12 overflow-hidden pointer-events-none opacity-85 shadow-2xl">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-6 font-mono text-xs tracking-[0.2em] text-white whitespace-nowrap">
                <img src={spidermanIcon} alt="Spider-Man Icon" className="w-6 h-6 rounded-full object-cover" />
                <span>MIXO · SPIDER-MAN EDITION · CUSTOM STL PRINTING</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="hero-bottom-bar flex justify-between items-end w-full z-[9999] relative">
          <div className="flex flex-col gap-3 sm:gap-4 relative z-[9999]">
            <div className="font-sans font-black text-xs sm:text-sm tracking-[0.3em] text-white flex items-center gap-2 drop-shadow-md">
              <span className="text-white font-black">MIXO</span>
              <span className="w-10 h-[1.5px] bg-[#c8102e]" />
            </div>

            {/* Mobile & Desktop Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 relative z-[9999]">
              <Link to="/shop" className="relative z-[9999]">
                <button className="font-sans text-[11px] sm:text-xs font-black tracking-[0.15em] sm:tracking-[0.25em] uppercase px-4 sm:px-7 py-2.5 sm:py-3.5 bg-white text-black hover:bg-gray-100 hover:-translate-y-0.5 border-none rounded-full cursor-pointer transition-all shadow-[0_8px_30px_rgba(255,255,255,0.4)] flex items-center gap-1.5 sm:gap-2 active:scale-95 relative z-[9999]">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                  <span>{isRTL ? "تسوق الآن" : "SHOP NOW"}</span>
                </button>
              </Link>
              <Link to="/custom-order" className="relative z-[9999]">
                <button className="font-sans text-[11px] sm:text-xs font-black tracking-[0.15em] sm:tracking-[0.25em] uppercase px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white/15 hover:bg-white/30 text-white border border-white/40 rounded-full cursor-pointer transition-all flex items-center gap-1.5 sm:gap-2 backdrop-blur-md shadow-lg active:scale-95 relative z-[9999]">
                  <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8102e]" />
                  <span>{isRTL ? "طلب تصميم خاص" : "CUSTOM PRINT"}</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================== */}
      {/* SECTION 2 – TRANSITION & MARQUEE                                           */}
      {/* ========================================================================== */}
      <section className="relative w-full h-screen bg-[#0a0a0a] dark:bg-[#07090c] overflow-hidden flex items-center justify-center z-20" ref={transitionSectionRef} id="transition">
        {/* White / Dark Reveal Layer */}
        <div ref={whiteRevealRef} className="absolute inset-0 bg-white dark:bg-[#0e121a] [clip-path:circle(0%_at_50%_50%)] z-1 transition-colors duration-300" />

        {/* Expanding Mask Sphere */}
        <div ref={maskSphereRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 w-[120px] h-[120px] z-2 pointer-events-none">
          <img src={maskIcon} alt="Mask Icon" className="w-full h-full" />
        </div>

        {/* Giant Marquee Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <div className="w-full whitespace-nowrap overflow-hidden">
            <div ref={scrubTextRef} className="font-display text-[clamp(4.5rem,12vw,14rem)] leading-[0.9] uppercase inline-block tracking-[-0.02em] whitespace-nowrap px-8 select-none">
              {"MIXO MAKES HEROES REAL".split("").map((char, index) => (
                <span
                  key={index}
                  className="marquee-char inline-block text-black dark:text-white transition-colors duration-150"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Side Markers */}
        <div className="absolute left-[4vw] top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-black dark:text-white z-15">02</div>
        <div className="absolute right-[4vw] top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-black dark:text-white z-15">03</div>
      </section>

      {/* ========================================================================== */}
      {/* SECTION 3 – MIXO CATEGORIES & LIVE PRODUCTS                               */}
      {/* ========================================================================== */}
      <section className="relative w-full min-h-screen bg-white dark:bg-[#07090c] text-black dark:text-white p-[8rem_6vw] flex flex-col items-center justify-between z-25 transition-colors duration-300" ref={infoSectionRef} id="info">
        <div className="text-center max-w-[900px]">
          <h2 className="font-sans text-[clamp(1.8rem,4vw,3.4rem)] font-black tracking-tight uppercase leading-[1.15] text-black dark:text-white mb-6">
            {isRTL ? "MIXO: حول أفكارك لمنتجات حقيقية!" : "MIXO: TURN YOUR IDEAS INTO REAL PRODUCTS!"}
          </h2>
          <div className="flex justify-center gap-6 text-xl text-[#c8102e] dark:text-[#ff2e4d]">
            <span>←</span>
            <span>→</span>
          </div>
        </div>

        {/* Centered Black Card */}
        <div ref={infoCardRef} className="w-[min(380px,90vw)] bg-[#0a0a0a] dark:bg-[#12151c] text-white rounded-2xl p-10 text-center my-12 shadow-2xl relative translate-y-[60px] scale-[0.92] opacity-80 transition-transform border border-transparent dark:border-white/10">
          <img src={spidermanIcon} alt="Spider-Man Icon" className="w-12 h-12 mx-auto mb-4 rounded-full object-cover" />
          <div className="font-mono text-xs tracking-[0.3em] text-[#c8102e] dark:text-[#ff2e4d] uppercase mb-1.5">MIXO</div>
          <div className="font-display text-5xl tracking-wider">MIXO</div>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-[1100px] mt-8">
          <div className="flex flex-col gap-3">
            <div className="font-sans text-xs font-extrabold tracking-[0.25em] uppercase text-[#c8102e] dark:text-[#ff2e4d] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#c8102e] dark:bg-[#ff2e4d] rounded-full" />
              <span>{isRTL ? "جودة MIXO الفائقة" : "MIXO QUALITY"}</span>
            </div>
            <div className="overflow-hidden font-mono text-xs leading-relaxed text-[#333] dark:text-gray-300 uppercase">
              <p className="line-reveal-inner translate-y-full opacity-0">
                {isRTL
                  ? "تستخدم MIXO خامات PLA صديقة للبيئة فائقة الجودة لضمان أعلى متانة ودقة تفاصيل سينمائية ممتازة لكافة الأقنعة والمجسمات."
                  : "MIXO USES PREMIUM ECO-FRIENDLY PLA MATERIALS FOR MAXIMUM DURABILITY, ULTRA-FINE LAYER RESOLUTION, AND HAND-FINISHED CINEMATIC DETAIL ACROSS ALL MASKS AND FIGURES."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="font-sans text-xs font-extrabold tracking-[0.25em] uppercase text-[#c8102e] dark:text-[#ff2e4d] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#c8102e] dark:bg-[#ff2e4d] rounded-full" />
              <span>{isRTL ? "طباعة مخصصة وتوصيل" : "CUSTOM PRINTING & DELIVERY"}</span>
            </div>
            <div className="overflow-hidden font-mono text-xs leading-relaxed text-[#333] dark:text-gray-300 uppercase">
              <p className="line-reveal-inner translate-y-full opacity-0">
                {isRTL
                  ? "ارفع أي ملف STL 3D أو فكرة تصميم خاصة. تقوم MIXO بطباعة طلبك وتوصيله لباب منزلك خلال 5 إلى 7 أيام عمل في جميع المحافظات."
                  : "UPLOAD ANY STL 3D FILE OR CUSTOM DESIGN IDEA. MIXO CRAFTS AND SHIPS YOUR CUSTOM ORDERS DIRECTLY TO YOUR DOORSTEP IN 5 TO 7 BUSINESS DAYS ACROSS ALL GOVERNORATES."}
              </p>
            </div>
          </div>
        </div>



        {/* MIXO POPULAR PRODUCTS GRID – MOST POPULAR 3D ARTIFACTS */}
        <div className="w-full max-w-[1250px] mt-16 pt-10 border-t border-gray-200 dark:border-white/10">
          
          {/* Header Title Block */}
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl sm:text-5xl font-black text-black dark:text-white uppercase tracking-wider">
              {isRTL ? "الأكثر شعبية" : "MOST POPULAR"}
            </h2>
            <h2 className="font-display text-3xl sm:text-5xl font-black italic text-[#ff1f3d] tracking-wider drop-shadow-[0_0_20px_rgba(255,31,61,0.5)] mt-1">
              {isRTL ? "مقتنيات 3D" : "3D ARTIFACTS"}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-gray-500 dark:text-gray-400 mt-3 font-medium tracking-wide">
              {isRTL ? "أقنعة ومجسمات ميكسو المطبوعة بدقة فائقة 3D" : "Precision 3D printed wearable cowls & mechanical gear"}
            </p>
          </div>

          {/* Category Filter Pills (Monochrome Black & White) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-4 relative z-10 px-4">
            <button
              onClick={() => setActivePopularFilter("masks")}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activePopularFilter === "masks"
                  ? "text-black bg-white border-2 border-white shadow-xl shadow-white/10 scale-105"
                  : "text-gray-400 hover:text-white bg-[#0f1219] border border-white/20 hover:border-white/50 backdrop-blur-md"
              }`}
            >
              {isRTL ? "أقنعة" : "MASKS"}
            </button>
            <button
              onClick={() => setActivePopularFilter("gaming")}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activePopularFilter === "gaming"
                  ? "text-black bg-white border-2 border-white shadow-xl shadow-white/10 scale-105"
                  : "text-gray-400 hover:text-white bg-[#0f1219] border border-white/20 hover:border-white/50 backdrop-blur-md"
              }`}
            >
              {isRTL ? "ألعاب وجيمينج" : "GAMING"}
            </button>
            <button
              onClick={() => setActivePopularFilter("keychains")}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activePopularFilter === "keychains"
                  ? "text-black bg-white border-2 border-white shadow-xl shadow-white/10 scale-105"
                  : "text-gray-400 hover:text-white bg-[#0f1219] border border-white/20 hover:border-white/50 backdrop-blur-md"
              }`}
            >
              {isRTL ? "ميداليات" : "KEYCHAINS"}
            </button>
            <button
              onClick={() => setActivePopularFilter("others")}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activePopularFilter === "others"
                  ? "text-black bg-white border-2 border-white shadow-xl shadow-white/10 scale-105"
                  : "text-gray-400 hover:text-white bg-[#0f1219] border border-white/20 hover:border-white/50 backdrop-blur-md"
              }`}
            >
              {isRTL ? "منتجات أخرى" : "OTHERS"}
            </button>
          </div>

          {/* Open 3D Carousel Wrapper (No Dark Container Box) */}
          <div className="relative z-10 w-full mt-4">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-[#0f1219] rounded-2xl h-80 animate-pulse border border-[#ff1f3d]/20" />
                ))}
              </div>
            ) : (
              <Skiper49 key={activePopularFilter} products={displayedProducts} />
            )}
          </div>

        </div>

        {/* Rotating Disc Badge */}
        <div className="absolute bottom-12 right-[4vw] w-[90px] h-[90px] rounded-full border border-black/15 dark:border-white/20 flex items-center justify-center">
          <img src={spidermanIcon} alt="Rotating Disc" className="w-[50px] h-[50px] rounded-full object-cover animate-[spinDisc_18s_linear_infinite]" />
          <span className="absolute -bottom-6 font-mono text-xs font-bold text-black dark:text-white">03</span>
        </div>
      </section>

      {/* ========================================================================== */}
      {/* SECTION 4 – MIXO STORE & GRADUAL NATURAL SCROLL                          */}
      {/* ========================================================================== */}
      <section className="relative w-full min-h-screen bg-white dark:bg-[#07090c] text-black dark:text-white overflow-hidden flex flex-col items-center justify-between p-[6rem_4vw_4rem_4vw] z-30 transition-colors duration-300" ref={theatersSectionRef} id="theaters">
        
        {/* Inner Wrapper for Smooth Natural Scroll Entrance */}
        <div ref={theatersContentRef} className="w-full h-full flex flex-col items-center justify-between relative z-10">
          <div className="font-sans text-xs font-black tracking-[0.4em] uppercase text-[#c8102e] dark:text-[#ff2e4d] z-10">MIXO</div>

          <div className="text-center z-10 relative mt-4">
            <h2 className="font-display text-[clamp(6rem,22vw,28rem)] leading-[0.82] tracking-[-0.01em] text-black dark:text-white uppercase">
              MIXO
            </h2>
            <div className="font-sans text-[clamp(0.9rem,2.2vw,1.6rem)] font-black tracking-[0.4em] text-black dark:text-gray-200 mt-2">
              {isRTL ? "طباعة ثلاثية الأبعاد مخصصة وتوصيل سريع" : "CUSTOM 3D PRINTING & DELIVERIES"}
            </div>
          </div>

          {/* Center Visual Assembly */}
          <div className="relative w-full max-w-[1200px] h-[65vh] flex items-end justify-center z-5 my-6">
            <div
              ref={crosshairBgRef}
              className="absolute w-[min(520px,82vw)] h-[min(520px,82vw)] sm:w-[min(520px,50vw)] sm:h-[min(520px,50vw)] border-2 border-dashed border-black/35 dark:border-white/40 rounded-full bottom-[10%] sm:bottom-[5%] flex items-center justify-center z-1 animate-[spin_20s_linear_infinite] pointer-events-none before:absolute before:w-full before:h-[1px] before:bg-black/20 dark:before:bg-white/20 after:absolute after:h-full after:w-[1px] after:bg-black/20 dark:after:bg-white/20"
            />
            <img
              ref={deadpoolHeartImgRef}
              src={spidermanHanging}
              alt="MIXO Spider-Man Hanging"
              className="relative h-[72vh] max-h-[750px] z-4 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] object-contain"
            />
          </div>

          {/* Side Text Codes */}
          <div className="absolute bottom-24 left-[5vw] font-mono text-xs font-bold tracking-[0.25em] text-gray-400 dark:text-gray-500 z-10 hidden md:block">MIXO</div>
          <div className="absolute bottom-24 right-[5vw] font-mono text-xs font-bold tracking-[0.25em] text-gray-400 dark:text-gray-500 z-10 hidden md:block">EST 2026</div>

          {/* CTAs */}
          <div className="z-20 flex flex-col sm:flex-row items-center gap-4 mb-4">
            <Link to="/shop">
              <button className="px-8 py-3.5 bg-[#c8102e] text-white hover:bg-[#e61c38] transition-all rounded-full font-sans text-xs font-black tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>{isRTL ? "تصفح MIXO" : "EXPLORE MIXO"}</span>
              </button>
            </Link>
            <Link to="/custom-order">
              <button className="px-8 py-3.5 bg-black dark:bg-[#12151c] text-white hover:bg-slate-800 dark:hover:bg-[#181e2b] transition-all rounded-full font-sans text-xs font-black tracking-widest uppercase border border-black/30 dark:border-white/20 shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#c8102e] dark:text-[#ff2e4d]" />
                <span>{isRTL ? "طلب تصميم خاص" : "CUSTOM 3D ORDER"}</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick MIXO FAQ Section */}
      <section className="bg-white dark:bg-[#07090c] text-black dark:text-white py-16 px-6 border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black uppercase text-black dark:text-white">{isRTL ? "أسئلة شائعة عن MIXO" : "MIXO FAQ"}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{isRTL ? "إجابات سريعة حول الشحن والطباعة الثلاثية الأبعاد." : "Quick answers about 3D printing & delivery."}</p>
          </div>

          <div className="space-y-4">
            {qnaItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-gray-50 dark:bg-[#12151c] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#c8102e] dark:text-[#ff2e4d]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200/60 dark:border-white/10 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
