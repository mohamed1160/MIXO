// import React from 'react'
import JournalHero from '../../components/Journal/JournalHero'
import JournalCards from '../../components/Journal/JournalCards'
import { useSEO } from '../../hooks/useSEO'

export default function Journal() {
  // ── SEO ──
  useSEO();

  return (
    <div>
      <JournalHero />
      <JournalCards />
    </div>
  )
}
