import { Link } from 'react-router-dom'
import { useState } from 'react'
import dividerIcon from '../../../assets/images/hero/dividerLogo.PNG'

// TEMP placeholders — replace `image` with your real product imports once assets are ready
// e.g. image: teeWhiteImg  (import teeWhiteImg from '../../../assets/images/products/tee-white.jpg')
const BEST_SELLERS = [
  { id: 'tee-white-1', name: 'OVERSIZE T-SHIRT', price: 899,  image: null, link: '/shop' },
  { id: 'tee-black-1', name: 'OVERSIZE T-SHIRT', price: 899,  image: null, link: '/shop' },
  { id: 'hoodie-1',    name: 'HOODIE',            price: 1299, image: null, link: '/shop' },
  { id: 'cap-1',       name: 'CAP',               price: 499,  image: null, link: '/shop' },
  { id: 'tee-beige-1', name: 'OVERSIZE T-SHIRT', price: 899,  image: null, link: '/shop' },
  { id: 'tee-black-2', name: 'OVERSIZE T-SHIRT', price: 899,  image: null, link: '/shop' },
]

import { useShopStore } from '../../../store/useShopStore';

function ProductCard({ product }) {
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const wishlist = useShopStore((state) => state.wishlist);
  const isWishlisted = wishlist.some(
    (item) => (typeof item === 'object' ? item.id : item) === product.id
  );

  return (
    <div className="group relative flex-shrink-0 w-[160px] sm:w-[190px] lg:w-full flex flex-col border border-[#E7E1D4] bg-white rounded-sm overflow-hidden shadow-2xs hover:shadow-md transition-shadow">
      {/* Wishlist Heart */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-2.5 right-2.5 z-10 w-6 h-6 flex items-center justify-center cursor-pointer"
        aria-label="Add to wishlist"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] transition-colors duration-200"
          fill={isWishlisted ? 'var(--color-gold)' : 'none'}
          stroke={isWishlisted ? 'var(--color-gold)' : '#C9C2B2'}
          strokeWidth="1.5"
        >
          <path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2 4.8 5.6 4.1c2-.4 3.9.6 5 2.2 1.1-1.6 3-2.6 5-2.2 3.6.7 5.1 4.3 3.6 7.6C19.5 16.4 12 21 12 21z" />
        </svg>
      </button>

      {/* Product Image */}
      <Link to="/shop" className="block aspect-square w-full flex items-center justify-center p-5">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F4F1EA] rounded-sm">
            <span className="text-[0.6rem] tracking-[0.1em] uppercase text-[#B4AC98] text-center px-2">
              image placeholder
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <Link to="/shop" className="px-3.5 pb-4 pt-1 flex flex-col gap-1">
        <span className="text-[0.68rem] lg:text-[0.72rem] tracking-[0.05em] uppercase text-[#3A3A3A]">
          {product.name}
        </span>
        <span className="text-[0.72rem] lg:text-[0.78rem] font-semibold text-[#1E1E1E]">
          EGP {product.price.toLocaleString()}
        </span>
      </Link>
    </div>
  )
}

export default function BestSellersSection() {
  return (
    <section className="relative w-full bg-white py-12 lg:py-16 px-4 lg:px-10">
      {/* Section Title */}
      <div className="flex flex-col items-center text-center mb-8 lg:mb-10">
        <Link to="/shop" className="group flex flex-col items-center">
          <h2 className="font-['Cinzel'] text-[1.4rem] lg:text-[1.9rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-gold)] group-hover:opacity-80 transition-opacity">
            Best Sellers
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

      {/* Mobile / Tablet: horizontal scroll row */}
      <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory scrollbar-hide">
        {BEST_SELLERS.map((product) => (
          <div key={product.id} className="snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Desktop: grid row */}
      <div className="hidden lg:grid grid-cols-6 gap-4 max-w-[1400px] mx-auto">
        {BEST_SELLERS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-10">
        <Link
          to="/shop"
          className="inline-block py-3 px-8 border border-[var(--color-gold)] text-[var(--color-gold)] font-bold text-[0.7rem] uppercase tracking-widest hover:bg-[var(--color-gold)] hover:text-white transition-all rounded-sm shadow-2xs"
        >
          View All Best Sellers
        </Link>
      </div>
    </section>
  )
}