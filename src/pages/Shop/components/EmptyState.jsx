import { motion } from "framer-motion";
import { useShopStore } from "../../../store/useShopStore";

export default function EmptyState() {
  const resetFilters = useShopStore((state) => state.resetFilters);

  return (
    <div className="w-full flex flex-col items-center justify-center py-32 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <div className="w-24 h-24 mb-6 rounded-full bg-[#FDFBF7] border border-[#E8E2D8] flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#B08D57]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-serif text-[#2B2B2B] mb-3">
          No products found
        </h3>
        <p className="text-sm text-[#8C8C8C] max-w-sm mb-8">
          We couldn't find any products matching your current filters. Please
          try adjusting your selection.
        </p>
        <button
          onClick={resetFilters}
          className="px-8 py-3 border border-[#2B2B2B] text-[#2B2B2B] text-sm uppercase tracking-widest hover:bg-[#2B2B2B] hover:text-white transition-colors duration-300 rounded-md"
        >
          Reset Filters
        </button>
      </motion.div>
    </div>
  );
}
