import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Lock,
  Mail,
  Phone,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/useAuthStore';

export default function AdminSecurity() {
  const { user, changePassword, updateUser } = useAuthStore();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Profile credentials state
  const [email, setEmail] = useState(user?.email || 'admin@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '01000000000');
  const [firstName, setFirstName] = useState(user?.firstName || 'Admin');
  const [lastName, setLastName] = useState(user?.lastName || 'System');
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

  // Password strength helper
  const getStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { score, label: 'ضعيفة جداً 🔴', color: 'bg-red-500' };
    if (score <= 50) return { score, label: 'مقبولة 🟠', color: 'bg-amber-500' };
    if (score <= 75) return { score, label: 'جيدة 🟡', color: 'bg-yellow-500' };
    return { score: 100, label: 'قوية ممتازة 🟢', color: 'bg-emerald-500' };
  };

  const strength = getStrength(newPassword);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('برجاء إدخال كلمة السر الحالية');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('كلمة السر الجديدة يجب أن تكون 6 أحرف أو أكثر');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('كلمة السر الجديدة وتأكيدها غير متطابقين');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('تم تحديث كلمة السر بنجاح! 🔒');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'فشل تحديث كلمة السر، تأكد من كلمة السر الحالية');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (!email || !phone) {
      toast.error('برجاء ملء البريد الإلكتروني ورقم الهاتف');
      return;
    }

    setIsUpdatingInfo(true);
    try {
      await updateUser({
        email,
        phone,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim()
      });
      toast.success('تم تحديث بيانات حساب الأدمن بنجاح 🎉');
    } catch (err) {
      toast.error('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 text-gray-900 dark:text-white min-h-screen dir-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#FF1F3D]" />
            الأمـان وتغيير كلمة السر (Admin Security)
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            إدارة كلمة السر الرئيسية للمدير، حماية الحساب وبيانات تسجيل الدخول للوحة التحكم
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl w-fit">
          <UserCheck className="w-4 h-4" />
          جلسة مشفرة وآمنة - صلاحيات مدير النظام Full Admin
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Change Password Card */}
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <KeyRound className="w-5 h-5 text-[#FF1F3D]" />
            تغيير كلمة السر الرئيسية للأدمن
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                كلمة السر الحالية *
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="أدخل كلمة السر الحالية..."
                  className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                كلمة السر الجديدة *
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة السر الجديدة (6 أحرف على الأقل)..."
                  className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gray-500 dark:text-gray-400">قوة كلمة السر:</span>
                    <span>{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                تأكيد كلمة السر الجديدة *
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد كتابة كلمة السر الجديدة..."
                  className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPass}
              className="w-full py-3 bg-[#FF1F3D] hover:bg-[#D91832] disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF1F3D]/20 cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" />
              {isChangingPass ? 'جاري تحديث كلمة السر...' : 'حفظ كلمة السر الجديدة'}
            </button>
          </form>
        </div>

        {/* Profile Credentials Card */}
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
              <Mail className="w-5 h-5 text-[#FF1F3D]" />
              بيانات الدخول والاتصال بالأدمن
            </h2>

            <form onSubmit={handleInfoSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    الاسم الأول
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    اسم العائلة / لقب الأدمن
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  البريد الإلكتروني للأدمن (Admin Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  رقم الهاتف المربوط بالحساب (Phone Number)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingInfo}
                className="w-full py-3 bg-gray-900 hover:bg-black dark:bg-[#1F2937] dark:hover:bg-[#374151] disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                <Save className="w-4 h-4" />
                {isUpdatingInfo ? 'جاري التحديث...' : 'تحديث البيانات الأساسية'}
              </button>
            </form>
          </div>

          <div className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <p className="leading-relaxed">
              تأكد من الاحتفاظ بكلمة السر والبريد الإلكتروني في مكان آمن. تغيير كلمة السر يسري فوراً على كافة الجلسات وقواعد البيانات.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
