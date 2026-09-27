import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShoppingBag, MessageSquare, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../providers/LanguageContext';

export default function CheckoutSuccess({ orderId }) {
  const { isRTL } = useLanguage();
  const [showModal, setShowModal] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center text-white min-h-[70vh] dir-rtl font-sans relative"
    >
      {/* ⏳ Pop-up Modal for Transfer Verification Timeframe */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-[#121923] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative dir-rtl"
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 left-4 p-2 text-gray-400 hover:text-white rounded-full bg-gray-800/60 hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                <Clock size={36} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white mb-2">
                  {isRTL ? "تنبيه هـام بشأن تأكيد التحويل ⏳" : "Important Transfer Notice ⏳"}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {isRTL 
                    ? "سيتم مراجعة إيصال التحويل والتأكد من صحة سداد القيمة خلال ساعات العمل الرسمية (من 2 إلى 5 ساعات عمل). وستصلك حالة الدفع فور اعتمادها في مركز الإشعارات وتتبع الطلب."
                    : "The transfer receipt will be verified during official working hours (within 2 to 5 working hours)."}
                </p>
              </div>

              {orderId && (
                <div className="bg-[#1A2332] p-3 rounded-xl border border-gray-800 text-xs font-mono text-amber-400">
                  {isRTL ? `رقم الطلب: ${orderId}` : `Order ID: ${orderId}`}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-[#FF1F3D]/20 cursor-pointer"
              >
                {isRTL ? "فهمت وموافق 👍" : "I Understand 👍"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mb-6 p-4 bg-[#FF1F3D]/10 rounded-full border border-[#FF1F3D]/30"
      >
        <CheckCircle2 size={72} className="text-[#FF1F3D]" strokeWidth={2} />
      </motion.div>
      
      <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
        {isRTL ? "تم تأكيد وتسجيل طلبك بنجاح 🎉" : "Order Confirmed!"}
      </h1>
      
      <p className="text-xs md:text-sm text-gray-300 max-w-md mx-auto mb-4 leading-relaxed">
        {isRTL 
          ? "شكراً لتسوقك من متجر Mixo 3D Printing. تم استلام طلبك وجاري مراجعته وتجهيزه بعناية فائقة."
          : "Thank you for shopping with MIXO 3D. Your order has been received and is being prepared."
        }
      </p>

      {/* ⏳ Working Hours Verification Timeframe Banner */}
      <div className="bg-[#16202E] border border-amber-500/40 rounded-2xl p-4 mb-6 max-w-md mx-auto text-amber-300 text-xs flex items-center justify-center gap-3 shadow-lg">
        <Clock size={24} className="text-amber-400 shrink-0 animate-pulse" />
        <div className="text-right">
          <span className="font-bold block text-white text-xs mb-0.5">
            {isRTL ? "ملاحظة هامة بشأن تأكيد التحويل:" : "Important Payment Notice:"}
          </span>
          <span className="text-gray-300 text-[11px] leading-snug block">
            {isRTL 
              ? "سيتم التأكد من صحة التحويل وسداد القيمة خلال ساعات العمل (من 2 إلى 5 ساعات عمل) وتحديث حالة الدفع."
              : "The transfer will be verified during working hours (within 2 to 5 working hours)."}
          </span>
        </div>
      </div>
      
      {orderId && (
        <div className="bg-[#121923] border border-[#FF1F3D]/40 rounded-2xl px-6 py-3 mb-8 shadow-lg">
          <span className="text-xs text-gray-400 block mb-0.5">رقم مرجع الطلب (Order ID):</span>
          <span className="text-lg font-extrabold text-[#FF1F3D] font-mono">{orderId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link 
          to="/shop" 
          className="px-6 py-3 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#FF1F3D]/20 cursor-pointer"
        >
          <ShoppingBag size={16} />
          <span>{isRTL ? "متابعة التسوق بالمتجر" : "Continue Shopping"}</span>
        </Link>

        {orderId && (
          <Link
            to={`/track-order?id=${orderId}`}
            className="px-6 py-3 bg-[#1A2332] hover:bg-[#26313D] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all border border-gray-700 cursor-pointer"
          >
            <span>{isRTL ? "تتبع حركة الطلب الآن 🚚" : "Track Order Status 🚚"}</span>
          </Link>
        )}

        <a
          href="https://wa.me/201012345678"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 bg-[#1A2332] hover:bg-gray-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all border border-gray-700 cursor-pointer"
        >
          <MessageSquare size={16} className="text-green-400" />
          <span>{isRTL ? "تواصل مع الدعم" : "Contact Support"}</span>
        </a>
      </div>
    </motion.div>
  );
}
