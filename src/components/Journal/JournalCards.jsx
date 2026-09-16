import { useEffect, useRef, useState } from "react";

// ===== صور الكروت =====
// 👉 عدّل المسارات دي حسب مكان صورك الفعلي جوه src/assets
// import card1Img from "../../assets/images/journal/embracing-slow-living.jpg";
// import card2Img from "../../assets/images/journal/crafted-with-purpose.jpg";
// import card3Img from "../../assets/images/journal/new-chapter-of-MIXO.jpg";
const card1Img = null;
const card2Img = null;
const card3Img = null;

// ===== أيقونات البادچ اللي فوق كل صورة =====
// 👉 استورد أيقونة كل تصنيف هنا لو جاهزة (SVG/PNG)
import lifestyleIcon from "../../assets/icons/paper.png";
import craftsmanshipIcon from "../../assets/icons/jewellary.png";
import inspirationIcon from "../../assets/icons/Perfect.png";

/** Same lightweight scroll-reveal hook used across the site. */
function useInView(threshold = 0.15) {
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

/* --------------------------------- Data --------------------------------- */

const filters = ["ALL", "LIFESTYLE", "STYLE", "CRAFTSMANSHIP", "INSPIRATION"];

// ===== بيانات الكروت =====
// 👉 عايز تزود بوست جديد؟ زوّد object جديد هنا وخلاص،
// مش محتاج تكتب أي JSX إضافي — الكروت بترندر تلقائي بالـ map تحت.
const posts = [
  {
    image: card1Img,
    badgeIcon: lifestyleIcon,
    category: "LIFESTYLE",
    date: "MAY 20, 2024",
    title: "Embracing the Art of Slow Living",
    description:
      "In a fast-paced world, slow living invites us to pause, breathe, and find beauty in the little things.",
  },
  {
    image: card2Img,
    badgeIcon: craftsmanshipIcon,
    category: "CRAFTSMANSHIP",
    date: "MAY 10, 2024",
    title: "Crafted with Purpose",
    description:
      "Behind every piece is a story of thoughtful design, skilled hands, and timeless quality.",
  },
  {
    image: card3Img,
    badgeIcon: inspirationIcon,
    category: "INSPIRATION",
    date: "APR 28, 2024",
    title: "A New Chapter of MIXO",
    description:
      "Our journey continues with a fresh perspective and a deep commitment to what matters.",
  },
];

/* ------------------------------ Journal card ------------------------------ */

function JournalCard({ image, badgeIcon, category, date, title, description }) {
  const [ref, inView] = useInView(0.15);

  return (
    <div
      ref={ref}
      className={`group flex flex-col transition-all duration-1000 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#EFE6D4]">
        {image && (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Badge icon */}
        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF6EC] shadow-sm">
          {badgeIcon && (
            <img src={badgeIcon} alt="" className="h-10 w-10 object-contain" />
          )}
        </div>
      </div>

      {/* Text */}
      <div className="pt-5">
        <p className="text-xs font-semibold tracking-wider text-[#B4893A]">
          {category} <span className="mx-1 text-[#B4893A]/60">•</span> {date}
        </p>

        <h3 className="mt-2 font-serif text-2xl text-[#2B1F14]">{title}</h3>

        <p className="mt-2 text-[15px] leading-relaxed text-[#4A3B2C]">
          {description}
        </p>

        <a
          href="#"
          className="group/link mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#B4893A] transition-colors duration-300 hover:text-[#9C7530]"
        >
          READ MORE
          <span className="transition-transform duration-300 group-hover/link:translate-x-1">
            →
          </span>
        </a>
      </div>
    </div>
  );
}

/* --------------------------------- Main --------------------------------- */

export default function JournalCards() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("LATEST");

  const visiblePosts =
    activeFilter === "ALL"
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  return (
    <section className="bg-[#F5EFE3] px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1600px]">
        {/* Filters + sort */}
        <div className="flex flex-col gap-6 border-b border-[#B4893A]/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:gap-8 sm:overflow-visible sm:whitespace-normal sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`relative shrink-0 pb-1 text-xs font-semibold tracking-widest transition-colors duration-300 ${
                  activeFilter === f
                    ? "text-[#B4893A] after:absolute after:-bottom-[25px] after:left-0 after:h-[2px] after:w-full after:bg-[#B4893A]"
                    : "text-[#4A3B2C]/70 hover:text-[#8A6A28]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative w-fit">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-3 border border-[#B4893A]/40 px-4 py-2 text-xs font-semibold tracking-widest text-[#4A3B2C] transition-colors duration-300 hover:border-[#B4893A]"
            >
              {sortLabel}
              <span
                className={`transition-transform duration-300 ${
                  sortOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {sortOpen && (
              <div className="absolute right-0 z-10 mt-2 w-36 border border-[#B4893A]/20 bg-[#FAF6EC] shadow-md">
                {["LATEST", "OLDEST", "A–Z"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortLabel(opt);
                      setSortOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-xs tracking-widest text-[#4A3B2C] transition-colors duration-200 hover:bg-[#EFE6D4]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cards grid */}
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <JournalCard key={post.title} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}
