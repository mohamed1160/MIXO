import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";
import {
  User,
  Package,
  Heart,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
  Printer,
} from "lucide-react";
import mixoLogoImg from "../../assets/images/logo/mixo_red_logo.png";
import heroDragonImg from "../../assets/images/3dprint/hero_dragon.jpg";

export default function AccountLayout() {
  const { isRTL } = useLanguage();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Compute actual unread notifications for current user
  const getUnreadCount = () => {
    try {
      const userKey = `MIXO_user_notifications_${user?.phone || user?.email || "default"}`;
      const stored = localStorage.getItem(userKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((n) => !n.isRead).length;
        }
      }
    } catch (e) {}
    return 0;
  };

  const unreadCount = getUnreadCount();

  const navItems = [
    { nameEn: "My Account", nameAr: "حسابي الشخصي", path: "/account", icon: <User size={18} />, end: true },
    { nameEn: "My Orders", nameAr: "طلبياتي", path: "/account/orders", icon: <Package size={18} /> },
    { nameEn: "Wishlist", nameAr: "المفضلة", path: "/account/wishlist", icon: <Heart size={18} /> },
    { nameEn: "Notifications", nameAr: "الإشعارات", path: "/account/notifications", icon: <Bell size={18} />, badge: unreadCount > 0 ? unreadCount : null },
    { nameEn: "Settings", nameAr: "الإعدادات", path: "/account/settings", icon: <Settings size={18} /> },
  ];

  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || (isRTL ? "عميل ميكسو" : "Valued Customer") : (isRTL ? "عميل ميكسو" : "Valued Customer");
  const email = user?.email || (isRTL ? "غير محدد" : "Not specified");
  const phone = user?.phone || (isRTL ? "غير محدد" : "Not specified");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B10] text-gray-900 dark:text-[#F5F7FA] font-sans pt-20 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Sidebar Panel */}
          <aside className="w-full md:w-72 shrink-0 bg-white dark:bg-[#0F151D] rounded-3xl p-6 border border-gray-100 dark:border-[#1E2630] shadow-xl flex flex-col items-center text-center">
            
            {/* Avatar Circle */}
            <div className="relative w-24 h-24 rounded-full bg-gray-100 dark:bg-[#151C24] p-1 shadow-md mb-4 flex items-center justify-center border-2 border-[#FF1F3D]">
              <img
                src={user?.avatar || heroDragonImg}
                alt={fullName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Name, Phone & Email */}
            <h3 className="font-extrabold text-gray-900 dark:text-white text-lg leading-tight">{fullName}</h3>
            <p className="text-xs font-semibold text-[#FF1F3D] mt-0.5">{phone}</p>
            <p className="text-xs text-gray-400 dark:text-[#7F8A96] mt-0.5 truncate max-w-[220px]">{email}</p>

            {/* Member Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-[#FF1F3D]/30 rounded-full text-[#FF1F3D] text-[11px] font-bold tracking-wider uppercase">
              <Printer size={13} />
              <span>{isRTL ? "عضو ميكسو 3D" : "MIXO 3D MEMBER"}</span>
            </div>

            {/* Sidebar Navigation */}
            <nav className="w-full mt-6 flex flex-col gap-1 text-left border-t border-gray-100 dark:border-[#1E2630] pt-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer
                    ${
                      isActive
                        ? "bg-[#FF1F3D] text-white shadow-md shadow-red-600/20"
                        : "text-gray-600 dark:text-[#AAB4C0] hover:bg-gray-50 dark:hover:bg-[#151C24] hover:text-black dark:hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{isRTL ? item.nameAr : item.nameEn}</span>
                  </div>

                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#FF1F3D] text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors mt-2 cursor-pointer"
              >
                <LogOut size={18} />
                <span>{isRTL ? "تسجيل الخروج" : "Logout"}</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 w-full bg-white dark:bg-[#0F151D] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#1E2630] shadow-xl">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}
