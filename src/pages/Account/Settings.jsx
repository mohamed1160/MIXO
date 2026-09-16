import React, { useState } from "react";
import { Lock, Sparkles, Check, Eye, EyeOff, ShieldCheck, KeyRound, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";

export default function AccountSettings() {
  const { isRTL } = useLanguage();
  const { changePassword } = useAuthStore();
  
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword) {
      triggerToast(
        isRTL
          ? "يرجى إدخال كلمة السر الحالية ⚠️"
          : "Please enter your current password ⚠️"
      );
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      triggerToast(
        isRTL
          ? "يجب أن تتكون كلمة السر الجديدة من 6 خانات على الأقل ⚠️"
          : "New password must be at least 6 characters long ⚠️"
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      triggerToast(
        isRTL
          ? "كلمتا السر غير متطابقتين، يرجى التثبت وإعادة المحاولة ⚠️"
          : "New passwords do not match! Please verify ⚠️"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      triggerToast(
        isRTL
          ? "تم تغيير كلمة السر وتحديثها بنجاح! 🔒✨"
          : "Password updated successfully! 🔒✨"
      );
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      triggerToast(err.message || (isRTL ? "حدث خطأ أثناء تغيير كلمة السر ⚠️" : "Error updating password ⚠️"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-900 dark:text-[#F5F7FA] relative max-w-2xl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151C24] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#26313D] animate-bounce">
          <Sparkles size={16} className="text-[#FF1F3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-100 dark:border-[#1E2630] pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
          <KeyRound size={24} className="text-[#FF1F3D]" />
          <span>{isRTL ? "إعدادات أمان الحساب" : "Security & Account Settings"}</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1">
          {isRTL
            ? "تحديث كلمة السر لحسابك وتأكيد الأمان."
            : "Update your account password for safety."}
        </p>
      </div>

      {/* Single Password Form Card */}
      <div className="bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col gap-5">
        
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#1E2630] pb-3">
          <div className="w-8 h-8 rounded-full bg-red-500/10 text-[#FF1F3D] flex items-center justify-center">
            <Lock size={16} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">
              {isRTL ? "تغيير كلمة السر" : "Change Password"}
            </h2>
            <span className="text-[11px] text-gray-400 block">
              {isRTL ? "أدخل كلمة السر الحالية ثم كلمة السر الجديدة لتحديثها" : "Enter current and new password below to update"}
            </span>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 text-xs">
          
          {/* Current Password */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-[#AAB4C0] mb-1.5">
              {isRTL ? "كلمة السر الحالية *" : "Current Password *"}
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                required
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#151C24] text-gray-900 dark:text-white px-3.5 py-3 rounded-xl border border-gray-200 dark:border-[#26313D] font-semibold focus:outline-none focus:border-[#FF1F3D] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* New Password */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-[#AAB4C0] mb-1.5">
                {isRTL ? "كلمة السر الجديدة *" : "New Password *"}
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#151C24] text-gray-900 dark:text-white px-3.5 py-3 rounded-xl border border-gray-200 dark:border-[#26313D] font-semibold focus:outline-none focus:border-[#FF1F3D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-400 hover:text-gray-600 dark:hover:text-[#F5F7FA] cursor-pointer"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-[#AAB4C0] mb-1.5">
                {isRTL ? "تأكيد كلمة السر الجديدة *" : "Confirm New Password *"}
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#151C24] text-gray-900 dark:text-white px-3.5 py-3 rounded-xl border border-gray-200 dark:border-[#26313D] font-semibold focus:outline-none focus:border-[#FF1F3D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-400 hover:text-gray-600 dark:hover:text-[#F5F7FA] cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

          </div>

          {/* Security Info Badge */}
          <div className="p-3 bg-red-500/5 border border-[#FF1F3D]/20 rounded-2xl flex items-start gap-2 text-[11px] text-gray-600 dark:text-[#AAB4C0] mt-1">
            <ShieldCheck size={16} className="text-[#FF1F3D] shrink-0 mt-0.5" />
            <span>
              {isRTL
                ? "يتم تشفير وتحديث كلمة السر الخاصة بك فوراً في قاعدة بيانات حسابك."
                : "Your password is encrypted and updated immediately."}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 py-3 px-6 bg-[#FF1F3D] hover:bg-[#E01833] disabled:opacity-50 text-white font-bold rounded-xl shadow-md hover:shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 self-start"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{isRTL ? "جاري الحفظ..." : "Updating..."}</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>{isRTL ? "حفظ كلمة السر الجديدة" : "Update Password"}</span>
              </>
            )}
          </button>

        </form>
      </div>

    </div>
  );
}
