import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, Apple, User, Phone, CheckCircle2, Sparkles, Printer, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";
import mixoLogoImg from "../../assets/images/logo/mixo_red_logo.png";
import heroDragonImg from "../../assets/images/3dprint/hero_dragon.jpg";
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

  const { register: registerAction, isLoading: authLoading, isAuthenticated, error: authError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/account";

  useEffect(() => {
    if (!authLoading && isAuthenticated && !showSuccessModal && !isCustomLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from, showSuccessModal, isCustomLoading]);

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

      // 2-second simulation delay for user feedback
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const success = await registerAction(userData);
      setIsCustomLoading(false);

      if (success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 2000);
      }
    } catch (err) {
      setIsCustomLoading(false);
      console.error("Registration failed:", err);
    }
  };

  const isSubmittingForm = isSubmitting || authLoading || isCustomLoading;

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
              <span>{isRTL ? "انضم لعائلة ميكسو" : "Join Mixo 3D Hub"}</span>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
              {isRTL ? "أنشئ حسابك واستمتع بعالم الطباعة 3D" : "Create Account & Experience 3D Printing"}
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isRTL
                ? "سجل حساب جديد لتقديم طلبات مخصصة عبر MakerWorld ومتابعة حالة شحناتك بسهولة."
                : "Join Mixo to submit MakerWorld custom prints, request quotes, and manage orders."}
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
            <span>© 2026 Mixo 3D</span>
            <span className="flex items-center gap-1 text-[#FF1F3D] font-bold">
              <Sparkles className="w-3 h-3" /> 100% Eco PLA
            </span>
          </div>
        </div>

        {/* Right Side: Register Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6">
          
          <div className="text-center lg:text-start space-y-2">
            <Link to="/" className="lg:hidden inline-block mb-2">
              <img src={mixoLogoImg} alt="Mixo Logo" className="h-10 w-auto mx-auto object-contain" />
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isRTL ? "إنشاء حساب جديد" : "Create Your Account"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96]">
              {isRTL ? "أدخل تفاصيلك الشخصية للبدء" : "Enter your personal details to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Global Auth Error */}
            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold rounded-xl text-center">
                {authError}
              </div>
            )}

            {/* Name Fields (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "الاسم الأول *" : "First Name *"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("firstName")}
                    placeholder={isRTL ? "الاسم الأول" : "First Name"}
                    className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all ${
                      errors.firstName ? "border-red-500 focus:border-red-500" : "border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                    }`}
                  />
                  <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.firstName && <p className="text-[11px] font-medium text-red-500">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "اسم العائلة *" : "Last Name *"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder={isRTL ? "اسم العائلة" : "Last Name"}
                    className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all ${
                      errors.lastName ? "border-red-500 focus:border-red-500" : "border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                    }`}
                  />
                  <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.lastName && <p className="text-[11px] font-medium text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email & Phone (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "البريد الإلكتروني *" : "Email Address *"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="user@example.com"
                    className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all ${
                      errors.email ? "border-red-500 focus:border-red-500" : "border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                    }`}
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.email && <p className="text-[11px] font-medium text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "رقم الهاتف *" : "Phone Number *"}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="01012345678"
                    className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all ${
                      errors.phone ? "border-red-500 focus:border-red-500" : "border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                    }`}
                  />
                  <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.phone && <p className="text-[11px] font-medium text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Password & Confirm Password (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "كلمة المرور *" : "Password *"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all ${
                      errors.password ? "border-red-500 focus:border-red-500" : "border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {currentPassword && !errors.password && (
                  <div className="mt-1">
                    <div className="h-1 w-full bg-gray-200 dark:bg-[#26313D] rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 mt-0.5 block text-end">
                      {isRTL ? strength.labelAr : strength.labelEn}
                    </span>
                  </div>
                )}
                {errors.password && <p className="text-[11px] font-medium text-red-500">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "تأكيد كلمة المرور *" : "Confirm Password *"}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="••••••••"
                    className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border transition-all ${
                      errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] font-medium text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingForm}
              className="w-full bg-[#FF1F3D] hover:bg-[#E01833] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 mt-2"
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
          <div className="text-center pt-2 text-xs text-gray-500 dark:text-[#7F8A96]">
            {isRTL ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <Link to="/login" className="text-[#FF1F3D] font-bold hover:underline">
              {isRTL ? "تسجيل الدخول" : "Sign In"}
            </Link>
          </div>

        </div>

      </div>

      {/* 2-Second Loader Overlay */}
      {isCustomLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0F151D] p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-[#1E2630] flex flex-col items-center gap-4 text-center max-w-xs mx-4">
            <Loader2 className="w-10 h-10 text-[#FF1F3D] animate-spin" />
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                {isRTL ? "جاري إنشاء حسابك..." : "Creating Your Account..."}
              </h4>
              <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1">
                {isRTL ? "يرجى الانتظار لحظات لتجهيز ملفك في ميكسو." : "Please wait a moment while we set up your Mixo profile."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0F151D] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-[#1E2630] flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                {isRTL ? "تم إنشاء الحساب بنجاح! 🎉" : "Account Created Successfully! 🎉"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1.5 leading-relaxed">
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
