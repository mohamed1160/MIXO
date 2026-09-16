import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Send,
  Plus,
  Minus,
  CheckCircle2,
  ExternalLink,
  Link2,
  MessageSquare,
  Printer,
  Ruler,
} from "lucide-react";
import { useLanguage } from "../../providers/LanguageContext";
import mixoLogoImg from "../../assets/images/logo/mixo_red_logo.png";
import CustomDesignModal from "../../components/CustomDesignModal";

export default function Contact() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    makerworldUrl: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    const newMessage = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      makerworldUrl: formData.makerworldUrl,
      subject: formData.subject || "3D Printing Price Quote",
      message: formData.message,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("MIXO_contact_messages") || "[]");
      localStorage.setItem("MIXO_contact_messages", JSON.stringify([newMessage, ...existing]));
    } catch (err) {
      console.error("Error saving contact message:", err);
    }

    setSubmittedSuccess(true);
    setFormData({
      name: "",
      phone: "",
      email: "",
      makerworldUrl: "",
      subject: "",
      message: "",
    });

    setTimeout(() => setSubmittedSuccess(false), 6000);
  };

  const faqs = [
    {
      qEn: "How do I get a price quote for a MakerWorld model or custom design?",
      qAr: "كيف يتم تحديد سعر الطلب المخصص أو موديل MakerWorld؟",
      aEn: "Simply copy the model URL from MakerWorld.com or upload your design images in our Custom Order form, enter your phone number, and our team will contact you with exact price options.",
      aAr: "انسخ رابط المجسم من MakerWorld.com أو ارفع صور تصميمك في نموذج الطلب المخصص مع رقم تليفونك، وبتتواصل معاك لتقديم السعر المحدد والتفاصيل.",
    },
    {
      qEn: "What 3D printing materials do you use?",
      qAr: "ما هي الخامة المستخدمة في الطباعة 3D؟",
      aEn: "We print using 100% High-Grade Premium PLA (Polylactic Acid). It is eco-friendly, non-toxic, highly durable, and provides smooth, detailed surface finishes.",
      aAr: "نحن نستخدم خامة PLA الفاخرة الصديقة للبيئة، وهي خامة غير سامة وتتميز بصلابة ممتازة وسلاسة عالية في دقة طبقات المجسمات.",
    },
    {
      qEn: "How do I measure my mask dimensions for custom fitting?",
      qAr: "كيف يمكنني قياس أبعاد الماسك للحصول على مقاس مضبوط؟",
      aEn: "When selecting Masks & Wearables, measure face height (from chin to top of forehead) and circular face width (contour across face from ear to ear in cm).",
      aAr: "عند طلب ماسك، اطلب قياس ارتفاع الوجه (من أسفل الذقن حتى أعلى الجبهة) والعرض الدائري للوجه (دوران الوجه من الأذن للأذن بالسم).",
    },
    {
      qEn: "How long does production and delivery take?",
      qAr: "كم يستغرق وقت الطباعة والتوصيل؟",
      aEn: "Standard 3D prints are processed within 24–72 hours depending on print time. Domestic delivery across Egypt takes 2–4 business days.",
      aAr: "تستغرق عملية الطباعة 3D من 24 إلى 72 ساعة حسب حجم وتفاصيل المجسم، ويتم التوصيل لجميع محافظات مصر خلال 2 إلى 4 أيام عمل.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B10] text-gray-900 dark:text-[#F5F7FA] font-sans pb-24 transition-colors duration-200">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111823] via-[#0D131C] to-[#070B10] text-white py-16 sm:py-24 border-b border-[#1E2630]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#FF1F3D]/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#FF1F3D]/10 border border-[#FF1F3D]/30 text-[#FF1F3D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>{isRTL ? "تواصل معنا وتحديد السعر" : "Contact & Price Quotes"}</span>
          </div>

          <img
            src={mixoLogoImg}
            alt="Mixo Logo"
            className="h-14 sm:h-18 w-auto object-contain mx-auto my-2"
          />

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {isRTL ? (
              <>
                نحن هنا لمساعدتك في <span className="text-[#FF1F3D]">طباعة أفكارك 3D</span>
              </>
            ) : (
              <>
                We Are Here to Bring Your <span className="text-[#FF1F3D]">3D Ideas to Life</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            {isRTL
              ? "هل لديك رابط مجسم من MakerWorld.com أو صورة تصميم وتريد معرفة السعر والميعاد؟ تواصل معنا مباشرة."
              : "Have a MakerWorld model link or design images and need a price quote? Reach out to our team."}
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="bg-[#FF1F3D] hover:bg-[#E01833] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRTL ? "صمم طلبك المخصص" : "Customize Order"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CONTACT CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Phone / WhatsApp */}
          <div className="bg-white dark:bg-[#0F151D] rounded-2xl p-5 border border-gray-100 dark:border-[#1E2630] shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {isRTL ? "الهاتف والواتساب" : "Phone & WhatsApp"}
              </span>
              <a href="tel:+201012345678" className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white hover:text-[#FF1F3D] transition-colors">
                01012345678
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white dark:bg-[#0F151D] rounded-2xl p-5 border border-gray-100 dark:border-[#1E2630] shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF1F3D]/10 text-[#FF1F3D] flex items-center justify-center shrink-0 font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {isRTL ? "البريد الإلكتروني" : "Email Support"}
              </span>
              <a href="mailto:support@mixo3d.com" className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white hover:text-[#FF1F3D] transition-colors">
                support@mixo3d.com
              </a>
            </div>
          </div>

          {/* Material & Quality */}
          <div className="bg-white dark:bg-[#0F151D] rounded-2xl p-5 border border-gray-100 dark:border-[#1E2630] shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 font-bold">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {isRTL ? "الخامة الأساسية" : "Standard Material"}
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                🌱 100% Eco PLA
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-[#0F151D] rounded-2xl p-5 border border-gray-100 dark:border-[#1E2630] shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {isRTL ? "المقر والتوصيل" : "Location"}
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                {isRTL ? "القاهرة، مصر (توصيل لجميع المحافظات)" : "Cairo, Egypt"}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. CONTACT FORM & MAKERWORLD PROMO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0F151D] rounded-3xl border border-gray-100 dark:border-[#1E2630] p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                {isRTL ? "أرسل لنا استفسارك أوطلبك" : "Send Us a Message or Price Inquiry"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1">
                {isRTL
                  ? "قم بتعبئة النموذج وسيتواصل معك فريقنا هاتفياً لتحديد التفاصيل."
                  : "Fill in the form and our team will contact you with details and quotes."}
              </p>
            </div>

            {submittedSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <span>
                  {isRTL
                    ? "تم إرسال رسالتك بنجاح! سنتواصل معك هاتفياً في أسرع وقت."
                    : "Message sent successfully! We will contact you soon on your phone."}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                    {isRTL ? "الاسم *" : "Your Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isRTL ? "مثال: أحمد محمد" : "e.g. John Doe"}
                    className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 px-3.5 border border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#FF1F3D]" />
                    <span>{isRTL ? "رقم الهاتف للتواصل *" : "Phone Number *"}</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={isRTL ? "مثال: 01012345678" : "e.g. 01012345678"}
                    className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 px-3.5 border border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none transition-all"
                  />
                </div>

              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 px-3.5 border border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none transition-all"
                />
              </div>

              {/* MakerWorld Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#FF1F3D] flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{isRTL ? "رابط المجسم من MakerWorld.com (اختياري)" : "MakerWorld.com Model Link (Optional)"}</span>
                </label>
                <input
                  type="url"
                  value={formData.makerworldUrl}
                  onChange={(e) => setFormData({ ...formData, makerworldUrl: e.target.value })}
                  placeholder="https://makerworld.com/en/models/..."
                  className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 px-3.5 border border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none transition-all"
                />
              </div>

              {/* Message / Details */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "تفاصيل الطلب أو الرسالة *" : "Message & Order Details *"}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    isRTL
                      ? "اكتب تفاصيل طلبك، الألوان المفضل، أو أي استفسار آخر..."
                      : "Describe your order, required colors, dimensions, or questions..."
                  }
                  className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl p-3.5 border border-transparent dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#FF1F3D] hover:bg-[#E01833] text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isRTL ? "إرسال الاستفسار" : "Send Inquiry"}</span>
              </button>
            </form>
          </div>

          {/* Right Side: MakerWorld Card & Quick Custom Design */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* MakerWorld Guide Card */}
            <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>MakerWorld.com</span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">
                {isRTL ? "عايز تطلب موديل مباشر من MakerWorld؟" : "Want to Order directly from MakerWorld?"}
              </h3>
              <p className="text-xs leading-relaxed text-white/90">
                {isRTL
                  ? "ادخل على موقع MakerWorld.com، ابحث عن التصميم أو المجسم بالصورة اللي معاك، وانسخ رابط الموديل وحطه ف نموذج صمم طلبك لنتواصل معك وتحديد السعر."
                  : "Visit MakerWorld.com, search your model using image search, copy the model link and paste it in our custom order form."}
              </p>
              <button
                onClick={() => setIsCustomModalOpen(true)}
                className="w-full bg-white hover:bg-gray-100 text-[#FF1F3D] font-extrabold py-3 px-4 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isRTL ? "فتح نافذة صمم طلبك" : "Open Custom Order Modal"}</span>
              </button>
            </div>

            {/* Mask Fitting Dimensions Info */}
            <div className="bg-white dark:bg-[#0F151D] rounded-3xl p-6 border border-gray-100 dark:border-[#1E2630] shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-[#FF1F3D]">
                <Ruler className="w-5 h-5" />
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                  {isRTL ? "مقاسات دائرية للماسكات 🎭" : "Cosplay Mask Circular Dimensions 🎭"}
                </h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-[#7F8A96] leading-relaxed">
                {isRTL
                  ? "عند طلب ماسك، يطلب منك النظام ادخال ارتفاع الوجه والعرض الدائري (دوران الوجه من الأذن للأذن) لضمان مقاس مضبوط ومريح أثناء الارتداء."
                  : "When ordering masks, specify face height & circular face width (contour across face from ear to ear) for exact fitting."}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 4. FAQ ACCORDION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[#FF1F3D] font-bold text-xs uppercase tracking-wider">
            {isRTL ? "الأسئلة الشائعة" : "FAQ Support"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {isRTL ? "الأسئلة الأكثر تكراراً حول الطباعة 3D" : "Frequently Asked Questions"}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#0F151D] rounded-2xl border border-gray-100 dark:border-[#1E2630] overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors"
              >
                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-[#F5F7FA] pr-3">
                  {isRTL ? faq.qAr : faq.qEn}
                </span>
                {openFaq === index ? (
                  <Minus className="w-4 h-4 text-[#FF1F3D] shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {openFaq === index && (
                <div className="px-4 pb-5 sm:px-5 text-xs text-gray-600 dark:text-[#AAB4C0] border-t border-gray-100 dark:border-[#1E2630] pt-3 leading-relaxed">
                  {isRTL ? faq.aAr : faq.aEn}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Custom Order Modal Trigger */}
      <CustomDesignModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

    </div>
  );
}
