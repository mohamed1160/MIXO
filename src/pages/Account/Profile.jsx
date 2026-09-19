import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";
import {
  Package,
  Heart,
  MapPin,
  Bell,
  Settings as SettingsIcon,
  Camera,
  Edit3,
  Check,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Award,
  Upload,
  X,
  Phone,
  User,
  Printer,
} from "lucide-react";
import heroDragonImg from "../../assets/images/3dprint/hero_dragon.jpg";
import customVaseImg from "../../assets/images/3dprint/custom_vase.jpg";
import filamentImg from "../../assets/images/3dprint/filament_spools.jpg";

export default function Profile() {
  const { isRTL } = useLanguage();
  const { user, updateUser } = useAuthStore();
  const [toastMessage, setToastMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
      });
    }
  }, [user]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    updateUser({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      address: profileForm.address,
      city: profileForm.city,
    });
    setIsEditing(false);
    triggerToast(isRTL ? "تم تحديث بيانتك الشخصية بنجاح! ✨" : "Profile updated successfully! ✨");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        triggerToast(isRTL ? "حجم الملف يجب أن يكون أقل من 5 ميجابايت ⚠️" : "File size must be smaller than 5MB ⚠️");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result;
        updateUser({ avatar: base64Url });
        setIsAvatarModalOpen(false);
        triggerToast(isRTL ? "تم تغيير الصورة الشخصية بنجاح! ✨" : "Profile picture updated! ✨");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (presetImg) => {
    updateUser({ avatar: presetImg });
    setIsAvatarModalOpen(false);
    triggerToast(isRTL ? "تم تغيير الصورة الشخصية! ✨" : "Profile picture updated! ✨");
  };

  const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim() || (isRTL ? "عميل ميكسو" : "Valued Customer");

  // Orders from LocalStorage or Store
  const allOrders = JSON.parse(localStorage.getItem("MIXO_customer_orders") || "[]");
  const userOrders = allOrders.filter(
    (o) =>
      (o.customer?.phone && o.customer?.phone === user?.phone) ||
      (o.customer?.email && o.customer?.email?.toLowerCase() === user?.email?.toLowerCase())
  );
  const totalOrdersCount = userOrders.length;
  const totalSpentAmount = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  return (
    <div className="flex flex-col gap-8 font-sans text-gray-900 dark:text-[#F5F7FA] relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151C24] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#26313D] animate-bounce">
          <Sparkles size={16} className="text-[#FF1F3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {isRTL ? "حسابي الشخصي" : "My Profile & Account"}
        </h1>
        <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1">
          {isRTL ? "إدارة معلوماتك الشخصية، طلبياتك، وإعدادات الحساب." : "Manage your personal information, custom 3D orders and preferences."}
        </p>
      </div>

      {/* 2 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Total Orders */}
        <div className="bg-gray-50 dark:bg-[#151C24] p-5 rounded-2xl border border-gray-100 dark:border-[#26313D] flex flex-col items-center text-center shadow-xs">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0F151D] text-[#FF1F3D] flex items-center justify-center mb-2 shadow-xs font-bold">
            <ShoppingBag size={20} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalOrdersCount}</p>
          <span className="text-xs font-bold text-gray-700 dark:text-[#AAB4C0] mt-0.5">
            {isRTL ? "إجمالي الطلبات" : "Total Orders"}
          </span>
          <Link to="/account/orders" className="text-[11px] font-semibold text-[#FF1F3D] hover:underline mt-2">
            {isRTL ? "عرض جميع الطلبات" : "View all orders"}
          </Link>
        </div>

        {/* Total Spent */}
        <div className="bg-gray-50 dark:bg-[#151C24] p-5 rounded-2xl border border-gray-100 dark:border-[#26313D] flex flex-col items-center text-center shadow-xs">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0F151D] text-[#FF1F3D] flex items-center justify-center mb-2 shadow-xs font-bold text-xs">
            ج.م
          </div>
          <p className="text-xl font-extrabold text-gray-900 dark:text-white">{totalSpentAmount.toFixed(2)} ج.م</p>
          <span className="text-xs font-bold text-gray-700 dark:text-[#AAB4C0] mt-0.5">
            {isRTL ? "إجمالي المشتروات" : "Total Spent"}
          </span>
          <span className="text-[11px] font-medium text-gray-400 mt-2">
            {isRTL ? "منذ البداية" : "From all time"}
          </span>
        </div>

      </div>

      {/* Account Info Card & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Account Information Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1E2630] pb-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-700 dark:text-[#AAB4C0]">
              {isRTL ? "البيانات الشخصية" : "Account Information"}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#FF1F3D]/30 text-[#FF1F3D] bg-red-500/10 hover:bg-[#FF1F3D] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              <span>{isEditing ? (isRTL ? "إلغاء التعديل" : "Cancel Edit") : (isRTL ? "تعديل البيانات" : "Edit Profile")}</span>
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-xs pt-1">
            {/* Avatar Circle */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-[#151C24] p-1 border-2 border-[#FF1F3D] shadow-md flex items-center justify-center overflow-hidden">
                <img src={user?.avatar || heroDragonImg} alt={fullName} className="w-full h-full object-cover rounded-full" />
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#FF1F3D] text-white flex items-center justify-center shadow-md hover:bg-[#E01833] transition-colors cursor-pointer border-2 border-white dark:border-[#0F151D]"
                title="Change Photo"
              >
                <Camera size={13} />
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 w-full flex flex-col gap-3">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        {isRTL ? "الاسم الأول" : "First Name"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] px-3 py-2 border border-transparent dark:border-[#26313D] rounded-xl font-bold focus:outline-none focus:border-[#FF1F3D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        {isRTL ? "اسم العائلة" : "Last Name"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] px-3 py-2 border border-transparent dark:border-[#26313D] rounded-xl font-bold focus:outline-none focus:border-[#FF1F3D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      {isRTL ? "رقم الهاتف *" : "Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] px-3 py-2 border border-transparent dark:border-[#26313D] rounded-xl font-bold focus:outline-none focus:border-[#FF1F3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      {isRTL ? "البريد الإلكتروني" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] px-3 py-2 border border-transparent dark:border-[#26313D] rounded-xl font-semibold focus:outline-none focus:border-[#FF1F3D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 py-2 px-4 bg-[#FF1F3D] hover:bg-[#E01833] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>{isRTL ? "حفظ التغيرات" : "Save Changes"}</span>
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 block">{isRTL ? "الاسم بالكامل" : "Full Name"}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{fullName}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 block">{isRTL ? "رقم الهاتف للتواصل" : "Phone Number"}</span>
                    <span className="text-xs font-bold text-[#FF1F3D]">{profileForm.phone || (isRTL ? "غير محدد" : "Not specified")}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 block">{isRTL ? "البريد الإلكتروني" : "Email Address"}</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-[#AAB4C0]">{profileForm.email || (isRTL ? "غير محدد" : "Not specified")}</span>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Quick Shortcuts Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col justify-between gap-4">
          <div className="border-b border-gray-100 dark:border-[#1E2630] pb-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-700 dark:text-[#AAB4C0]">
              {isRTL ? "وصول سريع" : "Quick Shortcuts"}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <Link
              to="/account/orders"
              className="p-3 bg-gray-50 dark:bg-[#151C24] hover:bg-red-500/10 hover:text-[#FF1F3D] rounded-2xl border border-gray-100 dark:border-[#26313D] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <Package size={22} className="text-gray-500 dark:text-[#7F8A96] group-hover:text-[#FF1F3D]" />
              <span className="font-bold text-[11px]">{isRTL ? "طلبياتي" : "My Orders"}</span>
            </Link>

            <Link
              to="/account/wishlist"
              className="p-3 bg-gray-50 dark:bg-[#151C24] hover:bg-red-500/10 hover:text-[#FF1F3D] rounded-2xl border border-gray-100 dark:border-[#26313D] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <Heart size={22} className="text-gray-500 dark:text-[#7F8A96] group-hover:text-[#FF1F3D]" />
              <span className="font-bold text-[11px]">{isRTL ? "المفضلة" : "Wishlist"}</span>
            </Link>

            <Link
              to="/account/notifications"
              className="p-3 bg-gray-50 dark:bg-[#151C24] hover:bg-red-500/10 hover:text-[#FF1F3D] rounded-2xl border border-gray-100 dark:border-[#26313D] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group relative"
            >
              <Bell size={22} className="text-gray-500 dark:text-[#7F8A96] group-hover:text-[#FF1F3D]" />
              <span className="font-bold text-[11px]">{isRTL ? "الإشعارات" : "Notifications"}</span>
            </Link>

            <Link
              to="/account/settings"
              className="p-3 bg-gray-50 dark:bg-[#151C24] hover:bg-red-500/10 hover:text-[#FF1F3D] rounded-2xl border border-gray-100 dark:border-[#26313D] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <SettingsIcon size={22} className="text-gray-500 dark:text-[#7F8A96] group-hover:text-[#FF1F3D]" />
              <span className="font-bold text-[11px]">{isRTL ? "الإعدادات" : "Settings"}</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1E2630] pb-3">
          <h3 className="text-xs font-bold tracking-widest uppercase text-gray-700 dark:text-[#AAB4C0]">
            {isRTL ? "أحدث الطلبات" : "Recent Orders"}
          </h3>
          <Link to="/account/orders" className="text-xs font-bold text-[#FF1F3D] hover:underline flex items-center gap-1">
            <span>{isRTL ? "عرض جميع الطلبات" : "View All Orders"}</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1E2630] text-gray-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">{isRTL ? "الطلب" : "Order"}</th>
                <th className="py-3 px-4">{isRTL ? "التاريخ" : "Date"}</th>
                <th className="py-3 px-4">{isRTL ? "الإجمالي" : "Total"}</th>
                <th className="py-3 px-4">{isRTL ? "الحالة" : "Status"}</th>
                <th className="py-3 px-4 text-right">{isRTL ? "التفاصيل" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1E2630]">
              {userOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-xs font-medium">
                    {isRTL
                      ? "لا توجد طلبات سابقة حتى الآن. تصفح المتجر لتقديم طلبك الأول!"
                      : "No orders placed yet. Start shopping to view your order history here!"}
                  </td>
                </tr>
              ) : (
                userOrders.slice(0, 3).map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 dark:hover:bg-[#151C24]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                      <div>
                        <span>Order #{ord.id}</span>
                        <span className="text-[10px] text-gray-400 font-normal block">
                          {(ord.items || []).length} {isRTL ? "منتج" : "items"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-[#7F8A96]">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : "Recent"}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#FF1F3D]">
                      ${(ord.total || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold border bg-red-500/10 text-[#FF1F3D] border-[#FF1F3D]/20">
                        {ord.orderStatus || ord.paymentStatus || "Processing"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/account/orders"
                        className="text-xs font-bold text-gray-800 dark:text-[#F5F7FA] hover:text-[#FF1F3D] inline-flex items-center gap-1"
                      >
                        <span>{isRTL ? "التفاصيل" : "View Details"}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Avatar Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0F151D] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-[#1E2630] flex flex-col gap-5 relative">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1E2630] pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {isRTL ? "تغيير الصورة الشخصية" : "Change Profile Picture"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-0.5">
                  {isRTL ? "ارفع صورة جديدة من جهازك أو اختر صورة جاهزة" : "Upload your photo or choose a Mixo preset avatar"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#151C24] text-gray-500 hover:text-black dark:text-[#AAB4C0] dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Upload Button */}
            <label className="w-full py-4 px-4 bg-red-500/10 hover:bg-red-500/20 border-2 border-dashed border-[#FF1F3D]/40 rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all text-[#FF1F3D] font-bold text-xs">
              <Upload size={18} />
              <span>{isRTL ? "رفع صورة جديدة من جهازك" : "Upload Photo from Device"}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
                {isRTL ? "أو اختر صورة رمزية جاهزة" : "Or Choose a Mixo Preset Avatar"}
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "3D Dragon", img: heroDragonImg },
                  { name: "Spiral Vase", img: customVaseImg },
                  { name: "3D Filament", img: filamentImg },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.img)}
                    className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 dark:bg-[#151C24] hover:bg-red-500/10 rounded-2xl border border-gray-100 dark:border-[#26313D] hover:border-[#FF1F3D] transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-[#0B0F14] p-1 border-2 border-[#FF1F3D] overflow-hidden flex items-center justify-center shadow-xs">
                      <img src={preset.img} alt={preset.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-[#AAB4C0] group-hover:text-[#FF1F3D]">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
