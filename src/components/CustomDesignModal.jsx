import React, { useEffect, useRef } from "react";
import { X, Sparkles, ShoppingBag, Loader2, CheckCircle2, ExternalLink, Phone, Link2 } from "lucide-react";
import { useLanguage } from "../providers/LanguageContext";
import { useShopStore } from "../store/useShopStore";
import { useCustomOrderForm } from "../hooks/useCustomOrderForm";
import { customOrderService } from "../services/customOrderService";
import CustomImageUploader from "./CustomImageUploader";
import DimensionInputs from "./DimensionInputs";
import QuantitySelector from "./QuantitySelector";
import { saveSupabaseOrder, saveSupabaseMessage } from "../services/db.service";

export default function CustomDesignModal({ isOpen, onClose }) {
  const { isRTL } = useLanguage();
  const modalRef = useRef(null);

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
    setMaterial,
    setColor,
    setIsSubmitting,
    handleAddFiles,
    handleRemoveImage,
    validateForm,
    resetForm,
  } = useCustomOrderForm(isRTL);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard ESC listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
        material,
        color,
        isRTL,
      });

      // 3. Add to existing Cart store
      addToCart(customItem, quantity);

      // Save Pending Quote Order and Contact Message for Admin Dashboard & Supabase
      try {
        const primaryFileUrl = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

        const newQuoteOrder = {
          id: "MIX-3D-QUOTE-" + Math.floor(Math.random() * 9000 + 1000),
          type: "3d_custom",
          createdAt: new Date().toISOString(),
          date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
          status: "Pending Quote",
          paymentMethod: isRTL ? "في انتظار مراجعة وتحديد السعر" : "Price Quote Pending",
          total: 0,
          customer: {
            name: isRTL ? "طلب 3D مخصص" : "Custom 3D Request",
            phone: phoneNumber,
            email: `${phoneNumber}@mixo3d.com`,
            address: makerworldUrl ? `MakerWorld URL: ${makerworldUrl}` : "تصميم 3D مخصص مرفوع",
          },
          customData: {
            url: makerworldUrl,
            fileUrl: primaryFileUrl,
            uploadedFiles: imageUrls || [],
            mask: isMask ? `${maskHeight || ''} x ${circularWidth || ''} cm` : `${length || ''} x ${width || ''} cm`,
            filament: material || "PLA Plus",
            notes: description,
          },
          items: [
            {
              name: category ? `3D Print Quote Request (${category})` : "Custom 3D Model Quote Request",
              quantity: Number(quantity) || 1,
              price: 0,
              category: category || "Custom 3D",
              material: material || "High-Quality Eco PLA Filament",
              faceHeight: maskHeight,
              faceWidth: circularWidth,
              makerworldUrl,
              images: imageUrls || [],
            },
          ],
        };

        await saveSupabaseOrder(newQuoteOrder);

        const newMessage = {
          id: "MSG-3D-" + Date.now(),
          name: isRTL ? "طلب 3D مخصص" : "Custom 3D Request",
          phone: phoneNumber,
          email: `${phoneNumber}@mixo3d.com`,
          subject: `Custom 3D Quote Request (${category || "General"})`,
          message: `MakerWorld URL: ${makerworldUrl || "None"}\nDimensions: ${maskHeight || "N/A"}cm x ${circularWidth || "N/A"}cm\nDescription: ${description || "N/A"}\nFiles: ${imageUrls.join(', ')}`,
          status: "unread",
          date: new Date().toLocaleDateString(),
        };

        await saveSupabaseMessage(newMessage);
      } catch (e) {
        console.error("Custom Order Modal Save Error:", e);
      }

      // 4. Alert & Reset
      alert(
        isRTL
          ? `تمت إضافة طلبك المخصص بنجاح! سنتواصل معك قريباً على الرقم (${phoneNumber}) لتحديد السعر.`
          : `Custom order added successfully! We will contact you soon on (${phoneNumber}) with your price quote.`
      );

      resetForm();
      onClose();
    } catch (err) {
      console.error("Custom Order Submit Error:", err);
      alert(isRTL ? "حدث خطأ أثناء إضافة الطلب." : "An error occurred while submitting your custom order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl bg-white dark:bg-[#0F151D] text-gray-900 dark:text-[#F5F7FA] rounded-t-3xl sm:rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in slide-in-from-bottom duration-300"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1E2630] bg-gray-50/50 dark:bg-[#151C24]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF1F3D]/10 text-[#FF1F3D] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-tight">
                {isRTL ? "صمم طلبك (طلب 3D مخصص)" : "Customize Your Design"}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-400 dark:text-[#7F8A96]">
                {isRTL ? "اختر المجسم من MakerWorld وأدخل تفاصيل الأبعاد ورقم التليفون" : "Choose 3D model from MakerWorld and enter your specs"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#151C24] text-gray-500 hover:text-black dark:text-[#AAB4C0] dark:hover:text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: MAKERWORLD BANNER & LINK */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-[#151C24] dark:to-[#1A232E] p-4 rounded-2xl border border-[#FF1F3D]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF1F3D] flex items-center gap-1.5">
                <Link2 className="w-4 h-4" />
                <span>{isRTL ? "الخطوة 1: البحث في MakerWorld.com" : "Step 1: Search on MakerWorld.com"}</span>
              </span>
              <a
                href="https://makerworld.com"
                target="_blank"
                rel="noreferrer"
                className="bg-[#FF1F3D] hover:bg-[#E01833] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 shadow-sm transition-all"
              >
                <span>MakerWorld.com</span>
                <ExternalLink className="w-3 h-3" />
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
                className="w-full bg-white dark:bg-[#0F151D] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 pl-3.5 pr-10 border border-gray-200 dark:border-[#26313D] focus:border-[#FF1F3D] focus:outline-none"
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
              className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 px-3.5 border focus:outline-none transition-all ${
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
              className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] text-xs sm:text-sm rounded-xl p-2.5 border border-transparent dark:border-[#26313D] focus:outline-none font-medium"
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
              rows={3}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isRTL
                  ? "اكتب تفاصيل التصميم، الألوان، الخامة، وأي متطلبات خاصة..."
                  : "Tell us what you want us to print, including details, colors, materials, or special requirements..."
              }
              className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl p-3 border focus:outline-none transition-all ${
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

          {/* STEP 6: DYNAMIC DIMENSIONS (Standard vs Mask Circular Dimensions) */}
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

          {/* STEP 7: QUANTITY & MATERIAL */}
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
              <div className="w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] text-xs sm:text-sm rounded-xl p-2.5 border border-transparent dark:border-[#26313D] font-bold flex items-center justify-between">
                <span>🌱 PLA</span>
              </div>
            </div>
          </div>

          {/* STEP 8: SUMMARY PREVIEW */}
          <div className="bg-gray-50 dark:bg-[#151C24] rounded-2xl p-4 border border-gray-200 dark:border-[#26313D] space-y-2 text-xs">
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{isRTL ? "ملخص الطلب المخصص" : "Custom Order Summary"}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-[#AAB4C0] text-[11px]">
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
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF1F3D] hover:bg-[#E01833] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all duration-200 flex items-center justify-center gap-2 min-h-[48px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isRTL ? "جاري الإضافة إلى السلة..." : "Adding Custom Order to Cart..."}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isRTL ? "إضافة الطلب المخصص إلى السلة" : "Add Custom Order to Cart"}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
