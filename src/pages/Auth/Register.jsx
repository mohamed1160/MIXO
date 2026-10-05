import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";
import mixoLogoImg from "../../assets/images/logo/mixo_red_logo.png";
import { useSEO } from "../../hooks/useSEO";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z.string().min(8, "Valid phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const getPasswordStrength = (password) => {
  if (!password) return { labelEn: "", labelAr: "", color: "bg-transparent", width: "w-0" };
  if (password.length < 6) return { labelEn: "Weak", labelAr: "ضعيفة", color: "bg-red-500", width: "w-1/3" };
  if (password.length < 10 && !/[A-Z]/.test(password)) return { labelEn: "Medium", labelAr: "متوسطة", color: "bg-amber-500", width: "w-2/3" };
  return { labelEn: "Strong", labelAr: "قوية جداً", color: "bg-emerald-500", width: "w-full" };
};

export default function Register() {
  const { isRTL } = useLanguage();

  // ── SEO (noindex) ──
  useSEO({ noindex: true });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { register: registerAction, isLoading: authLoading, error: authError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/account";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const currentPassword = watch("password");
  const strength = getPasswordStrength(currentPassword);

  const onSubmit = async (data) => {
    try {
      setIsCustomLoading(true);
      const { confirmPassword, ...userData } = data;

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const success = await registerAction(userData);
      setIsCustomLoading(false);

      if (success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1800);
      }
    } catch (err) {
      setIsCustomLoading(false);
      console.error("Registration failed:", err);
    }
  };

  const isSubmittingForm = isSubmitting || authLoading || isCustomLoading;

  return (
    <div className="relative min-h-screen font-sans flex flex-col justify-center items-center px-4 py-16 overflow-hidden">
      {/* ── Background: Miles Morales Full Page ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/register_miles_bg.jpg')" }}
      />
      {/* Removed the heavy black global overlay so the background pops naturally */}

      {/* ── Glassmorphism Card (Crystal Clear Background) ── */}
      <div className="relative z-10 w-full max-w-xl bg-white/[0.02] backdrop-blur-[2px] border border-white/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 sm:p-10 text-white my-auto">
        {/* Logo */}
        <div className="flex justify-center mb-4">
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
            {isRTL ? "إنشاء حساب جديد" : "Create Your Account"}
          </h2>
          <p className="text-xs text-white/80 mt-1 drop-shadow font-medium">
            {isRTL
              ? "انضم لميكسو لمتابعة طلباتك المخصصة والطباعة 3D"
              : "Join Mixo to submit custom 3D orders and track deliveries"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Global Auth Error */}
          {authError && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold rounded-xl text-center backdrop-blur-md">
              {authError}
            </div>
          )}

          {/* Name Fields (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                {isRTL ? "الاسم الأول *" : "First Name *"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder={isRTL ? "الاسم الأول" : "First Name"}
                  className={`w-full bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all focus:outline-none backdrop-blur-sm ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500 bg-red-500/10"
                      : "border-white/20 focus:border-white/60 focus:bg-white/15"
                  }`}
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              </div>
              {errors.firstName && (
                <p className="text-[11px] font-semibold text-red-400 drop-shadow">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                {isRTL ? "اسم العائلة *" : "Last Name *"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder={isRTL ? "اسم العائلة" : "Last Name"}
                  className={`w-full bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all focus:outline-none backdrop-blur-sm ${
                    errors.lastName
                      ? "border-red-500 focus:border-red-500 bg-red-500/10"
                      : "border-white/20 focus:border-white/60 focus:bg-white/15"
                  }`}
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              </div>
              {errors.lastName && (
                <p className="text-[11px] font-semibold text-red-400 drop-shadow">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email & Phone (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                {isRTL ? "البريد الإلكتروني *" : "Email Address *"}
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="user@example.com"
                  className={`w-full bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all focus:outline-none backdrop-blur-sm ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 bg-red-500/10"
                      : "border-white/20 focus:border-white/60 focus:bg-white/15"
                  }`}
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-red-400 drop-shadow">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                {isRTL ? "رقم الهاتف *" : "Phone Number *"}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="01012345678"
                  className={`w-full bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all focus:outline-none backdrop-blur-sm ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500 bg-red-500/10"
                      : "border-white/20 focus:border-white/60 focus:bg-white/15"
                  }`}
                />
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              </div>
              {errors.phone && (
                <p className="text-[11px] font-semibold text-red-400 drop-shadow">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Password & Confirm Password (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                {isRTL ? "كلمة المرور *" : "Password *"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all focus:outline-none backdrop-blur-sm ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 bg-red-500/10"
                      : "border-white/20 focus:border-white/60 focus:bg-white/15"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {currentPassword && !errors.password && (
                <div className="mt-1">
                  <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                  </div>
                  <span className="text-[10px] font-bold text-white/70 mt-0.5 block text-end">
                    {isRTL ? strength.labelAr : strength.labelEn}
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="text-[11px] font-semibold text-red-400 drop-shadow">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                {isRTL ? "تأكيد كلمة المرور *" : "Confirm Password *"}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className={`w-full bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all focus:outline-none backdrop-blur-sm ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 bg-red-500/10"
                      : "border-white/20 focus:border-white/60 focus:bg-white/15"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] font-semibold text-red-400 drop-shadow">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmittingForm}
            className="w-full bg-gradient-to-r from-[#FF1F3D] to-[#E01833] hover:from-[#ff3352] hover:to-[#c8102e] disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-xl shadow-red-600/40 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {isSubmittingForm ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRTL ? "جاري إنشاء الحساب..." : "Creating Account..."}</span>
              </>
            ) : (
              <>
                <span>{isRTL ? "أنشئ الحساب الآن" : "Create Account"}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        {/* Bottom Redirect Link */}
        <div className="text-center pt-4 text-xs text-white/80 drop-shadow">
          {isRTL ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
          <Link to="/login" className="text-[#FF1F3D] font-black hover:underline">
            {isRTL ? "تسجيل الدخول" : "Sign In"}
          </Link>
        </div>
      </div>

      {/* 2-Second Loader Overlay */}
      {isCustomLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0F151D]/90 p-8 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center gap-4 text-center max-w-xs mx-4 text-white">
            <Loader2 className="w-10 h-10 text-[#FF1F3D] animate-spin" />
            <div>
              <h4 className="text-base font-bold">
                {isRTL ? "جاري إنشاء حسابك..." : "Creating Your Account..."}
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                {isRTL ? "يرجى الانتظار لحظات لتجهيز ملفك في ميكسو." : "Please wait a moment while we set up your Mixo profile."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0F151D]/95 text-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold">
                {isRTL ? "تم إنشاء الحساب بنجاح! 🎉" : "Account Created Successfully! 🎉"}
              </h3>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                {isRTL ? "أهلاً بك في عالم Mixo للطباعة 3D. جاري تحويلك لحسابك..." : "Welcome to Mixo 3D Hub! Redirecting to your account..."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(from, { replace: true })}
              className="w-full py-3 px-4 bg-[#FF1F3D] hover:bg-[#E01833] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              <span>{isRTL ? "الانتقال إلى حسابي" : "Continue to My Account"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
