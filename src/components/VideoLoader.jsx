import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loaderVideo from "../assets/mixo_loader.mp4";
import mixoLogoImg from "../assets/images/logo/mixo_red_logo.png";

export default function VideoLoader({ onComplete }) {
  const [progress, setProgress] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("x5-playsinline", "true");
      video.setAttribute("autoplay", "true");

      const startPlay = () => {
        if (!video) return;
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Mobile WebKit video autoplay fallback:", err);
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      };

      startPlay();

      const events = ["loadedmetadata", "loadeddata", "canplay", "canplaythrough", "playing"];
      events.forEach((evt) => video.addEventListener(evt, startPlay));

      const handleUserTouch = () => {
        startPlay();
        window.removeEventListener("touchstart", handleUserTouch);
        window.removeEventListener("click", handleUserTouch);
        window.removeEventListener("pointerdown", handleUserTouch);
      };

      window.addEventListener("touchstart", handleUserTouch, { passive: true });
      window.addEventListener("click", handleUserTouch, { passive: true });
      window.addEventListener("pointerdown", handleUserTouch, { passive: true });

      return () => {
        events.forEach((evt) => video.removeEventListener(evt, startPlay));
        window.removeEventListener("touchstart", handleUserTouch);
        window.removeEventListener("click", handleUserTouch);
        window.removeEventListener("pointerdown", handleUserTouch);
      };
    }
  }, []);

  useEffect(() => {
    const DURATION = 4000; // 4 seconds total
    const startTime = performance.now();

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const currentProgress = Math.min(100, Math.max(1, Math.floor((elapsed / DURATION) * 100)));
      
      setProgress(currentProgress);

      if (elapsed < DURATION) {
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 300);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-black text-white flex flex-col items-center justify-center p-4 select-none overflow-hidden"
        >
          {/* Top Logo */}
          <div className="mb-6 flex flex-col items-center space-y-2 z-10 animate-pulse">
            <img src={mixoLogoImg} alt="Mixo Logo" className="h-9 sm:h-11 w-auto object-contain" />
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#FF1F3D] bg-[#FF1F3D]/10 px-3 py-0.5 rounded-full border border-[#FF1F3D]/20">
              3D PRINTING & CREATIONS
            </span>
          </div>

          {/* Video Container (Guaranteed Mobile WebKit Autoplay with Clean Filename mixo_loader.mp4) */}
          <div className="relative w-64 sm:w-80 aspect-square rounded-3xl overflow-hidden bg-black mb-8 z-10 flex items-center justify-center group">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              defaultMuted
              playsInline
              preload="auto"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              aria-hidden="true"
              className="w-full h-full object-cover object-center transform scale-105 pointer-events-none"
            >
              <source src={loaderVideo} type="video/mp4" />
              <source src="/mixo_loader.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Progress Bar & Counter Container */}
          <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center space-y-3 z-10">
            {/* Percentage Number Display */}
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-xs font-bold text-gray-400 font-sans tracking-wide">
                Preparing 3D Experience...
              </span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-wider">
                {progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-[#151C24] rounded-full p-0.5 border border-[#26313D] overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#FF1F3D] to-[#FF6B00] rounded-full transition-all duration-75 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Moving Gloss Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
