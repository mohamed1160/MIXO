import React from 'react';
import { motion } from 'framer-motion';
import { Check, User, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';

const steps = [
  { id: 1, titleEn: "Information", titleAr: "البيانات والشحن", icon: User },
  { id: 2, titleEn: "Shipping", titleAr: "طريقة التوصيل", icon: Truck },
  { id: 3, titleEn: "Payment", titleAr: "طريقة الدفع", icon: CreditCard },
  { id: 4, titleEn: "Review", titleAr: "مراجعة الطلب", icon: ShieldCheck },
];

export default function CheckoutProgress({ currentStep }) {
  const { isRTL } = useLanguage();

  return (
    <div className="w-full py-6 mb-8 border-b border-gray-200 dark:border-gray-800/80 bg-white/70 dark:bg-[#121923]/60 backdrop-blur-md rounded-2xl p-4 transition-colors">
      <div className="max-w-4xl mx-auto px-2 flex items-center justify-between relative">
        {/* Connecting line behind circles */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 dark:bg-gray-800 -z-0" />
        
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col items-center group bg-[#FAF7F2] dark:bg-[#0F151D] px-2 py-1 rounded-xl z-10 transition-colors">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive || isCompleted ? '#FF1F3D' : 'var(--bg-step)',
                  borderColor: isActive || isCompleted ? '#FF1F3D' : 'var(--border-step)',
                  color: isActive || isCompleted ? '#FFFFFF' : '#9CA3AF',
                }}
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isActive ? 'shadow-lg shadow-[#FF1F3D]/40 ring-4 ring-[#FF1F3D]/20 scale-105' : ''
                }`}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} className="text-white" />
                ) : (
                  <Icon size={16} />
                )}
              </motion.div>

              <div className="mt-2 text-center">
                <p className={`text-[11px] font-bold tracking-wide transition-colors ${
                  isActive ? 'text-[#FF1F3D]' : isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {isRTL ? step.titleAr : step.titleEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
