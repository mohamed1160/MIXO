import { useEffect, useRef, useState } from "react";

// ===== صورة الهيرو =====
// 👉 عدّل المسار حسب مكان الصورة عندك جوه src/assets
import journalHeroImg from "../../assets/images/Journal/HeroJournal.png";

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

export default function JournalHero() {
  const [textRef, textInView] = useInView(0.25);

  return (
    <section className="relative min-h-[560px] h-screen w-full overflow-hidden">
      {/* ===== Full-width background image ===== */}
      <img
        src={journalHeroImg}
        alt="The MIXO Journal"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay للموبايل: أقوى وبيغطي مساحة أكبر عشان النص يفضل واضح على الشاشات الصغيرة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE3]/70 via-[#F5EFE3]/40 to-[#F5EFE3]/70 sm:hidden" />

      {/* Overlay للتابلت والديسكتوب: خفيف عشان النص يفضل واضح في نص الصورة */}
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-b from-[#F5EFE3]/30 via-transparent to-[#F5EFE3]/30" />

      <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-5">
        <h1
          ref={textRef}
          className={`font-serif text-4xl tracking-wide text-white drop-shadow-[0_0_15px_rgba(190,156,92,0.8)] transition-all duration-1000 ease-out sm:text-6xl md:text-7xl ${
            textInView ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
        >
          The MIXO Journal
        </h1>
      </div>
    </section>
  );
}
