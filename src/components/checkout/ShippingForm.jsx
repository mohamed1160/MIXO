import React, { useState, useEffect } from 'react';
import { Mail, User, Phone, MapPin, Building, Sparkles, CheckCircle, Navigation } from 'lucide-react';
import { GOVERNORATE_RATES, calculateShippingFee } from '../../utils/shippingRates';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguage } from '../../providers/LanguageContext';

export default function ShippingForm({ register, errors, watch, cart, setValue }) {
  const { isRTL } = useLanguage();
  const { user } = useAuthStore();
  const userEmailKey = user?.email ? user.email.toLowerCase() : 'guest';

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);

  const inputClass = "w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-[#1A2332] border rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all duration-200";

  const selectedGov = watch ? watch("shipping.governorate") : "";
  const subtotal = (cart || []).reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 1)), 0);
  const shippingInfo = calculateShippingFee(selectedGov, subtotal);

  const handleAutofillAddress = (addr) => {
    setSelectedAddrId(addr.id);
    if (setValue) {
      if (addr.fullName) setValue("shipping.fullName", addr.fullName, { shouldValidate: true });
      if (addr.phone) setValue("shipping.phone", addr.phone, { shouldValidate: true });
      if (addr.street || addr.address) setValue("shipping.streetAddress", addr.street || addr.address, { shouldValidate: true });
      if (addr.city) setValue("shipping.city", addr.city, { shouldValidate: true });
      if (addr.governorate) setValue("shipping.governorate", addr.governorate, { shouldValidate: true });
      if (user?.email) setValue("contact.email", user.email, { shouldValidate: true });
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`MIXO_user_addresses_${userEmailKey}`) || localStorage.getItem('MIXO_current_user_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAddresses(parsed);
          const defaultAddr = parsed.find((a) => a.isDefault) || parsed[0];
          if (defaultAddr) {
            handleAutofillAddress(defaultAddr);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [userEmailKey]);

  return (
    <div className={`bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-8 font-sans text-gray-900 dark:text-white transition-colors ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      
      {/* ── Contact Section ── */}
      <div>
        <h2 className="text-base font-extrabold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#FF1F3D]" />
          <span>{isRTL ? "معلومات التواصل والبريد" : "Contact Information"}</span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              {isRTL ? "البريد الإلكتروني *" : "Email Address *"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                {...register("contact.email")}
                type="email" 
                placeholder={isRTL ? "بريدك الإلكتروني (example@mail.com)" : "you@example.com"}
                className={`${inputClass} ${errors.contact?.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700/70 focus:border-[#FF1F3D]'}`} 
              />
            </div>
            {errors.contact?.email && <p className="text-red-500 dark:text-red-400 text-[11px] mt-1 font-bold">{errors.contact.email.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("contact.newsletter")}
              id="newsletter"
              className="w-4 h-4 accent-[#FF1F3D] rounded cursor-pointer"
            />
            <label htmlFor="newsletter" className="text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
              {isRTL ? "ارسل لي تحديثات العروض وخصومات الطباعة 3D" : "Email me with new 3D model drops & offers"}
            </label>
          </div>
        </div>
      </div>

      {/* ── Saved Addresses Quick Select ── */}
      {savedAddresses.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-[#1A2332] rounded-2xl border border-gray-200 dark:border-[#FF1F3D]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FF1F3D] flex items-center gap-1.5">
              <Sparkles size={15} />
              <span>{isRTL ? "العناوين المحفوظة بحسابك" : "Suggested Saved Addresses"}</span>
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{isRTL ? "اضغط للاستكمال التلقائي" : "Click any address to autofill"}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddrId === addr.id;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => handleAutofillAddress(addr)}
                  className={`p-3 rounded-xl flex flex-col gap-1 transition-all cursor-pointer border text-xs ${
                    isRTL ? 'text-right' : 'text-left'
                  } ${
                    isSelected
                      ? 'bg-white dark:bg-[#121923] border-[#FF1F3D] text-gray-900 dark:text-white shadow-md'
                      : 'bg-white dark:bg-[#16202E] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{addr.fullName || addr.label || (isRTL ? "العنوان المحفوظ" : "Saved Address")}</span>
                    {isSelected && <CheckCircle size={14} className="text-[#FF1F3D]" />}
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-[11px] line-clamp-1">{addr.street || addr.address}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Shipping Address Form ── */}
      <div>
        <h2 className="text-base font-extrabold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#FF1F3D]" />
          <span>{isRTL ? "عنوان التسليم والشحن" : "Shipping Address"}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              {isRTL ? "الاسم بالكامل *" : "Full Name *"}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                {...register("shipping.fullName")}
                type="text" 
                placeholder={isRTL ? "مثال: أحمد محمود" : "e.g. John Doe"} 
                className={`${inputClass} ${errors.shipping?.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700/70 focus:border-[#FF1F3D]'}`} 
              />
            </div>
            {errors.shipping?.fullName && <p className="text-red-500 dark:text-red-400 text-[11px] mt-1 font-bold">{errors.shipping.fullName.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              {isRTL ? "رقم الهاتف والتواصل *" : "Phone Number *"}
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                {...register("shipping.phone")}
                type="text" 
                dir="ltr"
                placeholder="01012345678" 
                className={`${inputClass} ${errors.shipping?.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700/70 focus:border-[#FF1F3D]'}`} 
              />
            </div>
            {errors.shipping?.phone && <p className="text-red-500 dark:text-red-400 text-[11px] mt-1 font-bold">{errors.shipping.phone.message}</p>}
          </div>

          {/* Governorate Select */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              {isRTL ? "المحافظة *" : "Governorate *"}
            </label>
            <select
              {...register("shipping.governorate")}
              className="w-full h-11 px-3 bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700/70 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
            >
              {Object.keys(GOVERNORATE_RATES).map((govKey) => {
                const item = GOVERNORATE_RATES[govKey];
                const displayName = isRTL ? (item.nameAr || govKey) : (item.nameEn || govKey);
                return (
                  <option key={govKey} value={govKey}>
                    {displayName} ({item.rate} {isRTL ? 'ج.م' : 'EGP'})
                  </option>
                );
              })}
            </select>
          </div>

          {/* City / District */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              {isRTL ? "المنطقة / المدينة *" : "City / District *"}
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                {...register("shipping.city")}
                type="text" 
                placeholder={isRTL ? "المعادي / الدقي / سموحة" : "e.g. Maadi, Cairo"} 
                className={`${inputClass} ${errors.shipping?.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-700/70 focus:border-[#FF1F3D]'}`} 
              />
            </div>
            {errors.shipping?.city && <p className="text-red-500 dark:text-red-400 text-[11px] mt-1 font-bold">{errors.shipping.city.message}</p>}
          </div>

          {/* Detailed Street Address */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              {isRTL ? "العنوان بالتفصيل (اسم الشارع، رقم العمارة والشقة) *" : "Street Address & Building No. *"}
            </label>
            <div className="relative">
              <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                {...register("shipping.streetAddress")}
                type="text" 
                placeholder={isRTL ? "شارع 9، عمارة 12، الدور الرابع، شقة 8" : "Street 9, Building 12, Apt 4"} 
                className={`${inputClass} ${errors.shipping?.streetAddress ? 'border-red-500' : 'border-gray-300 dark:border-gray-700/70 focus:border-[#FF1F3D]'}`} 
              />
            </div>
            {errors.shipping?.streetAddress && <p className="text-red-500 dark:text-red-400 text-[11px] mt-1 font-bold">{errors.shipping.streetAddress.message}</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
