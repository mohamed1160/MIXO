import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Box,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Store,
  Printer,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Star,
  Tag,
} from "lucide-react";
import { useAdminStore } from "../../../store/useAdminStore";
import { useAuthStore } from "../../../store/useAuthStore";
import mixoLogoImg from "../../../assets/images/logo/mixo_red_logo.png";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", labelAr: "نظرة عامة", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders & 3D Quotes", labelAr: "الطلبات والتسعير", icon: ShoppingBag },
  { to: "/admin/products", label: "3D Products Catalog", labelAr: "منتجات المتجر 3D", icon: Box },
  { to: "/admin/promo-codes", label: "Promo Codes & Coupons", labelAr: "أكواد الخصم والكوبونات", icon: Tag },
  { to: "/admin/customers", label: "Registered Customers", labelAr: "العملاء المسجلين", icon: Users },
  { to: "/admin/messages", label: "Messages & Requests", labelAr: "الرسائل والطلبات المخصصة", icon: MessageSquare },
  { to: "/admin/reviews", label: "Customer Reviews", labelAr: "تقييمات العملاء", icon: Star },
  { to: "/admin/faqs", label: "Q&A / FAQs", labelAr: "الأسئلة الشائعة", icon: HelpCircle },
  { to: "/admin/security", label: "Security & Passwords", labelAr: "أمان الحساب وكلمة السر", icon: ShieldCheck },
  { to: "/admin/settings", label: "Store Settings", labelAr: "إعدادات المتجر", icon: Settings },
];

export default function Sidebar({ mobileSidebarOpen, setMobileSidebarOpen, isMobile }) {
  const { sidebarCollapsed } = useAdminStore();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const isVisible = isMobile ? mobileSidebarOpen : true;
  const width = isMobile ? 260 : sidebarCollapsed ? 72 : 260;
  const collapsed = !isMobile && sidebarCollapsed;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      className="fixed left-0 flex flex-col z-40 transition-all duration-200 bg-[#0B0F14] border-r border-[#1E2630] text-white"
      style={{
        top: 0,
        height: "100vh",
        width,
        transform: isVisible ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      {/* ── Brand Header ── */}
      <div className="flex items-center justify-between px-5 h-[76px] shrink-0 border-b border-[#1E2630]">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={mixoLogoImg}
            alt="Mixo Logo"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          {!collapsed && (
            <div className="leading-tight overflow-hidden">
              <span className="text-[10px] uppercase font-extrabold tracking-widest bg-red-500/10 text-[#FF1F3D] px-2 py-0.5 rounded-full border border-[#FF1F3D]/20 block w-fit mt-0.5">
                3D Admin Hub
              </span>
            </div>
          )}
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs font-semibold">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => isMobile && setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                  isActive
                    ? "bg-[#FF1F3D] text-white font-bold shadow-md shadow-red-600/30"
                    : "text-white hover:bg-red-500/10 hover:text-[#FF1F3D]"
                }`
              }
            >
              <Icon size={18} className="shrink-0 text-current" />
              {!collapsed && (
                <span className="flex-1 truncate text-white">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer Actions ── */}
      <div className="p-3 border-t border-[#1E2630] flex flex-col gap-2 shrink-0">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#151C24] hover:bg-red-500/10 text-white hover:text-[#FF1F3D] rounded-xl border border-[#26313D] transition-all text-xs font-bold cursor-pointer"
        >
          <Store size={16} className="text-[#FF1F3D]" />
          {!collapsed && <span className="text-white font-bold">Return to Store</span>}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-2 px-3 text-white hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-xs font-semibold cursor-pointer"
        >
          <LogOut size={16} />
          {!collapsed && <span className="text-white">Log Out</span>}
        </button>
      </div>

    </aside>
  );
}
