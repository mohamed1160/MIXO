import { useShopStore } from "../../../store/useShopStore";
import { cn } from "../../../lib/utils";

const categories = ["All", "T-Shirts", "Oversized", "Hoodies", "Accessories"];

export default function CategoryTabs() {
  const currentCategory = useShopStore((state) => state.filters.category);
  const setFilter = useShopStore((state) => state.setFilter);

  return (
    <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
      {categories.map((cat) => {
        const isSelected = currentCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => setFilter("category", cat)}
            className={cn(
              "whitespace-nowrap px-4 py-2 text-sm tracking-widest uppercase transition-all duration-300 border-b-2",
              isSelected
                ? "text-[#B08D57] border-[#B08D57] font-semibold"
                : "text-[#2B2B2B] border-transparent hover:text-[#B08D57]",
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
