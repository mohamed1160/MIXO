import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';

export default function WhatsAppButton() {
  const { isRTL } = useLanguage();
  const [whatsappNumber, setWhatsappNumber] = useState('201000000000');
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Load WhatsApp phone number from Admin settings if available
    try {
      const savedSettings = localStorage.getItem('MIXO_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.whatsapp || parsed.phone) {
          const raw = parsed.whatsapp || parsed.phone;
          const cleanPhone = raw.replace(/[^\d]/g, '');
          if (cleanPhone) setWhatsappNumber(cleanPhone.startsWith('2') ? cleanPhone : `2${cleanPhone}`);
        }
      }
    } catch (e) {
      console.error('Error loading whatsapp setting:', e);
    }

    // Auto-hide tooltip badge after 8 seconds
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const defaultMsg = isRTL 
    ? 'مرحباً متجر MIXO 3D، أود الاستفسار عن طباعة مجسم أو طلب خدمة.' 
    : 'Hello MIXO 3D Store, I would like to inquire about 3D printing services.';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div className={`fixed bottom-5 z-40 flex items-center gap-2 ${isRTL ? 'left-5 flex-row' : 'right-5 flex-row-reverse'}`}>
      
      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-2xl hover:bg-[#20bd5a] transition-all duration-300 hover:scale-110 active:scale-95 group relative"
      >
        <MessageCircle size={28} className="fill-current stroke-none transition-transform group-hover:rotate-12" />
        
        {/* Pulsing Light Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
      </a>

      {/* Helper Tooltip Badge */}
      {showTooltip && (
        <div className="bg-slate-900 dark:bg-[#151C24] text-white text-xs font-semibold px-3 py-2 rounded-2xl shadow-xl border border-slate-700 dark:border-[#26313D] flex items-center gap-2 animate-fade-in">
          <span>{isRTL ? 'تواصل معنا مباشرة عبر الواتساب 👋' : 'Chat directly on WhatsApp 👋'}</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-white p-0.5"
            aria-label="Close tooltip"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
