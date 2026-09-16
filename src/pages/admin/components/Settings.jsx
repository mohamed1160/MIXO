import React, { useState, useEffect } from 'react';
import { getSupabaseSettings, saveSupabaseSettings } from '../../../services/db.service';
import {
  Settings as SettingsIcon,
  CreditCard,
  Truck,
  Store,
  Save,
  Phone,
  Mail,
  ShieldCheck,
  Bell,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_SETTINGS = {
  storeName: 'Mixo 3D Printing & Design',
  supportPhone: '01012345678',
  supportEmail: 'contact@mixo.com',
  announcementText: '🚀 خصم 15% على جميع طلبات مجسمات 3D المخصصة باستخدام كود: MIXO3D',
  vodafoneCashNumber: '01012345678',
  instapayAccount: '01198765432',
  shippingCairo: 50,
  shippingDelta: 70,
  shippingUpperEgypt: 90,
  freeShippingLimit: 1000,
  storeStatus: 'open',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  tiktokUrl: 'https://tiktok.com',
};

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    async function load() {
      const data = await getSupabaseSettings();
      if (data && Object.keys(data).length > 0) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await saveSupabaseSettings(settings);
    toast.success('تم حفظ إعدادات المتجر والدفع بنجاح بـ Supabase 🎉');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 text-gray-900 dark:text-white min-h-screen dir-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-7 h-7 text-[#FF1F3D]" />
            إعدادات المتجر ووسائل الدفع
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            التحكم في أرقام فودافون كاش، InstaPay، تكاليف الشحن وبيانات التواصل
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#FF1F3D]/20 cursor-pointer"
        >
          <Save className="w-5 h-5" />
          حفظ التغييرات
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Settings */}
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <CreditCard className="w-5 h-5 text-[#FF1F3D]" />
            أرقـام وتفاصيل وسائل الدفـع
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                رقم محفظة فودافون كاش (Vodafone Cash)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  dir="ltr"
                  value={settings.vodafoneCashNumber}
                  onChange={(e) => setSettings({ ...settings, vodafoneCashNumber: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#FF1F3D]"
                  placeholder="01012345678"
                />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                سيظهر هذا الرقم للعملاء في صفحة إتمام الدفع (Checkout).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                حساب أو رقم إنستا باي (InstaPay)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  dir="ltr"
                  value={settings.instapayAccount}
                  onChange={(e) => setSettings({ ...settings, instapayAccount: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#FF1F3D]"
                  placeholder="01198765432 / mixo@instapay"
                />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                اسم الحساب أو رقم الهاتف المربوط بتحويلات انستا باي المباشرة.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Rates Settings */}
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <Truck className="w-5 h-5 text-[#FF1F3D]" />
            أسعار الشحن للتوصيل
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">القاهرة والجيزة (ج.م)</label>
              <input
                type="number"
                value={settings.shippingCairo}
                onChange={(e) => setSettings({ ...settings, shippingCairo: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white font-bold focus:outline-none focus:border-[#FF1F3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">وجه بحري / الدلتا (ج.م)</label>
              <input
                type="number"
                value={settings.shippingDelta}
                onChange={(e) => setSettings({ ...settings, shippingDelta: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white font-bold focus:outline-none focus:border-[#FF1F3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">الصعيد والحدود (ج.م)</label>
              <input
                type="number"
                value={settings.shippingUpperEgypt}
                onChange={(e) => setSettings({ ...settings, shippingUpperEgypt: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white font-bold focus:outline-none focus:border-[#FF1F3D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              حد الشحن المجاني (الطلبات الأعلى من)
            </label>
            <div className="relative">
              <input
                type="number"
                value={settings.freeShippingLimit}
                onChange={(e) => setSettings({ ...settings, freeShippingLimit: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white font-bold focus:outline-none focus:border-[#FF1F3D]"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 font-bold">جنية</span>
            </div>
          </div>
        </div>

        {/* General Store Info */}
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5 lg:col-span-2 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <Store className="w-5 h-5 text-[#FF1F3D]" />
            بيانات المتجر والشريط الترويجي
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">اسم المتجر الرسمي</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">رقم خدمة العملاء الواتساب</label>
              <input
                type="text"
                dir="ltr"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">حالة المتجر التشغيلية</label>
              <select
                value={settings.storeStatus}
                onChange={(e) => setSettings({ ...settings, storeStatus: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
              >
                <option value="open">مفتوح ويستقبل الطلبات 🟢</option>
                <option value="maintenance">تحت الصيانة المؤقتة 🟠</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              نص الشريط الترويجي أعلى الصفحة الرئيسية (Announcement Bar)
            </label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5 lg:col-span-2 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#FF1F3D]" />
            روابط وسائل التواصل الاجتماعي في أسفل الصفحة (Footer Social Links)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                رابط إنستجرام (Instagram URL)
              </label>
              <input
                type="url"
                dir="ltr"
                value={settings.instagramUrl || ''}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/your-page"
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                رابط فيسبوك (Facebook URL)
              </label>
              <input
                type="url"
                dir="ltr"
                value={settings.facebookUrl || ''}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/your-page"
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                رابط تيك توك (TikTok URL)
              </label>
              <input
                type="url"
                dir="ltr"
                value={settings.tiktokUrl || ''}
                onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                placeholder="https://tiktok.com/@your-account"
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
