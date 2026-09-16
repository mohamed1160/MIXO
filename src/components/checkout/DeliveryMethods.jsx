import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import DeliveryMethodCard from './DeliveryMethodCard';
import { useShippingMethods } from '../../hooks/useShippingMethods';
import { calculateShippingFee, getGovernorateRate } from '../../utils/shippingRates';
import { useLanguage } from '../../providers/LanguageContext';

export default function DeliveryMethods({ selectedMethodId, onMethodSelect, watch, cart }) {
  const { isRTL } = useLanguage();
  const { data: methods = [], isLoading, isError, refetch } = useShippingMethods();

  const selectedGov = watch ? watch("shipping.governorate") : "";
  const governorateRate = getGovernorateRate(selectedGov);
  
  const subtotal = (cart || []).reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 1)), 0);
  const shippingInfo = calculateShippingFee(selectedGov, subtotal, "standard");

  return (
    <div className={`bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6 font-sans text-gray-900 dark:text-white transition-colors ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      <div>
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
          <Truck className="w-6 h-6 text-[#FF1F3D]" />
          <span>{isRTL ? "خيارات وسرعة التوصيل" : "2. Shipping Method"}</span>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isRTL ? "اختر خيار الشحن المناسب لمحافظتك وسرعة التجهيز" : "Choose your preferred delivery speed"}
        </p>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [1, 2].map(i => (
            <div key={i} className="w-full h-20 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-[#1A2332] animate-pulse" />
          ))
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-center">
            <p className="text-red-500 dark:text-red-400 text-xs mb-3 font-bold">
              {isRTL ? "تعذر تحميل خيارات الشحن الآن." : "Unable to load shipping methods."}
            </p>
            <button 
              onClick={() => refetch()}
              className="flex items-center gap-2 text-[#FF1F3D] font-bold text-xs hover:underline"
            >
              <RefreshCw size={14} /> {isRTL ? "إعادة المحاولة" : "Try Again"}
            </button>
          </div>
        ) : !Array.isArray(methods) || methods.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-xs bg-gray-50 dark:bg-[#1A2332] rounded-2xl border border-gray-200 dark:border-gray-800">
            {isRTL ? "لا تتوفر وسيلة شحن متوافقة حالياً." : "No shipping methods available at this time."}
          </div>
        ) : (
          <AnimatePresence>
            {methods.map((method) => (
              <motion.div
                key={method._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <DeliveryMethodCard 
                  method={method} 
                  isSelected={selectedMethodId === method._id}
                  onSelect={onMethodSelect}
                  governorateRate={governorateRate}
                  isFreeShipping={shippingInfo.isFree}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Info Guarantee Box */}
      <div className="bg-gray-50 dark:bg-[#1A2332] rounded-2xl p-4 flex items-start gap-3 border border-gray-200 dark:border-gray-800">
        <ShieldCheck className="text-[#FF1F3D] shrink-0 mt-0.5" size={20} />
        <div className="text-xs">
          <p className="font-bold text-gray-900 dark:text-white mb-0.5">
            {isRTL ? "شحنتك مؤمنة بالكامل ومغلفة بعناية لحماية مجسمات 3D" : "All shipments are insured with live tracking"}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-[11px]">
            {isRTL ? "ستصلك التحديثات ورابط تتبع الشحنة فور تجهيز الطلب." : "You will receive a tracking link once your shipment is dispatched."}
          </p>
        </div>
      </div>
    </div>
  );
}
