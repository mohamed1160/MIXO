import { Link } from 'react-router-dom'
import heroBg from '../../../assets/images/hero/hero-bg.jpeg'
import dividerIcon from '../../../assets/images/hero/dividerLogo.PNG'
import logo from '../../../assets/images/logo/MIXO_logo.PNG'

/* ── HeroSection ─────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[var(--color-cream)] bg-center bg-cover bg-no-repeat overflow-hidden py-[32px] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(184,146,74,0.06)_0%,transparent_70%)] before:pointer-events-none" style={{ backgroundImage: `url(${heroBg})` }}>

      {/* ── Center Content ─────────────────────────────── */}
      <div className="relative z-[1] flex flex-col items-center text-center gap-0 px-6 sm:px-8 md:px-[var(--space-xl)] py-[var(--space-xl)]">

        {/* Brand Logo */}
        <img src={logo} alt="MIXO logo" className="w-[min(760px,85vw)] sm:w-[min(760px,80vw)] h-auto -mb-10 sm:-mb-16 md:-mb-[6rem] block" />

        {/* Tagline */}
        <p className="font-[family-name:var(--font-ui)] text-[clamp(0.85rem,2vw,1.05rem)] font-normal tracking-[0.2em] sm:tracking-[0.3em] text-[var(--color-gold)] uppercase leading-[1.8] -mt-5 sm:-mt-8 md:-mt-[3rem]">
          Ancient Soul.<br />Modern MIXO.
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center gap-[var(--space-md)] w-[200px] sm:w-[260px]">
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold-light)] to-transparent" />
          <span className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] flex items-center justify-center shrink-0">
            <img src={dividerIcon} alt="divider icon" className="w-full h-auto block" />
          </span>
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold-light)] to-transparent" />
        </div>

        {/* CTA Button */}
        <Link to="/collections" className="inline-block py-3 px-7 sm:py-[14px] sm:px-[40px] border-[1.5px] border-[var(--color-gold)] bg-transparent font-[family-name:var(--font-ui)] text-[0.65rem] sm:text-[0.7rem] font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[var(--color-gold-dark)] cursor-pointer transition-[background,color,box-shadow] duration-[0.35s] ease-[ease] mt-[var(--space-sm)] hover:bg-[var(--color-gold)] hover:text-[var(--color-white)] hover:shadow-[var(--shadow-gold)]">
          Discover the Collection
        </Link>
      </div>

      {/* ── Brand Values Strip ─────────────────────────── */}


    </section>
  )
}
