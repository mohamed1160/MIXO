import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, User, Phone, Mail, Lock, Apple, ArrowRight, ArrowLeft, Printer, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";
import mixoLogoImg from "../../assets/images/logo/mixo_red_logo.png";
import heroDragonImg from "../../assets/images/3dprint/hero_dragon.jpg";
import { useSEO } from "../../hooks/useSEO";

const loginSchema = z.object({
  identifier: z.string().min(3, "البريد الإلكتروني أو رقم الهاتف مطلوب / Email or Phone number is required"),
  password: z.string().min(1, "كلمة المرور مطلوبة / Password is required"),
});

export default function Login() {
  const { isRTL } = useLanguage();

  // ── SEO (noindex) ──
  useSEO({ noindex: true });

  const [showPassword, setShowPassword] = useState(false);
  const { user, login, isLoading: authLoading, isAuthenticated, error: authError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const isAdminCheck = (u, inputVal) => {
    if (inputVal === "01000000000" || inputVal?.toLowerCase() === "admin@gmail.com") return true;
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
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const loggedUser = await login(data.identifier, data.password);
      if (loggedUser) {
        if (isAdminCheck(loggedUser, data.identifier)) {
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
                ? "سجل دخولك بالبريد الإلكتروني أو رقم الهاتف لمتابعة طلبات الطباعة ثلاثية الأبعاد الخاصة بك."
                : "Sign in with your email or phone number to track your custom 3D orders and request price quotes."}
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
              {isRTL ? "تسجيل الدخول" : "Sign In"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96]">
              {isRTL ? "أدخل البريد الإلكتروني أو رقم الهاتف وكلمة المرور للمتابعة" : "Enter your email or phone number and password to access your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Global Auth Error */}
            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold rounded-xl text-center">
                {authError}
              </div>
            )}

            {/* Email or Phone Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                {isRTL ? "البريد الإلكتروني أو رقم الهاتف *" : "Email or Phone Number *"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("identifier")}
                  placeholder={isRTL ? "أدخل البريد أو رقم الهاتف (مثال: 01012345678 أو email@example.com)" : "e.g. 01012345678 or name@example.com"}
                  className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all ${
                    errors.identifier
                      ? "border-red-500 focus:border-red-500"
                      : "border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                  }`}
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.identifier && (
                <p className="text-[11px] font-medium text-red-500">{errors.identifier.message}</p>
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
