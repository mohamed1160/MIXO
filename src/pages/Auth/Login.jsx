import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";
import mixoLogoImg from "../../assets/images/logo/mixo_red_logo.png";
import { useSEO } from "../../hooks/useSEO";

const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "البريد الإلكتروني أو رقم الهاتف مطلوب / Email or Phone number is required"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة / Password is required"),
});

export default function Login() {
  const { isRTL } = useLanguage();

  // ── SEO (noindex) ──
  useSEO({ noindex: true });

  const [showPassword, setShowPassword] = useState(false);
  const {
    user,
    login,
    isLoading: authLoading,
    isAuthenticated,
    error: authError,
  } = useAuthStore();
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
    <div className="relative min-h-screen font-sans flex flex-col justify-center items-center px-4 py-16 overflow-hidden">
      {/* ── Background: GIF for desktop/tablet, video MP4 for mobile (iOS) ── */}
      <div
        className="absolute inset-0 hidden sm:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/login_bg_desktop.gif')" }}
      />
      <video
        className="absolute inset-0 sm:hidden w-full h-full object-cover"
        src="/images/mobile_bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* ── Glassmorphism Card ── */}
      <div className="relative z-10 w-full max-w-md bg-white/[0.05] backdrop-blur-[24px] border border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 sm:p-10 text-white my-auto">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Link to="/">
            <img
              src={mixoLogoImg}
              alt="Mixo Logo"
              className="h-12 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
            />
          </Link>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {isRTL ? "تسجيل الدخول" : "Sign In"}
          </h2>
          <p className="text-xs text-white/80 mt-1 drop-shadow font-medium">
            {isRTL
              ? "أدخل البريد الإلكتروني أو الهاتف للمتابعة"
              : "Enter your email or phone number to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Global Auth Error */}
          {authError && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold rounded-xl text-center backdrop-blur-md">
              {authError}
            </div>
          )}

          {/* Email or Phone Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-white drop-shadow">
              {isRTL ? "البريد الإلكتروني أو رقم الهاتف *" : "Email or Phone Number *"}
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("identifier")}
                placeholder={
                  isRTL
                    ? "مثال: 01012345678 أو email@example.com"
                    : "e.g. 01012345678 or name@example.com"
                }
                className={`w-full bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all focus:outline-none backdrop-blur-sm ${
                  errors.identifier
                    ? "border-red-500 focus:border-red-500 bg-red-500/10"
                    : "border-white/20 focus:border-white/60 focus:bg-white/15"
                }`}
              />
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            </div>
            {errors.identifier && (
              <p className="text-[11px] font-semibold text-red-400 drop-shadow">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                {isRTL ? "كلمة المرور *" : "Password *"}
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-[#FF1F3D] hover:underline drop-shadow"
              >
                {isRTL ? "نسيت كلمة المرور؟" : "Forgot Password?"}
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder={isRTL ? "أدخل كلمة المرور" : "Enter password"}
                className={`w-full bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all focus:outline-none backdrop-blur-sm ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 bg-red-500/10"
                    : "border-white/20 focus:border-white/60 focus:bg-white/15"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-semibold text-red-400 drop-shadow">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmittingForm}
            className="w-full bg-gradient-to-r from-[#FF1F3D] to-[#E01833] hover:from-[#ff3352] hover:to-[#c8102e] disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-xl shadow-red-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
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
        <div className="text-center pt-4 text-xs text-white/80 drop-shadow">
          {isRTL ? "ليس لديك حساب بعد؟" : "Don't have an account?"}{" "}
          <Link to="/register" className="text-[#FF1F3D] font-black hover:underline">
            {isRTL ? "أنشئ حساباً جديداً" : "Create Account"}
          </Link>
        </div>
      </div>
    </div>
  );
}
