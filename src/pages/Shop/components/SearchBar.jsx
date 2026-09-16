import { Search } from "lucide-react";
import { useShopStore } from "../../../store/useShopStore";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const currentQuery = useShopStore((state) => state.filters.searchQuery);
  const setFilter = useShopStore((state) => state.setFilter);
  const [localQuery, setLocalQuery] = useState(currentQuery);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== currentQuery) {
        setFilter("searchQuery", localQuery);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localQuery, currentQuery, setFilter]);

  useEffect(() => {
    setLocalQuery(currentQuery);
  }, [currentQuery]);

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[#8C8C8C] group-focus-within:text-[#B08D57] transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="block w-48 pl-10 pr-3 py-2 border border-[#E8E2D8] rounded-full text-sm bg-transparent placeholder-[#8C8C8C] text-[#2B2B2B] focus:outline-none focus:border-[#B08D57] focus:ring-1 focus:ring-[#B08D57] transition-all"
      />
    </div>
  );
}
