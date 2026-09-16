import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Phone, Lock, Apple, ArrowRight, ArrowLeft, Printer, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";
import mixoLogoImg from "../../assets/images/logo/mixo_red_logo.png";
import heroDragonImg from "../../assets/images/3dprint/hero_dragon.jpg";

const loginSchema = z.object({
  phone: z.string().min(6, "Valid phone number is required"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const { isRTL } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, isLoading: authLoading, isAuthenticated, error: authError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const isAdminCheck = (u, phoneInput) => {
    if (phoneInput === "01000000000" || phoneInput === "admin@gmail.com") return true;
    if (u?.role === "admin" || u?.phone === "01000000000" || u?.email?.toLowerCase() === "admin@gmail.com") return true;
    return false;
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (isAdminCheck(user)) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, authLoading, user, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const loggedUser = await login(data.phone, data.password);
      if (loggedUser) {
        if (isAdminCheck(loggedUser, data.phone)) {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const isSubmittingForm = isSubmitting || authLoading;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B10] text-gray-900 dark:text-[#F5F7FA] font-sans flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-[#0F151D] rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        
        {/* Left Side: Visual Hero Card (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-b from-[#111823] to-[#070B10] p-8 flex-col justify-between overflow-hidden text-white">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${heroDragonImg})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F151D] via-transparent to-[#070B10]/80" />

          <div className="relative z-10 space-y-4">
            <Link to="/">
              <img src={mixoLogoImg} alt="Mixo Logo" className="h-10 w-auto object-contain" />
            </Link>
            <div className="inline-flex items-center gap-1.5 bg-[#FF1F3D]/10 text-[#FF1F3D] px-3 py-1 rounded-full text-xs font-bold border border-[#FF1F3D]/30">
              <Printer className="w-3.5 h-3.5" />
              <span>{isRTL ? "منصة الطباعة 3D" : "3D Print Platform"}</span>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
              {isRTL ? "مرحباً بك مجدداً في Mixo" : "Welcome Back to Mixo 3D Hub"}
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isRTL
                ? "سجل دخولك برقم التليفون لمتابعة طلبات الطباعة ثلاثية الأبعاد الخاصة بك وحفظ التصاميم المفضلة."
                : "Sign in with your phone number to track your custom 3D orders and request price quotes."}
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
            <span>© 2026 Mixo 3D</span>
            <span className="flex items-center gap-1 text-[#FF1F3D] font-bold">
              <Sparkles className="w-3 h-3" /> 100% Eco PLA
            </span>
          </div>
        </div>

        {/* Right Side: Login Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          
          <div className="text-center lg:text-start space-y-2">
            <Link to="/" className="lg:hidden inline-block mb-2">
              <img src={mixoLogoImg} alt="Mixo Logo" className="h-10 w-auto mx-auto object-contain" />
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isRTL ? "تسجيل الدخول برقم التليفون" : "Sign In with Phone Number"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96]">
              {isRTL ? "أدخل رقم تليفونك وكلمة المرور للمتابعة" : "Enter your registered phone number and password to access your profile"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Global Auth Error */}
            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold rounded-xl text-center">
                {authError}
              </div>
            )}

            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                {isRTL ? "رقم الهاتف *" : "Phone Number *"}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder={isRTL ? "أدخل رقم تليفونك (مثال: 01012345678)" : "e.g. 01012345678"}
                  className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                  }`}
                />
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="text-[11px] font-medium text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "كلمة المرور *" : "Password *"}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#FF1F3D] hover:underline"
                >
                  {isRTL ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder={isRTL ? "أدخل كلمة المرور" : "Enter password"}
                  className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-medium text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingForm}
              className="w-full bg-[#FF1F3D] hover:bg-[#E01833] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isRTL ? "جاري تسجيل الدخول..." : "Signing In..."}</span>
                </>
              ) : (
                <>
                  <span>{isRTL ? "تسجيل الدخول" : "Sign In"}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>

            {/* Social Divider */}
            <div className="flex items-center py-2">
              <div className="flex-1 border-t border-gray-200 dark:border-[#26313D]" />
              <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {isRTL ? "أو بواسطة" : "Or Continue With"}
              </span>
              <div className="flex-1 border-t border-gray-200 dark:border-[#26313D]" />
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="bg-[#F3F4F6] dark:bg-[#151C24] hover:bg-gray-200 dark:hover:bg-[#1C2530] border border-transparent dark:border-[#26313D] text-gray-800 dark:text-[#F5F7FA] text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="bg-[#F3F4F6] dark:bg-[#151C24] hover:bg-gray-200 dark:hover:bg-[#1C2530] border border-transparent dark:border-[#26313D] text-gray-800 dark:text-[#F5F7FA] text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Apple className="w-4 h-4" />
                <span>Apple</span>
              </button>
            </div>

          </form>

          {/* Bottom Redirect Link */}
          <div className="text-center pt-2 text-xs text-gray-500 dark:text-[#7F8A96]">
            {isRTL ? "ليس لديك حساب بعد؟" : "Don't have an account?"}{" "}
            <Link to="/register" className="text-[#FF1F3D] font-bold hover:underline">
              {isRTL ? "أنشئ حساباً جديداً" : "Create Account"}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
