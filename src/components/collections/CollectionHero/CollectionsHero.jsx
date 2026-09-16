import { useEffect, useRef, useState } from "react";

// 👉 استورد صورة الخلفية هنا بدل ما تكتب المسار كـ string.
// عدّل المسار حسب مكان الصورة عندك في مجلد src/assets
import heroBg from "../../../assets/images/hero/CollectionsHero.PNG";
import MIXOEmblem from "../../../assets/images/hero/hero-icons-2.PNG";
import MIXOLine from "../../../assets/images/hero/hero-icons-4.PNG";

/**
 * Lightweight scroll-reveal hook — no external animation library needed.
 * Reveals its element once it enters the viewport.
 */
function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export default function CollectionsHero() {
  const [textRef, textInView] = useInView(0.3);

  return (
    <section className="relative min-h-[560px] h-screen w-full overflow-hidden">
      {/* ===== Full-width background image ===== */}
      <img
        src={heroBg}
        alt="MIXO collections"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay للموبايل: أقوى وبيغطي مساحة أكبر عشان النص يفضل واضح على الشاشات الصغيرة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE3]/95 via-[#F5EFE3]/80 to-[#F5EFE3]/55 sm:hidden" />

      {/* Overlay للتابلت والديسكتوب: خفيف ومحصور على الشمال بس عشان الصورة تفضل واضحة */}
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#F5EFE3] via-[#F5EFE3]/35 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 py-16 sm:px-10 sm:py-0 lg:px-16">
        <div
          ref={textRef}
          className={`w-full max-w-md transition-all duration-1000 ease-out sm:max-w-lg md:max-w-xl ${
            textInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* الأيقونة/الشعار */}
          <img
            src={MIXOEmblem}
            alt=""
            className="mb-4 h-12 w-auto sm:mb-6 sm:h-16 md:h-20 lg:h-24"
          />

          <h1 className="font-serif text-4xl leading-none tracking-wide text-[#B4893A] sm:text-5xl md:text-6xl lg:text-7xl">
            COLLECTIONS
          </h1>

          <div className="my-4 flex items-center gap-2 text-[#B4893A] sm:my-6 sm:gap-3">
            <span className="h-px w-7 bg-[#B4893A]/60 sm:w-10" />
            <img src={MIXOLine} alt="" className="h-6 w-auto sm:h-8" />
            <span className="h-px w-7 bg-[#B4893A]/60 sm:w-10" />
          </div>

          <p className="max-w-md text-base leading-relaxed text-[#4A3B2C] sm:text-lg">
            Ancient heritage, modern expression.
            <br />
            Three worlds. One identity.
          </p>

          <a
            href="#choose-your-world"
            className="group mt-6 inline-flex items-center gap-2 bg-[#B4893A] px-6 py-3 text-xs font-medium tracking-widest text-[#F5EFE3] transition-all duration-300 hover:bg-[#9C7530] hover:tracking-[0.25em] hover:shadow-lg hover:shadow-[#B4893A]/30 sm:mt-9 sm:gap-3 sm:px-8 sm:py-4 sm:text-sm"
          >
            EXPLORE ALL COLLECTIONS
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
