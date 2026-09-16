import { useEffect, useRef, useState } from "react";

// ===== صور الكروت =====
// 👉 عدّل المسارات دي حسب مكان صورك الفعلي جوه src/assets
import poloMIXOImg from "../../../assets/images/collections/collection-1.PNG";
import modernMIXOImg from "../../../assets/images/collections/collection-2.PNG";
import ancientMIXOImg from "../../../assets/images/collections/collection-3.PNG";

// ===== أيقونات الكروت =====
// 👉 استورد أيقونة كل كارت هنا لو جاهزة (SVG/PNG)
import poloIcon from "../../../assets/images/hero/dividerLogo.PNG";
import modernIcon from "../../../assets/images/hero/dividerLogo.PNG";
import ancientIcon from "../../../assets/images/hero/dividerLogo.PNG";

// ===== أيقونات شريط المميزات =====
// 👉 استورد أيقونة كل ميزة هنا لو جاهزة
import premiumIcon from "../../../assets/icons/jewellary.png";
import ethicalIcon from "../../../assets/icons/paper.png";
import heritageIcon from "../../../assets/icons/key.png";
import shippingIcon from "../../../assets/icons/box.png";
import designIcon from "../../../assets/icons/Perfect.png";

/** Same lightweight scroll-reveal hook used in CollectionsHero. */
function useInView(threshold = 0.2) {
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

/* ------------------------------ World card ------------------------------ */

function WorldCard({ icon, image, title, description, ctaLabel, imageOnRight = true }) {
  const [ref, inView] = useInView(0.15);

  const textBlock = (
    <div className="flex flex-col justify-center px-8 py-10 sm:px-12 sm:py-14">
      {/* الأيقونة — بتتعرض لو اتبعت عن طريق الـ prop، وإلا بتفضل مساحة فاضية */}
      <div className="mb-5 h-8 w-8">
        {icon && <img src={icon} alt="" className="h-full w-full object-contain" />}
      </div>

      <h3 className="font-serif text-3xl tracking-wide text-[#2B1F14] sm:text-4xl">
        {title}
      </h3>
      <div className="my-5 flex items-center gap-3 text-[#B4893A]">
        <span className="h-px w-8 bg-[#B4893A]/60" />
        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current">
          <circle cx="12" cy="12" r="4" />
        </svg>
        <span className="h-px w-8 bg-[#B4893A]/60" />
      </div>
      <p className="max-w-sm text-[15px] leading-relaxed text-[#4A3B2C]">
        {description}
      </p>
      <button className="group mt-8 inline-flex w-fit items-center gap-3 border border-[#B4893A] px-7 py-3.5 text-xs font-medium tracking-widest text-[#8A6A28] transition-all duration-300 hover:bg-[#B4893A] hover:text-[#F5EFE3] hover:tracking-[0.2em]">
        {ctaLabel}
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
    </div>
  );

  const imageBlock = (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden bg-[#EFE6D4]">
      {image && (
        <img src={image} alt={title} className="h-full w-full object-cover" />
      )}
      {/* ضباب/تلاشي ناعم بين الصورة والنص — الاتجاه بيتغير حسب مكان الصورة */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: imageOnRight
            ? "linear-gradient(to right, #FAF6EC 0%, rgba(250,246,236,0) 45%)"
            : "linear-gradient(to left, #FAF6EC 0%, rgba(250,246,236,0) 45%)",
        }}
      />
    </div>
  );

  return (
    <div
      ref={ref}
      dir="ltr"
      className={`grid grid-cols-1 overflow-hidden border border-[#B4893A]/25 bg-[#FAF6EC] transition-all duration-1000 ease-out md:grid-cols-2 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      {imageOnRight ? (
        <>
          {textBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {textBlock}
        </>
      )}
    </div>
  );
}

/* --------------------------------- Main --------------------------------- */

// ===== بيانات الكروت =====
// 👉 عايز تزود كارت جديد؟ زوّد object جديد في المصفوفة دي وخلاص،
// مش محتاج تكتب أي JSX إضافي — الكروت بترندر تلقائي بالـ map تحت.
const collections = [
  {
    icon: poloIcon,
    image: poloMIXOImg,
    title: "POLO MIXO",
    description: "Classic silhouettes. Timeless elegance. Designed for everyday refinement.",
    ctaLabel: "EXPLORE POLO MIXO",
    imageOnRight: true,
  },
  {
    icon: modernIcon,
    image: modernMIXOImg,
    title: "MODERN MIXO",
    description: "Minimal by design. Bold by nature. For the modern dreamers.",
    ctaLabel: "EXPLORE MODERN MIXO",
    imageOnRight: false,
  },
  {
    icon: ancientIcon,
    image: ancientMIXOImg,
    title: "ANCIENT MIXO",
    description: "Echoes of the past. Power of symbols. Inspired by ancient Egypt.",
    ctaLabel: "EXPLORE ANCIENT MIXO",
    imageOnRight: true,
  },
];

const features = [
  {
    icon: premiumIcon,
    title: "PREMIUM QUALITY",
    desc: "Crafted with the finest materials.",
  },
  {
    icon: ethicalIcon,
    title: "ETHICALLY MADE",
    desc: "Responsibly sourced, consciously crafted.",
  },
  {
    icon: heritageIcon,
    title: "EGYPTIAN HERITAGE",
    desc: "Proudly inspired by our ancient roots.",
  },
  {
    icon: shippingIcon,
    title: "SECURE SHIPPING",
    desc: "Fast and secure delivery worldwide.",
  },
  {
    icon: designIcon,
    title: "TIMELESS DESIGN",
    desc: "Made to last beyond trends and seasons.",
  },
];

export default function CollectionsCards() {
  const [headingRef, headingInView] = useInView(0.4);
  const [featuresRef, featuresInView] = useInView(0.2);

  return (
    <section id="choose-your-world" className="bg-[#F5EFE3] px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div
          ref={headingRef}
          className={`mb-16 text-center transition-all duration-1000 ease-out ${
            headingInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="font-serif text-4xl tracking-wide text-[#2B1F14] sm:text-5xl">
            CHOOSE YOUR WORLD
          </h2>
          <div className="my-5 flex items-center justify-center gap-3 text-[#B4893A]">
            <span className="h-px w-8 bg-[#B4893A]/60" />
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current">
              <circle cx="12" cy="12" r="4" />
            </svg>
            <span className="h-px w-8 bg-[#B4893A]/60" />
          </div>
          <p className="text-[#4A3B2C]">
            Each collection is a chapter. Inspired by Egypt, crafted for the modern world.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-10">
          {collections.map((item) => (
            <WorldCard key={item.title} {...item} />
          ))}
        </div>

        {/* Features bar */}
        <div
          ref={featuresRef}
          className={`mt-16 grid grid-cols-2 gap-y-10 border border-[#B4893A]/25 bg-[#FAF6EC] px-6 py-10 transition-all duration-1000 ease-out sm:grid-cols-3 sm:px-10 md:grid-cols-5 ${
            featuresInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {features.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="flex flex-col items-center px-2 text-center transition-transform duration-300 hover:-translate-y-1"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="mb-3 h-15 w-15">
                {icon && <img src={icon} alt="" className="h-full w-full object-contain" />}
              </div>

              <p className="text-xs font-semibold tracking-wider text-[#2B1F14]">
                {title}
              </p>
              <p className="mt-1 max-w-[10rem] text-xs leading-relaxed text-[#4A3B2C]/80">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
