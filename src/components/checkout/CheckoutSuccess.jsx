import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShoppingBag, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../providers/LanguageContext';

export default function CheckoutSuccess({ orderId }) {
  const { isRTL } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center text-white min-h-[70vh] dir-rtl font-sans"
    >
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
          ? "شكراً لتسوقك من متجر Mixo 3D Printing. تم استلام طلبك وجاري تجهيزه وطباعة المجسمات بعناية فائقة."
          : "Thank you for shopping with MIXO 3D. Your order has been received and is being prepared."
        }
      </p>
      
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
