import React, { useState } from "react";
import {
  Sparkles,
  Power,
  Clock,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Flame,
  ShoppingBag,
  MessageSquare,
  X
} from "lucide-react";
import { usePromoStore } from "../../../store/usePromoStore";
import PromoPopup from "../../../components/PromoPopup";
import mixoLogoImg from "../../../assets/images/logo/mixo_red_logo.png";

export default function PromoPopupSettings() {
  const promoState = usePromoStore();
  const [formData, setFormData] = useState({ ...promoState });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    promoState.updatePromoConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset Promo Popup settings to default?")) {
      promoState.resetToDefault();
      setFormData({ ...usePromoStore.getState() });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 dir-rtl text-right" dir="rtl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121820] border border-[#1E2630] p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#FF1F3D]/10 text-[#FF1F3D] border border-[#FF1F3D]/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">إعدادات البوب أب الترويجي (Promo Popup Settings)</h1>
              <p className="text-xs sm:text-sm text-gray-400">
                التحكم في تشغيل نافذة البوب أب وتعديل الجملة الترويجية والرابط (Home /).
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge & Preview Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
              formData.isEnabled
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full animate-ping ${
                formData.isEnabled ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            <span>{formData.isEnabled ? "البوب أب مفعل 🟢" : "البوب أب متوقف 🔴"}</span>
          </div>

          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#1A232E] hover:bg-[#253242] text-white text-xs font-bold border border-[#2E3C4E] transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Eye size={16} className="text-[#FF1F3D]" />
            <span>معاينة حية (Live Preview)</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert Notification */}
      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-fadeIn">
          <CheckCircle2 size={18} />
          <span>تم حفظ الجملة ورابط الهوم (/) بنجاح!</span>
        </div>
      )}

      {/* ── Main Grid Layout: Controls vs Live Mockup ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls Form (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* Section 1: Enable & Timing */}
          <div className="bg-[#121820] border border-[#1E2630] rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-[#1E2630] pb-3">
              <Power size={18} className="text-[#FF1F3D]" />
              <span>1. حالة التشغيل والتأخير الزمني</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Enable Toggle Card */}
              <div className="bg-[#17202C] border border-[#243040] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">تفعيل البوب أب (Enable)</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">إظهار النافذة للزوار</div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isEnabled}
                    onChange={(e) => handleChange("isEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF1F3D]"></div>
                </label>
              </div>

              {/* Delay Seconds Input */}
              <div className="bg-[#17202C] border border-[#243040] rounded-2xl p-4 space-y-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock size={14} className="text-amber-400" />
                  <span>وقت الظهور بالثواني (افتراضي 2)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={formData.delaySeconds}
                    onChange={(e) => handleChange("delaySeconds", Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#0D1219] border border-[#2A3646] rounded-xl px-3 py-2 text-white text-xs font-bold text-center focus:outline-none focus:border-[#FF1F3D]"
                  />
                  <span className="text-xs text-gray-400 font-semibold shrink-0">ثواني</span>
                </div>
              </div>
            </div>

            {/* Session Frequency */}
            <div className="bg-[#17202C] border border-[#243040] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">إظهار مرة واحدة فقط لكل جلسة زائر</div>
                <div className="text-[11px] text-gray-400 mt-0.5">عند إغلاقه لن يظهر مرة أخرى إلا بعد إعادة فتح المتصفح</div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showOncePerSession}
                  onChange={(e) => handleChange("showOncePerSession", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF1F3D]"></div>
              </label>
            </div>
          </div>

          {/* Section 2: Sentence & Action */}
          <div className="bg-[#121820] border border-[#1E2630] rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-[#1E2630] pb-3">
              <MessageSquare size={18} className="text-[#FF1F3D]" />
              <span>2. جملة البوب أب وزر التحويل (English)</span>
            </div>

            {/* Sentence Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">جملة العرض (Popup Sentence in English)</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Special offers exceeding 25% OFF! 🔥"
                className="w-full bg-[#17202C] border border-[#243040] rounded-2xl p-4 text-white text-sm font-bold focus:outline-none focus:border-[#FF1F3D] resize-none leading-relaxed text-left font-sans"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Button Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">نص الزر (Button Text)</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => handleChange("buttonText", e.target.value)}
                  placeholder="Shop Now 🛍️"
                  className="w-full bg-[#17202C] border border-[#243040] rounded-2xl px-3.5 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-[#FF1F3D] text-left"
                  dir="ltr"
                />
              </div>

              {/* Button Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">رابط الزر (Target Link - Home)</label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => handleChange("buttonLink", e.target.value)}
                  placeholder="/"
                  className="w-full bg-[#17202C] border border-[#243040] rounded-2xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-[#FF1F3D] text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-[#FF1F3D] hover:bg-[#E60026] text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={18} />
              <span>حفظ التغييرات</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="py-3.5 px-5 rounded-2xl bg-[#17202C] hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 border border-[#243040] hover:border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>إعادة الضبط</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="text-xs font-bold text-gray-300 flex items-center gap-2">
                <Eye size={16} className="text-[#FF1F3D]" />
                <span>معاينة حية (Live Preview)</span>
              </div>
            </div>

            {/* Minimal Mockup Card */}
            <div className="relative w-full bg-[#0F141C] border border-[#2A3441] rounded-3xl shadow-2xl overflow-hidden text-white p-6 text-center">
              {/* Red Glow Accent Bar Top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF1F3D] via-[#FF6B00] to-[#FF1F3D]" />

              {/* Close Button Mock */}
              <div className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                <X size={14} />
              </div>

              {/* Flame Header Icon */}
              <div className="flex flex-col items-center justify-center space-y-2 pt-2 pb-1">
                <div className="p-2.5 rounded-2xl bg-[#FF1F3D]/10 text-[#FF1F3D] border border-[#FF1F3D]/20 shadow-lg inline-flex items-center justify-center">
                  <Flame size={24} className="text-[#FF1F3D]" />
                </div>
                <img src={mixoLogoImg} alt="Mixo Logo" className="h-5 w-auto object-contain opacity-80 pt-1" />
              </div>

              {/* Sentence Message Preview */}
              <div className="my-4 px-2">
                <h3 className="text-lg font-black text-white leading-relaxed font-sans">
                  {formData.message || "Special offers exceeding 25% OFF! 🔥"}
                </h3>
              </div>

              {/* Button Preview */}
              <div className="space-y-2 pt-1">
                {formData.buttonText && (
                  <div className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF1F3D] to-[#E60026] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg">
                    <ShoppingBag size={15} />
                    <span>{formData.buttonText}</span>
                  </div>
                )}
                <div className="text-[11px] text-gray-500 font-medium py-1">No thanks, maybe later</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full screen popup preview modal overlay */}
      {previewModalOpen && (
        <PromoPopup forceShow={true} onClosePreview={() => setPreviewModalOpen(false)} />
      )}
    </div>
  );
}
