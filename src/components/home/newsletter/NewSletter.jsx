import { useState } from 'react'
import bgPattern from '../../../assets/images/backgrounds/joinSection.png'
import ankhIcon from '../../../assets/images/hero/hero-icons-3.PNG'

// TEMP placeholder — replace with your real icon once ready


export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 5000)
  }

  return (
    <section className="relative w-full bg-white py-8 lg:py-10 px-4 lg:px-10 overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto border border-[var(--color-gold-light)]/40 bg-[#FBF9F4] px-6 lg:px-12 py-7 lg:py-9 overflow-hidden">
        {/* Decorative background — full cover, single image (not tiled) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url(${bgPattern})`, opacity: 0.35 }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          {/* Left: Icon + Title + Subtitle */}
          <div className="flex items-center gap-4 lg:gap-5 text-center lg:text-left flex-col lg:flex-row">
            <div className="w-10 h-10 lg:w-25 lg:h-25 flex items-center justify-center flex-shrink-0">
              {ankhIcon ? (
                <img src={ankhIcon} alt="Ankh icon" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-[var(--color-gold-light)]/50 rounded-sm">
                  <span className="text-[0.55rem] text-[#B4AC98] uppercase tracking-wide">icon</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-['Cinzel'] text-[1.1rem] lg:text-[1.3rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-gold)]">
                Join the Legacy
              </h2>
              <p className="text-[0.75rem] lg:text-[0.8rem] text-[#6B6456] mt-1 max-w-[420px]">
                Subscribe to get special offers and early access to new collections.
              </p>
            </div>
          </div>

          {/* Right: Email Form */}
          <div className="w-full lg:w-auto max-w-[440px]">
            {subscribed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-sm text-center shadow-2xs">
                ✨ Thank you for subscribing to MIXO! Welcome to the Legacy.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full border border-[var(--color-gold-light)]/50"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 bg-white px-4 py-3 text-[0.8rem] text-[#1E1E1E] placeholder:text-[#A79E8C] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[var(--color-gold)] px-6 lg:px-7 py-3 text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-white whitespace-nowrap transition-colors duration-300 hover:bg-[var(--color-gold-dark)] cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
