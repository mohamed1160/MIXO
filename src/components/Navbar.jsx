import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "../providers/LanguageContext";
import { useTheme } from "../providers/ThemeContext";
import { useShopStore } from "../store/useShopStore";
import { useAuthStore } from "../store/useAuthStore";
import mixoLogoImg from "../assets/images/logo/mixo_red_logo.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { lang, t, setLanguage, isRTL } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = isAuthenticated && user && (user.role === "admin" || user.phone === "01000000000" || user.email?.toLowerCase() === "admin@gmail.com");

  const wishlist = useShopStore((state) => state.wishlist);
  const cart = useShopStore((state) => state.cart);

  const wishlistCount = wishlist?.length || 0;
  const cartCount = cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  const navLinks = [
    { path: "/", label: t.nav.home },
    { path: "/shop", label: t.nav.shop },
    { path: "/custom-order", label: t.nav.customOrders },
    { path: "/track-order", label: isRTL ? "تتبع الطلب 🚚" : "Track Order 🚚" },
    { path: "/our-story", label: t.nav.aboutUs },
    { path: "/contact", label: t.nav.contact },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0B0F14] border-b border-gray-100 dark:border-[#1E2630] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          
          {/* Left: Hamburger menu & Logo */}
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1 text-gray-700 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white rounded-lg focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={mixoLogoImg}
                alt="Mixo Logo"
                className="h-9 sm:h-12 lg:h-13 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 ml-4 text-xs sm:text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors py-1 relative ${
                    isActive(link.path)
                      ? "text-black dark:text-white font-semibold"
                      : "text-gray-600 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF1F3D] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2 relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder || "Search for products..."}
              className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 dark:placeholder-[#7F8A96] text-xs sm:text-sm rounded-full py-2 pl-4 pr-10 border border-transparent dark:border-[#26313D] focus:border-gray-300 dark:focus:border-[#384656] focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7F8A96] hover:text-gray-700 dark:hover:text-white"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3.5">
            
            {/* Admin Dashboard Button (Only visible to Admin) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#FF1F3D] hover:bg-[#E01833] rounded-xl shadow-md transition-all shrink-0"
                title={isRTL ? "لوحة التحكم" : "Admin Dashboard"}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">{isRTL ? "لوحة التحكم" : "Admin Panel"}</span>
              </Link>
            )}

            {/* Mobile Search Icon Button */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-1 text-gray-700 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white"
              aria-label="Toggle Mobile Search"
            >
              <Search className="w-4.5 h-4.5 stroke-[1.8]" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-gray-700 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white p-1 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
              <span className="absolute -top-1 -right-1 bg-[#FF1F3D] text-white text-[9px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-gray-700 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white p-1 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
              <span className="absolute -top-1 -right-1 bg-[#FF1F3D] text-white text-[9px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            </Link>

            {/* Account */}
            <Link
              to="/account"
              className="text-gray-700 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white p-1 transition-colors"
              aria-label="Account"
            >
              <User className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
            </Link>

            {/* Language Switcher EN | AR */}
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-[#AAB4C0] pl-1 sm:pl-2 border-l border-gray-200 dark:border-[#1E2630]">
              <button
                onClick={() => setLanguage("en")}
                className={`transition-colors ${
                  lang === "en"
                    ? "font-bold text-black dark:text-white"
                    : "text-gray-400 dark:text-[#7F8A96] hover:text-black dark:hover:text-white"
                }`}
              >
                EN
              </button>
              <span className="text-gray-300 dark:text-[#26313D]">|</span>
              <button
                onClick={() => setLanguage("ar")}
                className={`transition-colors ${
                  lang === "ar"
                    ? "font-bold text-black dark:text-white"
                    : "text-gray-400 dark:text-[#7F8A96] hover:text-black dark:hover:text-white"
                }`}
              >
                AR
              </button>
            </div>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1 text-gray-600 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>
        </div>

        {/* Mobile Search Overlay Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden py-2 px-1 border-t border-gray-100 dark:border-[#1E2630] relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder || "Search for products..."}
                className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 dark:placeholder-[#7F8A96] text-xs rounded-full py-2 pl-4 pr-10 border border-transparent dark:border-[#26313D] focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7F8A96]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Slide-out Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start">
          <div className="w-4/5 max-w-sm bg-white dark:bg-[#0F151D] h-full p-5 flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#1E2630]">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img src={mixoLogoImg} alt="Mixo Logo" className="h-9 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-gray-500 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-1 py-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF1F3D]" />
                    <span>{isRTL ? "لوحة التحكم" : "Admin Dashboard"}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-gray-100 dark:bg-[#151C24] text-black dark:text-white font-semibold"
                      : "text-gray-700 dark:text-[#AAB4C0] hover:bg-gray-50 dark:hover:bg-[#151C24]/50"
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-[#1E2630] flex items-center justify-between text-xs sm:text-sm">
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-700 dark:text-[#AAB4C0] font-medium"
              >
                <User className="w-4.5 h-4.5 stroke-[1.8]" />
                <span>{t.nav.myAccount}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
