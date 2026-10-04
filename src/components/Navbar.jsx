import React, { useState, useEffect } from "react";
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

/* Pages that start with a dark hero section */
const DARK_HERO_PAGES = [
  "/",
  "/our-story",
  "/about",
  "/about-us",
  "/aboutus",
  "/contact",
  "/login",
  "/register",
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGlassy, setIsGlassy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { lang, t, setLanguage, isRTL } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const { user, isAuthenticated } = useAuthStore();
  const isAdmin =
    isAuthenticated &&
    user &&
    (user.role === "admin" ||
      user.phone === "01000000000" ||
      user.email?.toLowerCase() === "admin@gmail.com");

  const wishlist = useShopStore((state) => state.wishlist);
  const cart = useShopStore((state) => state.cart);

  const wishlistCount = wishlist?.length || 0;
  const cartCount =
    cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  const isDarkHeroPage = DARK_HERO_PAGES.some((p) =>
    p === "/" ? location.pathname === "/" : location.pathname.startsWith(p)
  );

  /* ── Precision Scroll Listener ── */
  useEffect(() => {
    if (!isDarkHeroPage) {
      setIsGlassy(true);
      return;
    }

    if (location.pathname === "/login" || location.pathname === "/register") {
      setIsGlassy(false);
      return;
    }

    const checkScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

      // Always 100% white transparent at the top
      if (scrollY < 50) {
        setIsGlassy(false);
        return;
      }

      // Home page: stays white until reaching the white section (#info)
      if (location.pathname === "/") {
        const infoEl = document.getElementById("info");
        if (infoEl) {
          const rect = infoEl.getBoundingClientRect();
          setIsGlassy(rect.top <= 70);
        } else {
          setIsGlassy(scrollY > window.innerHeight * 1.3);
        }
        return;
      }

      // About Us / Our Story: stays white until touching the headline
      if (
        ["/our-story", "/about", "/about-us", "/aboutus"].some((p) =>
          location.pathname.startsWith(p)
        )
      ) {
        const headlineEl =
          document.getElementById("story-headline") ||
          document.getElementById("story-stats-section");
        if (headlineEl) {
          const rect = headlineEl.getBoundingClientRect();
          setIsGlassy(rect.top <= 70);
        } else {
          setIsGlassy(scrollY > 280);
        }
        return;
      }

      // Contact: stays white until touching contact cards
      if (location.pathname.startsWith("/contact")) {
        const contactCards = document.getElementById("contact-cards-section");
        if (contactCards) {
          const rect = contactCards.getBoundingClientRect();
          setIsGlassy(rect.top <= 70);
        } else {
          setIsGlassy(scrollY > 280);
        }
        return;
      }

      setIsGlassy(scrollY > 400);
    };

    checkScroll();

    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [isDarkHeroPage, location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

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

  /* ── Dynamic classes & inline colors based on state ── */
  const isTransparent = isDarkHeroPage && !isGlassy;

  const headerClass = isTransparent
    ? "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent border-b border-white/15 shadow-none"
    : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-[#0a0a0a]/85 backdrop-blur-[28px] border-b border-gray-200/50 dark:border-white/10 shadow-lg";

  // Explicit inline style for bulletproof pure white text
  const textStyle = isTransparent ? { color: "#ffffff" } : {};

  return (
    <>
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            {/* Left: Hamburger menu & Logo */}
            <div className="flex items-center gap-2 sm:gap-6">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                style={textStyle}
                className={`lg:hidden p-1 rounded-lg focus:outline-none transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/80"
                    : "text-black dark:text-white hover:text-[#ff1f3d]"
                }`}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </button>

              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src={mixoLogoImg}
                  alt="Mixo Logo"
                  className="h-9 sm:h-11 lg:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6 ml-4 text-xs sm:text-sm">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={textStyle}
                      className={`transition-colors py-1 relative ${
                        isTransparent
                          ? active
                            ? "text-white font-bold"
                            : "text-white font-medium hover:text-white/80"
                          : active
                          ? "text-black dark:text-white font-bold"
                          : "text-gray-800 dark:text-white font-medium hover:text-[#ff1f3d]"
                      }`}
                    >
                      <span style={textStyle}>{link.label}</span>
                      {active && (
                        <span
                          style={{
                            backgroundColor: isTransparent
                              ? "#ffffff"
                              : isDark
                              ? "#ffffff"
                              : "#000000",
                          }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}
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
                style={isTransparent ? { color: "#ffffff" } : {}}
                className={`w-full text-xs sm:text-sm rounded-full py-2 pl-4 pr-10 border transition-all focus:outline-none ${
                  isTransparent
                    ? "bg-white/10 text-white placeholder-white/70 border-white/25 focus:border-white/60 focus:bg-white/15 backdrop-blur-md"
                    : "bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-white placeholder-gray-400 border-transparent dark:border-[#26313D] focus:border-gray-300 dark:focus:border-[#384656]"
                }`}
              />
              <button
                type="submit"
                style={textStyle}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/80"
                    : "text-gray-500 dark:text-[#7F8A96] hover:text-black dark:hover:text-white"
                }`}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5 sm:gap-3.5">
              {/* Admin Dashboard Button */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#FF1F3D] hover:bg-[#E01833] rounded-xl shadow-md transition-all shrink-0"
                  title={isRTL ? "لوحة التحكم" : "Admin Dashboard"}
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline text-white">
                    {isRTL ? "لوحة التحكم" : "Admin Panel"}
                  </span>
                </Link>
              )}

              {/* Mobile Search Icon Button */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                style={textStyle}
                className={`md:hidden p-1 transition-colors ${
                  isTransparent
                    ? "text-white"
                    : "text-black dark:text-white hover:text-[#ff1f3d]"
                }`}
                aria-label="Toggle Mobile Search"
              >
                <Search className="w-4.5 h-4.5 stroke-[2]" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                style={textStyle}
                className={`relative p-1 transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/80"
                    : "text-black dark:text-white hover:text-[#ff1f3d]"
                }`}
                aria-label="Wishlist"
              >
                <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2]" />
                <span
                  className={`absolute -top-1 -right-1 text-[9px] font-black w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-sm ${
                    isTransparent
                      ? "bg-white text-black"
                      : "bg-[#FF1F3D] text-white"
                  }`}
                >
                  {wishlistCount}
                </span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                style={textStyle}
                className={`relative p-1 transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/80"
                    : "text-black dark:text-white hover:text-[#ff1f3d]"
                }`}
                aria-label="Cart"
              >
                <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2]" />
                <span
                  className={`absolute -top-1 -right-1 text-[9px] font-black w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-sm ${
                    isTransparent
                      ? "bg-white text-black"
                      : "bg-[#FF1F3D] text-white"
                  }`}
                >
                  {cartCount}
                </span>
              </Link>

              {/* Account */}
              <Link
                to="/account"
                style={textStyle}
                className={`p-1 transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/80"
                    : "text-black dark:text-white hover:text-[#ff1f3d]"
                }`}
                aria-label="Account"
              >
                <User className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2]" />
              </Link>

              {/* Language Switcher EN | AR */}
              <div
                style={textStyle}
                className={`flex items-center gap-1 text-[11px] sm:text-xs font-bold pl-1 sm:pl-2 border-l ${
                  isTransparent
                    ? "text-white border-white/30"
                    : "text-black dark:text-white border-gray-300 dark:border-[#26313D]"
                }`}
              >
                <button
                  onClick={() => setLanguage("en")}
                  style={textStyle}
                  className={`transition-colors ${
                    lang === "en"
                      ? "font-black underline underline-offset-4"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  EN
                </button>
                <span className={isTransparent ? "text-white/40" : "text-gray-400"}>
                  |
                </span>
                <button
                  onClick={() => setLanguage("ar")}
                  style={textStyle}
                  className={`transition-colors ${
                    lang === "ar"
                      ? "font-black underline underline-offset-4"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  AR
                </button>
              </div>

              {/* Theme Switcher Toggle */}
              <button
                onClick={toggleTheme}
                style={textStyle}
                className={`p-1 transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/80"
                    : "text-black dark:text-white hover:text-[#ff1f3d]"
                }`}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <Sun className="w-4.5 h-4.5 text-amber-400" />
                ) : (
                  <Moon className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Overlay Bar */}
          {isMobileSearchOpen && (
            <div
              className={`md:hidden py-2 px-1 border-t relative ${
                isTransparent
                  ? "border-white/20"
                  : "border-gray-200 dark:border-[#1E2630]"
              }`}
            >
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.nav.searchPlaceholder || "Search for products..."}
                  style={isTransparent ? { color: "#ffffff" } : {}}
                  className={`w-full text-xs rounded-full py-2 pl-4 pr-10 border focus:outline-none ${
                    isTransparent
                      ? "bg-white/10 text-white placeholder-white/70 border-white/30 backdrop-blur-md"
                      : "bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-white placeholder-gray-400 border-transparent dark:border-[#26313D]"
                  }`}
                  autoFocus
                />
                <button
                  type="submit"
                  style={textStyle}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    isTransparent ? "text-white" : "text-gray-500 dark:text-[#7F8A96]"
                  }`}
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex justify-start"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm bg-white dark:bg-[#0F151D] h-full p-5 flex flex-col shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#1E2630]">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src={mixoLogoImg}
                  alt="Mixo Logo"
                  className="h-9 w-auto object-contain"
                />
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
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-[#FF1F3D] text-white shadow-md mb-2"
                >
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span className="text-white">
                      {isRTL ? "لوحة التحكم" : "Admin Dashboard"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70 text-white" />
                </Link>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-gray-100 dark:bg-[#151C24] text-black dark:text-white font-bold"
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
    </>
  );
}
