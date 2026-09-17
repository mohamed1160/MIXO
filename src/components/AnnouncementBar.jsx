import React, { useState, useEffect } from "react";
import { Sparkles, AlertTriangle } from "lucide-react";
import { useLanguage } from "../providers/LanguageContext";
import { getSupabaseSettings } from "../services/db.service";

export default function AnnouncementBar() {
  const { isRTL } = useLanguage();
  const [settings, setSettings] = useState({
    announcementText: "🚀 خصم 15% على جميع طلبات مجسمات 3D المخصصة باستخدام كود: MIXO3D",
    storeStatus: "open",
    supportPhone: "01012345678",
  });

  const loadSettings = async () => {
    try {
      const data = await getSupabaseSettings();
      if (data && Object.keys(data).length > 0) {
        setSettings((prev) => ({ ...prev, ...data }));
      } else {
        const saved = localStorage.getItem("MIXO_settings");
        if (saved) {
          setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
        }
      }
    } catch (e) {
      console.error("Failed to load settings in AnnouncementBar:", e);
    }
  };

  useEffect(() => {
    loadSettings();

    const handleStorageChange = () => loadSettings();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isMaintenance = settings.storeStatus === "maintenance";

  return (
    <div>
      {/* Maintenance Alert Top Bar */}
      {isMaintenance && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
          <span>
            {isRTL
              ? "المتجر حالياً تحت الصيانة المؤقتة وتجهيز الشحنات. يمكنك التصفح والاستفسار وسنعاود قبول الطلبات قريباً 🟠"
              : "Store is currently under temporary maintenance. You can browse and inquire about custom 3D models 🟠"}
          </span>
        </div>
      )}

      {/* Announcement Bar */}
      {settings.announcementText && !isMaintenance && (
        <div className="bg-gradient-to-r from-[#111823] via-[#FF1F3D] to-[#111823] text-white text-[11px] sm:text-xs font-bold py-2 px-4 text-center border-b border-[#FF1F3D]/20 shadow-xs flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300 animate-pulse" />
          <span className="truncate max-w-3xl">{settings.announcementText}</span>
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300 animate-pulse hidden sm:inline" />
        </div>
      )}
    </div>
  );
}
