import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ShoppingBag, Loader2, CheckCircle2, ExternalLink, Phone, Link2, ChevronRight } from "lucide-react";
import { useLanguage } from "../../providers/LanguageContext";
import { useShopStore } from "../../store/useShopStore";
import { useCustomOrderForm } from "../../hooks/useCustomOrderForm";
import { customOrderService } from "../../services/customOrderService";
import CustomImageUploader from "../../components/CustomImageUploader";
import DimensionInputs from "../../components/DimensionInputs";
import QuantitySelector from "../../components/QuantitySelector";

export default function CustomOrderPage() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const addToCart = useShopStore((state) => state.addToCart);

  const {
    files,
    previews,
    makerworldUrl,
    phoneNumber,
    category,
    isMask,
    description,
    length,
    width,
    maskHeight,
    circularWidth,
    quantity,
    material,
    color,
    errors,
    isSubmitting,
    setMakerworldUrl,
    setPhoneNumber,
    setCategory,
    setDescription,
    setLength,
    setWidth,
    setMaskHeight,
    setCircularWidth,
    setQuantity,
    setIsSubmitting,
    handleAddFiles,
    handleRemoveImage,
    validateForm,
    resetForm,
  } = useCustomOrderForm(isRTL);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload files
      const imageUrls = await customOrderService.uploadCustomImages(files);

      // 2. Create Custom Cart Item
      const customItem = customOrderService.createCustomOrderItem({
        description,
        imageUrls,
        makerworldUrl,
        phoneNumber,
        category,
        isMask,
        maskHeight,
        circularWidth,
        length,
        width,
        quantity,
        material: "PLA",
        color,
        isRTL,
      });

      // 3. Add to Cart store
      addToCart(customItem, quantity);

      // Save order to MIXO_customer_orders and MIXO_contact_messages for Admin Dashboard
      try {
        const newOrderObj = {
          id: 'ORD-3D-' + Math.floor(1000 + Math.random() * 9000),
          type: '3d_custom',
          customer: {
            name: isRTL ? 'عميل 3D مخصص' : 'Custom 3D Customer',
            phone: phoneNumber,
            address: makerworldUrl ? `MakerWorld URL: ${makerworldUrl}` : 'تصميم مخصص مرفوع'
          },
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          total: 0,
          status: 'Pending Quote',
          paymentMethod: isRTL ? 'بانتظار التسعير' : 'Pending Quote',
          customData: {
            url: makerworldUrl,
            mask: isMask ? `${maskHeight || ''} x ${circularWidth || ''} cm` : `${length || ''} x ${width || ''} cm`,
            filament: material || 'PLA Plus',
            notes: description
          },
          items: [
            { id: customItem.id, name: customItem.name, price: 0, quantity: Number(quantity) || 1 }
          ]
        };

        const existingOrders = JSON.parse(localStorage.getItem('MIXO_customer_orders') || '[]');
        localStorage.setItem('MIXO_customer_orders', JSON.stringify([newOrderObj, ...existingOrders]));

        const newMessageObj = {
          id: 'MSG-3D-' + Date.now(),
          name: isRTL ? 'عميل 3D مخصص' : 'Custom 3D Customer',
          phone: phoneNumber,
          email: `${phoneNumber}@mixo3d.com`,
          subject: 'طلب تسعير مجسم 3D مخصص',
          type: 'custom_quote',
          message: `وصف الموديل: ${description || 'لا يوجد'}\nأبعاد: ${isMask ? maskHeight + 'x' + circularWidth : length + 'x' + width} cm`,
          link: makerworldUrl,
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'unread'
        };

        const existingMsgs = JSON.parse(localStorage.getItem('MIXO_contact_messages') || '[]');
        localStorage.setItem('MIXO_contact_messages', JSON.stringify([newMessageObj, ...existingMsgs]));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error('Custom Order save error:', e);
      }

      // 4. Alert & Redirect
      alert(
        isRTL
          ? `تمت إضافة طلبك المخصص بنجاح! سنتواصل معك قريباً على الرقم (${phoneNumber}) لتحديد السعر.`
          : `Custom order added successfully! We will contact you soon on (${phoneNumber}) with your price quote.`
      );

      resetForm();
      navigate("/cart");
    } catch (err) {
      console.error("Custom Order Page Submit Error:", err);
      alert(isRTL ? "حدث خطأ أثناء إضافة الطلب." : "An error occurred while submitting your custom order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B10] text-gray-900 dark:text-[#F5F7FA] font-sans pb-20 pt-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Title Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-[#7F8A96] mb-2">
            <span onClick={() => navigate("/")} className="hover:underline cursor-pointer">
              {isRTL ? "الرئيسية" : "Home"}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FF1F3D] font-semibold">
              {isRTL ? "طلب تصميم مخصص" : "Custom 3D Order"}
            </span>
          </div>

          <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/5 dark:from-[#151C24] dark:to-[#0F151D] p-6 sm:p-8 rounded-3xl border border-red-500/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FF1F3D]/10 text-[#FF1F3D] px-3 py-1 rounded-full text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRTL ? "خدمة الطباعة المخصصة 3D" : "Custom 3D Printing Service"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {isRTL ? "صمم طلبك الـ 3D الخاص" : "Customize Your 3D Print Order"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#AAB4C0] mt-1 max-w-xl">
                {isRTL
                  ? "ابحث في MakerWorld، ارفع الصور، وحدد الأبعاد ورقم التليفون لنتواصل معك وتحديد السعر المناسب."
                  : "Search MakerWorld, upload your reference images, specify dimensions and phone number for price quote contact."}
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white dark:bg-[#0F151D] rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: MAKERWORLD BANNER & LINK */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-[#151C24] dark:to-[#1A232E] p-4 sm:p-5 rounded-2xl border border-[#FF1F3D]/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FF1F3D] flex items-center gap-1.5">
                  <Link2 className="w-4 h-4" />
                  <span>{isRTL ? "الخطوة 1: البحث في MakerWorld.com" : "Step 1: Search on MakerWorld.com"}</span>
                </span>
                <a
                  href="https://makerworld.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#FF1F3D] hover:bg-[#E01833] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>MakerWorld.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-gray-600 dark:text-[#AAB4C0] leading-relaxed">
                {isRTL
                  ? "💡 ادخل على MakerWorld.com، ضع صورة تصميمك في شريط البحث هناك، اختر المجسم المناسب وانسخ رابط الصفحة وضعه هنا:"
                  : "💡 Visit MakerWorld.com, search using your image/idea, choose a 3D model, copy its page link and paste it below:"}
              </p>

              {/* MakerWorld Link Input */}
              <div className="relative">
                <input
                  type="url"
                  value={makerworldUrl}
                  onChange={(e) => setMakerworldUrl(e.target.value)}
                  placeholder="https://makerworld.com/en/models/..."
                  className="w-full bg-white dark:bg-[#0F151D] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-10 border border-gray-200 dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
                />
                <Link2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* STEP 2: PHONE NUMBER (For Price Quote Contact) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FF1F3D]" />
                <span>{isRTL ? "رقم التليفون للتواصل وتحديد السعر *" : "Phone Number (For Price Quote & Contact) *"}</span>
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={isRTL ? "مثال: 01012345678" : "e.g. 01012345678"}
                className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-3 px-3.5 border focus:outline-none transition-all ${
                  errors.phoneNumber
                    ? "border-red-500 focus:border-red-500"
                    : "border-transparent dark:border-[#26313D] focus:border-gray-300 dark:focus:border-[#384656]"
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-[11px] font-medium text-red-500 dark:text-red-400">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* STEP 3: CATEGORY SELECTION */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                {isRTL ? "قسم الطلب (Category) *" : "Order Category *"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] text-xs sm:text-sm rounded-xl p-3 border border-transparent dark:border-[#26313D] focus:outline-none font-medium"
              >
                <option value="figures">🐉 Figures & Collectibles (مجسمات ومقتنيات)</option>
                <option value="decor">🪴 Home Decor (ديكور المنزل)</option>
                <option value="stands">📱 Phone Stands (حوامل الهواتف)</option>
                <option value="tools">⚙️ Tools & Functional (أدوات ومستلزمات)</option>
                <option value="vases">🏺 Vases & Art (فازات وتحف فنية)</option>
                <option value="gaming">🎮 Gaming (ألعاب وإكسسوارات)</option>
                <option value="masks">🎭 Masks & Wearables (ماسكات وأقنعة)</option>
                <option value="keychains">🔑 Keychains (ميداليات)</option>
                <option value="more">💬 Other (أخرى)</option>
              </select>
            </div>

            {/* STEP 4: UPLOAD DESIGN IMAGES */}
            <CustomImageUploader
              previews={previews}
              onAddFiles={handleAddFiles}
              onRemoveImage={handleRemoveImage}
              error={errors.images}
              isRTL={isRTL}
            />

            {/* STEP 5: DESCRIBE YOUR DESIGN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
                  {isRTL ? "اوصف التصميم *" : "Describe Your Design *"}
                </label>
                <span className="text-[10px] text-gray-400 dark:text-[#7F8A96]">
                  {description.length} / 1000
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isRTL
                    ? "اكتب تفاصيل التصميم، الألوان، الخامة، وأي متطلبات خاصة..."
                    : "Tell us what you want us to print, including details, colors, materials, or special requirements..."
                }
                className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl p-3.5 border focus:outline-none transition-all ${
                  errors.description
                    ? "border-red-500 focus:border-red-500"
                    : "border-transparent dark:border-[#26313D] focus:border-gray-300 dark:focus:border-[#384656]"
                }`}
              />
              {errors.description && (
                <p className="text-[11px] font-medium text-red-500 dark:text-red-400">
                  {errors.description}
                </p>
              )}
            </div>

            {/* STEP 6: DYNAMIC DIMENSIONS */}
            <DimensionInputs
              isMask={isMask}
              length={length}
              width={width}
              maskHeight={maskHeight}
              circularWidth={circularWidth}
              onChangeLength={setLength}
              onChangeWidth={setWidth}
              onChangeMaskHeight={setMaskHeight}
              onChangeCircularWidth={setCircularWidth}
              errors={errors}
              isRTL={isRTL}
            />

            {/* STEP 7: QUANTITY & PLA MATERIAL DISPLAY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                isRTL={isRTL}
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA] mb-1.5">
                  {isRTL ? "خامة الطباعة (Material):" : "Printing Material:"}
                </label>
                <div className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] text-xs sm:text-sm rounded-xl p-3 border border-transparent dark:border-[#26313D] font-bold flex items-center justify-between">
                  <span>🌱 PLA (High-Quality Eco Filament)</span>
                  <span className="text-[10px] bg-red-500/10 text-[#FF1F3D] px-2.5 py-0.5 rounded-full font-semibold">
                    {isRTL ? "الماتيريال الأساسي" : "Standard Material"}
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 8: SUMMARY PREVIEW */}
            <div className="bg-gray-50 dark:bg-[#151C24] rounded-2xl p-5 border border-gray-200 dark:border-[#26313D] space-y-3">
              <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isRTL ? "ملخص الطلب المخصص" : "Custom Order Summary"}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 dark:text-[#7F8A96]">{isRTL ? "رقم الهاتف:" : "Phone:"} </span>
                  <span className="font-semibold text-gray-900 dark:text-white">{phoneNumber || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-[#7F8A96]">{isRTL ? "النوع:" : "Type:"} </span>
                  <span className="font-semibold text-gray-900 dark:text-white">{isMask ? "Mask (ماسك)" : category}</span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-[#7F8A96]">{isRTL ? "الأبعاد:" : "Size:"} </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isMask
                      ? `${maskHeight || "0"} × ${circularWidth || "0"} cm (Circular)`
                      : `${length || "0"} × ${width || "0"} cm`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-[#7F8A96]">{isRTL ? "السعر المقدر:" : "Price:"} </span>
                  <span className="font-bold text-[#FF1F3D]">
                    {isRTL ? "في انتظار تحديد السعر" : "Pending Quote"}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF1F3D] hover:bg-[#E01833] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl text-sm sm:text-base shadow-lg shadow-red-600/25 transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isRTL ? "جاري الإضافة إلى السلة..." : "Adding Custom Order to Cart..."}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{isRTL ? "إضافة الطلب المخصص إلى السلة" : "Add Custom Order to Cart"}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
