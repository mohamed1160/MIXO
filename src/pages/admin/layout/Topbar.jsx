import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Bell, Menu, ArrowLeft, Store, ShieldCheck, Sun, Moon } from "lucide-react";
import { useAdminStore } from "../../../store/useAdminStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useTheme } from "../../../providers/ThemeContext";
import heroDragonImg from "../../../assets/images/3dprint/hero_dragon.jpg";

export default function Topbar({ mobileSidebarOpen, setMobileSidebarOpen, isMobile }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  
  const adminName = user ? `${user.firstName || "Admin"} ${user.lastName || ""}`.trim() : "Mixo Admin";
  const adminPhone = user?.phone || "01000000000";
  const { toggleSidebar } = useAdminStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/admin/orders?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 h-[76px] px-6 bg-white dark:bg-[#0F151D] border-b border-gray-100 dark:border-[#1E2630] font-sans transition-colors duration-200">
      
      {/* ── Left: Hamburger, Back button & Search ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors bg-gray-50 dark:bg-[#151C24] text-gray-700 dark:text-[#AAB4C0] hover:text-[#FF1F3D]"
          >
            <Menu size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors bg-gray-50 dark:bg-[#151C24] text-gray-700 dark:text-[#AAB4C0] hover:text-[#FF1F3D]"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Back to Previous Page */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gray-50 dark:bg-[#151C24] hover:bg-gray-100 dark:hover:bg-[#1C2530] text-gray-700 dark:text-[#F5F7FA] border border-gray-200 dark:border-[#26313D] transition-all shrink-0 cursor-pointer shadow-2xs"
          title="Go Back"
        >
          <ArrowLeft size={15} className="text-[#FF1F3D]" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-[400px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-[#7F8A96]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders, MakerWorld URLs, customers..."
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-[#151C24] text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-[#26313D] focus:outline-none focus:border-[#FF1F3D] transition-colors"
          />
        </form>
      </div>

      {/* ── Right: Theme, Return to Store & Profile ── */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Return to Store Button */}
        <Link
          to="/"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-[#FF1F3D] text-[#FF1F3D] hover:text-white rounded-xl text-xs font-bold border border-[#FF1F3D]/20 transition-all cursor-pointer shadow-xs"
        >
          <Store size={15} />
          <span>Return to Store</span>
        </Link>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#151C24] text-gray-700 dark:text-[#F5F7FA] border border-gray-200 dark:border-[#26313D] flex items-center justify-center transition-colors cursor-pointer"
        >
          {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-[#1E2630]">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#151C24] p-0.5 border-2 border-[#FF1F3D] shadow-xs overflow-hidden shrink-0">
            <img
              src={user?.avatar || heroDragonImg}
              alt={adminName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="hidden lg:flex flex-col text-xs leading-tight">
            <span className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1">
              <span>{adminName}</span>
              <ShieldCheck size={14} className="text-[#FF1F3D]" />
            </span>
            <span className="text-[10px] text-[#FF1F3D] font-bold uppercase tracking-wider mt-0.5">
              📞 {adminPhone}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
}