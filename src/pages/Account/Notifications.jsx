import React, { useState } from "react";
import { Bell, Check, Trash2, Sparkles, Printer, Package } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";

export default function Notifications() {
  const { isRTL } = useLanguage();
  const { user, markAllNotificationsRead } = useAuthStore();

  const [notifications, setNotifications] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const loadNotifications = () => {
    try {
      const keysToTry = [
        user?.phone ? `MIXO_user_notifications_${user.phone}` : null,
        user?.email ? `MIXO_user_notifications_${user.email}` : null,
        user?.id ? `MIXO_user_notifications_${user.id}` : null,
        'MIXO_user_notifications_all',
        'MIXO_user_notifications_default',
      ].filter(Boolean);

      let allNotifs = [];
      const seenIds = new Set();

      keysToTry.forEach((key) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                allNotifs.push({
                  ...item,
                  icon: item.id?.includes("QUOTE") ? Printer : item.id?.includes("PLA") ? Package : Sparkles,
                  color: item.id?.includes("QUOTE")
                    ? "bg-red-500/10 text-[#FF1F3D]"
                    : item.id?.includes("PLA")
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-blue-500/10 text-blue-600",
                });
              }
            });
          }
        }
      });

      setNotifications(allNotifs);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    loadNotifications();

    const handleStorageChange = () => loadNotifications();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
    markAllNotificationsRead();
    triggerToast(isRTL ? "تم تحديث جميع الإشعارات كمقروءة 👁️" : "All notifications marked as read 👁️");
  };

  const handleClearAll = () => {
    saveNotifications([]);
    markAllNotificationsRead();
    triggerToast(isRTL ? "تم مسح جميع الإشعارات 🗑️" : "Notifications cleared 🗑️");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-900 dark:text-[#F5F7FA] relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151C24] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#26313D] animate-bounce">
          <Sparkles size={16} className="text-[#FF1F3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#1E2630] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Bell size={24} className="text-[#FF1F3D]" />
            <span>{isRTL ? "مركز الإشعارات" : "Notifications Center"}</span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-[#FF1F3D] text-white px-2.5 py-0.5 rounded-full">
                {unreadCount} {isRTL ? "جديد" : "New"}
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1">
            {isRTL
              ? "تابع آخر تحديثات حالة طلبيات الطباعة 3D وعروض الأسعار في مكان واحد."
              : "Stay updated on your custom 3D printing orders and quotes."}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#FF1F3D] bg-red-500/10 border border-[#FF1F3D]/20 rounded-xl hover:bg-[#FF1F3D] hover:text-white transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>{isRTL ? "تحديد الكل كمقروء" : "Mark All Read"}</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
              title={isRTL ? "مسح الإشعارات" : "Clear All"}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 dark:bg-[#0F151D] rounded-3xl border border-gray-100 dark:border-[#1E2630] flex flex-col items-center justify-center gap-3">
            <Bell size={32} className="text-gray-300 dark:text-[#26313D]" />
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {isRTL ? "لا توجد إشعارات حالياً" : "No active notifications"}
            </p>
            <p className="text-xs text-gray-400 max-w-xs">
              {isRTL ? "سيتم إعلامك فور صدور أي تحديث على طلبيات الطباعة الخاصة بك." : "Updates about your 3D orders will appear here."}
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const IconComp = n.icon || Bell;
            return (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  !n.isRead
                    ? "bg-white dark:bg-[#0F151D] border-[#FF1F3D]/30 shadow-xs"
                    : "bg-gray-50/60 dark:bg-[#151C24]/50 border-gray-100 dark:border-[#1E2630]"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${n.color}`}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#FF1F3D] animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-[#AAB4C0] mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-1.5">{n.date}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
