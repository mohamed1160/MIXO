import { Link } from 'react-router-dom'
import dividerIcon from '../../../assets/images/hero/dividerLogo.PNG'

// TEMP placeholders — replace `image` with your real imports once assets are ready
import poloImg from '../../../assets/images/collections/testProduct-1.png'
import modernImg from'../../../assets/images/collections/testProduct-2.png'
import ancientImg from'../../../assets/images/collections/testProduct-3.png'

const COLLECTIONS = [
  { id: 'polo',    title: 'ANCIENT',    image: poloImg, link: '/collections/polo' },
  { id: 'modern',  title: 'MODERN',  image: modernImg, link: '/collections/modern' },
  { id: 'ancient', title: 'POLO', image: ancientImg, link: '/collections/ancient' },
]

export default function FeaturedCollectionsSection() {
  return (
    <section className="relative z-10  bg-white py-12 lg:py-16 px-4 lg:px-10 border border-transparent">
      {/* Section Title */}
      <div className="flex flex-col items-center text-center mb-8 lg:mb-10">
        <Link to="/collections" className="group flex flex-col items-center">
          <h2 className="font-['Cinzel'] text-[1.4rem] lg:text-[1.9rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-gold)] group-hover:opacity-80 transition-opacity">
            Featured Collections
          </h2>

          <div className="mt-3 flex items-center gap-2 w-[110px]">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-gold-light)] to-transparent" />
            <span className="flex h-4 w-4 items-center justify-center flex-shrink-0">
              <img src={dividerIcon} alt="divider icon" className="w-full h-auto object-contain" />
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-gold-light)] to-transparent" />
          </div>
        </Link>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-[980px] mx-auto">
        {COLLECTIONS.map((item) => (
          <Link
            key={item.id}
            to="/collections"
            className="group relative aspect-square overflow-hidden rounded-sm block"
          >
            {/* Image (or temp placeholder until real assets are added) */}
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#D9CFC0] transition-transform duration-500 group-hover:scale-105">
                <span className="font-[var(--font-ui)] text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[#7A6E5B] text-center px-4">
                  {item.title}<br />(image placeholder)
                </span>
              </div>
            )}

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            {/* Text Content */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center pb-4 lg:pb-6 px-3">
              <h3 className="font-[var(--font-ui)] text-[0.78rem] lg:text-[1rem] font-semibold tracking-[0.1em] uppercase text-[var(--color-gold)] mb-1.5">
                {item.title}
              </h3>

              <span className="flex flex-col items-center gap-1">
                <span className="text-[0.6rem] lg:text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-white/95">
                  Shop Now
                </span>
                <svg
                  className="w-3.5 h-2 lg:w-4 lg:h-2.5 text-white/95 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 12"
                  fill="none"
                >
                  <path d="M0 6H23M23 6L18 1M23 6L18 11" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}