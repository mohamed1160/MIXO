import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../providers/LanguageContext";
import mixoLogoImg from "../assets/images/logo/mixo_red_logo.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { t, isRTL } = useLanguage();
  const [storeSettings, setStoreSettings] = useState({
    instagramUrl: "https://instagram.com",
    facebookUrl: "https://facebook.com",
    tiktokUrl: "https://tiktok.com",
    supportPhone: "01012345678",
    supportEmail: "support@mixo3d.com",
    storeName: "Mixo 3D Printing & Design",
  });

  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem("MIXO_settings") || localStorage.getItem("MIXO_store_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setStoreSettings({
            instagramUrl: parsed.instagramUrl || "https://instagram.com",
            facebookUrl: parsed.facebookUrl || "https://facebook.com",
            tiktokUrl: parsed.tiktokUrl || "https://tiktok.com",
            supportPhone: parsed.supportPhone || "01012345678",
            supportEmail: parsed.supportEmail || "support@mixo3d.com",
            storeName: parsed.storeName || "Mixo 3D Printing & Design",
          });
        }
      } catch (e) {
        console.error("Error loading store settings in footer:", e);
      }
    };

    loadSettings();
    window.addEventListener("storage", loadSettings);
    return () => window.removeEventListener("storage", loadSettings);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(isRTL ? "شكراً لاشتراكك في النشرة البريدية!" : "Thank you for subscribing to our newsletter!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-50 dark:bg-[#070B10] text-gray-700 dark:text-[#AAB4C0] pt-16 pb-8 border-t border-gray-200 dark:border-[#1E2630] transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-200 dark:border-[#1E2630]">
          
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={mixoLogoImg}
                alt="Mixo Logo"
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-gray-600 dark:text-[#7F8A96] leading-relaxed mt-1">
              {t.footer.about}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <a
                href={storeSettings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#151C24] hover:bg-gray-100 dark:hover:bg-[#1E2630] border border-gray-200 dark:border-[#26313D] flex items-center justify-center text-gray-700 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={storeSettings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#151C24] hover:bg-gray-100 dark:hover:bg-[#1E2630] border border-gray-200 dark:border-[#26313D] flex items-center justify-center text-gray-700 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.714 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href={storeSettings.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#151C24] hover:bg-gray-100 dark:hover:bg-[#1E2630] border border-gray-200 dark:border-[#26313D] flex items-center justify-center text-gray-700 dark:text-[#AAB4C0] hover:text-black dark:hover:text-white transition-colors shadow-sm"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.33 1.54-1.34 2.54-.05 1.18.59 2.37 1.61 2.94.9.52 2.05.58 3.01.17 1.02-.42 1.74-1.39 1.84-2.48.04-1.57.01-3.14.02-4.71 0-4.43 0-8.86 0-13.29z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              {t.footer.quickLinks}
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-gray-600 dark:text-[#AAB4C0]">
              <li>
                <Link to="/" className="hover:text-[#FF1F3D] transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#FF1F3D] transition-colors">
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#FF1F3D] transition-colors">
                  {t.nav.categories}
                </Link>
              </li>
              <li>
                <Link to="/custom-order" className="hover:text-[#FF1F3D] transition-colors">
                  {t.nav.customOrders}
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-[#FF1F3D] transition-colors">
                  {t.nav.aboutUs}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FF1F3D] transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              {t.footer.customerService}
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-gray-600 dark:text-[#AAB4C0]">
              <li>
                <Link to="/shipping-delivery" className="hover:text-[#FF1F3D] transition-colors">
                  {isRTL ? "الشحن والتوصيل" : "Shipping"}
                </Link>
              </li>
              <li>
                <Link to="/returns-exchanges" className="hover:text-[#FF1F3D] transition-colors">
                  {isRTL ? "الاسترجاع والاستبدال" : "Returns & Exchanges"}
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-[#FF1F3D] transition-colors">
                  {isRTL ? "الأسئلة الشائعة" : "FAQ"}
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#FF1F3D] transition-colors font-bold text-[#FF1F3D]">
                  {isRTL ? "تتبع طلبك 🚚" : "Track Order 🚚"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              {t.footer.newsletter}
            </h3>
            <p className="text-xs text-gray-600 dark:text-[#AAB4C0] leading-relaxed">
              {t.footer.newsletterDesc}
            </p>

            <form onSubmit={handleSubscribe} className="mt-2 relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.emailPlaceholder}
                className="w-full bg-white dark:bg-[#151C24] border border-gray-300 dark:border-[#26313D] rounded-xl py-2.5 px-3.5 pr-11 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#7F8A96] focus:outline-none focus:border-[#FF1F3D] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-9 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
                aria-label="Subscribe"
              >
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-[#7F8A96]">
          <p>© 2026 Mixo 3D. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-[#FF1F3D] transition-colors">
              {t.footer.privacy}
            </Link>
            <span>•</span>
            <Link to="/terms-conditions" className="hover:text-[#FF1F3D] transition-colors">
              {t.footer.cookies}
            </Link>
            <span>•</span>
            <Link to="/terms-conditions" className="hover:text-[#FF1F3D] transition-colors">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
