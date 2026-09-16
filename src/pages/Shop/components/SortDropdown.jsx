import { useShopStore } from "../../../store/useShopStore";

const sortOptions = [
  "Featured",
  "Newest",
  "Highest Rated",
  "Best Selling",
  "Price Low → High",
  "Price High → Low",
  "Alphabetical A-Z",
  "Alphabetical Z-A",
];

export default function SortDropdown() {
  const sort = useShopStore((state) => state.sort);
  const setSort = useShopStore((state) => state.setSort);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-[#8C8C8C] hidden sm:inline-block">
        Sort by:
      </span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="bg-transparent border border-[#E8E2D8] text-[#2B2B2B] text-sm rounded-md focus:ring-[#B08D57] focus:border-[#B08D57] block w-full py-2 px-3 outline-none cursor-pointer appearance-none pr-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238C8C8C' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
        }}
      >
        {sortOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
