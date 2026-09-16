import { useEffect, useRef, useState } from 'react'
import horizontalDivider from '../../../assets/images/hero/horizontal.PNG'

const heroIconModules = import.meta.glob('../../../assets/images/hero/hero-icons-*', { eager: true, import: 'default' })
const HERO_ICON_NAMES = [
  'hero-icons-1.PNG',
  'hero-icons-2.PNG',
  'hero-icons-3.PNG',
  'hero-icons-4.PNG',
]

const BRAND_VALUES = [
  { id: 'legacy',   lines: ['Inspired', 'by Legacy'],  desc: 'Fast & reliable delivery' },
  { id: 'pride',    lines: ['Crafted', 'with Pride'],  desc: 'Premium quality'           },
  { id: 'history',  lines: ['Wear Your', 'History'],   desc: 'Timeless designs'          },
  { id: 'standout', lines: ['Made to', 'Stand Out'],   desc: 'Uniquely you'              },
]

export default function BrandValuesSection() {
  const mobileGridRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = mobileGridRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative w-full bg-white shadow-[0_-16px_36px_-14px_rgba(0,0,0,0.5)]">
      {/* Scoped keyframes for mobile card reveal */}
      <style>{`
        @keyframes brandCardReveal {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .brand-card {
          opacity: 0;
        }
        .brand-card.is-visible {
          animation: brandCardReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* ── MOBILE FEATURES VIEW (< lg) ── 2x2 Grid of 4 Elevated Cards ── */}
      <div
        ref={mobileGridRef}
        className="block lg:hidden relative z-10 w-full max-w-[390px] mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-2 gap-3">
          {BRAND_VALUES.map((item, index) => {
            const iconName = HERO_ICON_NAMES[index]
            const iconSrc = heroIconModules[`../../../assets/images/hero/${iconName}`]

            return (
              <div
                key={item.id}
                className={`brand-card ${isVisible ? 'is-visible' : ''} relative bg-[#FBF9F5] rounded-xl border border-[#E7DFCF] p-4 flex flex-col items-center justify-center text-center shadow-[0_4px_14px_-6px_rgba(138,98,44,0.18)] active:scale-[0.97] transition-transform duration-200`}
                style={{ animationDelay: isVisible ? `${index * 0.12}s` : '0s' }}
              >
                <div className="w-14 h-14 flex items-center justify-center mb-2.5 rounded-full bg-white border border-[#E3D6BA] shadow-[0_2px_8px_-3px_rgba(183,133,61,0.35)]">
  {iconSrc && (
    <img
      src={iconSrc}
      alt={item.id}
      className="w-10 h-10 object-contain drop-shadow-[0_2px_5px_rgba(183,133,61,0.5)]"
    />
  )}
</div>

                <h3 className="font-['Cinzel'] text-[0.64rem] font-bold tracking-[0.13em] text-[#1E1E1E] uppercase leading-[1.4] max-w-[115px]">
                  {item.lines.join(' ')}
                </h3>

                <p className="text-[0.58rem] text-[#8A8A8A] mt-1 leading-[1.4]">
                  {item.desc}
                </p>

                <span className="w-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#B7853D] to-transparent mt-2.5 rounded-full" />
              </div>
            )
          })}
        </div>
      </div>

      {/* ── DESKTOP BRAND VALUES VIEW (>= lg) ── Horizontal Row, no dividers ── */}
      <div className="w-full">
        <div className="hidden lg:flex relative z-10 w-full px-8 xl:px-16 py-7 items-center justify-center gap-14 xl:gap-20">
          {BRAND_VALUES.map((item, index) => {
            const iconName = HERO_ICON_NAMES[index]
            const iconSrc = heroIconModules[`../../../assets/images/hero/${iconName}`]

            return (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-15 h-15 flex items-center justify-center drop-shadow-[0_2px_5px_rgba(183,133,61,1)] flex-shrink-0 text-[var(--color-gold-light)]">
                  {iconSrc ? (
                    <img src={iconSrc} alt={item.id} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[0.75rem] font-semibold uppercase text-[var(--color-text)]">Icon {index + 1}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-[var(--font-ui)] text-[0.72rem] font-bold tracking-[0.02em] uppercase text-[#1E1E1E] leading-[1.35]">
                    {item.lines[0]}
                  </span>
                  <span className="font-[var(--font-ui)] text-[0.72rem] font-bold tracking-[0.02em] uppercase text-[#1E1E1E] leading-[1.35]">
                    {item.lines[1]}
                  </span>
                  <span className="text-[0.68rem] text-[#8A8A8A] mt-1">
                    {item.desc}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Decorative Egyptian Horizontal Divider — cropped to remove built-in whitespace */}
        <div className="w-full h-[46px] lg:h-[68px] overflow-hidden relative z-10 leading-none">
          <img
            src={horizontalDivider}
            alt="Egyptian decorative horizontal border"
            className="absolute inset-0 w-full h-full object-cover object-center block"
          />
        </div>
      </div>
    </section>
  )
}