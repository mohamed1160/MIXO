import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, Flame, ShoppingBag } from "lucide-react";
import { usePromoStore } from "../store/usePromoStore";
import mixoLogoImg from "../assets/images/logo/mixo_red_logo.png";

export default function PromoPopup({ forceShow = false, onClosePreview }) {
  const navigate = useNavigate();
  const promoState = usePromoStore();
  
  const {
    isEnabled,
    delaySeconds,
    showOncePerSession,
    message,
    buttonText,
    buttonLink,
  } = promoState;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    if (!isEnabled) return;

    if (showOncePerSession) {
      const alreadyClosed = sessionStorage.getItem("mixo_promo_closed");
      if (alreadyClosed === "true") return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, (delaySeconds || 2) * 1000);

    return () => clearTimeout(timer);
  }, [isEnabled, delaySeconds, showOncePerSession, forceShow]);

  const handleClose = () => {
    setIsOpen(false);
    if (showOncePerSession && !forceShow) {
      sessionStorage.setItem("mixo_promo_closed", "true");
    }
    if (onClosePreview) {
      onClosePreview();
    }
  };

  const handleAction = () => {
    handleClose();
    const target = buttonLink || "/";
    if (target.startsWith("http")) {
      window.open(target, "_blank");
    } else {
      navigate(target);
    }
  };

  const displayMessage = message || "Special offers exceeding 25% OFF! 🔥";
  const displayButtonText = buttonText || "Shop Now 🛍️";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur & Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Minimal Sentence Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#0F141C] border border-[#2A3441] rounded-3xl shadow-2xl overflow-hidden text-white p-6 sm:p-8 text-center"
          >
            {/* Red Glow Accent Bar Top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF1F3D] via-[#FF6B00] to-[#FF1F3D] animate-pulse" />

            {/* Close (X) Button */}
            <button
              onClick={handleClose}
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-[#FF1F3D] text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer group shadow-lg"
              title="Close"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Logo / Flame Header Icon */}
            <div className="flex flex-col items-center justify-center space-y-2 pt-2 pb-1">
              <div className="relative">
                <div className="p-3 rounded-2xl bg-[#FF1F3D]/10 text-[#FF1F3D] border border-[#FF1F3D]/20 shadow-lg shadow-red-600/20 inline-flex items-center justify-center">
                  <Flame size={28} className="animate-bounce text-[#FF1F3D]" />
                </div>
                <div className="absolute -top-1 -right-1 bg-amber-400 text-black p-1 rounded-full text-[10px] font-black shadow">
                  <Sparkles size={12} />
                </div>
              </div>
              <img src={mixoLogoImg} alt="Mixo Logo" className="h-6 w-auto object-contain opacity-80 pt-1" />
            </div>

            {/* Sentence Message */}
            <div className="my-5 px-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-relaxed tracking-wide">
                {displayMessage}
              </h2>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-1">
              <button
                onClick={handleAction}
                type="button"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF1F3D] to-[#E60026] hover:from-[#E60026] hover:to-[#C0001F] text-white font-bold text-sm shadow-xl shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <ShoppingBag size={18} />
                <span>{displayButtonText}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleClose}
                type="button"
                className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-white/5 text-gray-400 hover:text-white text-xs font-semibold transition-all cursor-pointer text-center"
              >
                No thanks, maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
