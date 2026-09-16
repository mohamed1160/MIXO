import React from "react";

export default function DimensionInputs({
  isMask,
  length,
  width,
  maskHeight,
  circularWidth,
  onChangeLength,
  onChangeWidth,
  onChangeMaskHeight,
  onChangeCircularWidth,
  errors,
  isRTL,
}) {
  if (isMask) {
    return (
      <div className="space-y-3 bg-[#FF1F3D]/5 dark:bg-[#FF1F3D]/10 p-3.5 sm:p-4 rounded-2xl border border-[#FF1F3D]/20">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#FF1F3D]">
            {isRTL ? "أبعاد الماسك الدائرية (Mask Fitting) *" : "Mask Circular Fitting Dimensions *"}
          </label>
          <span className="text-[10px] text-gray-500 dark:text-[#AAB4C0]">
            {isRTL ? "قياسات الوجه بالسم" : "Face measurements in cm"}
          </span>
        </div>

        <p className="text-[11px] text-gray-600 dark:text-[#AAB4C0] leading-relaxed">
          {isRTL
            ? "💡 يرجى قياس ارتفاع الوجه من الذقن للجبهة، والعرض الدائري للوجه عبر الوجنتين لضمان مقاس الماسك المناسب لوجهك تماماً."
            : "💡 Please measure your face height from chin to forehead, and circular face width across cheekbones for a perfect custom mask fit."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Mask Height Input */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-800 dark:text-[#F5F7FA] mb-1">
              {isRTL ? "ارتفاع الماسك (سم) *" : "Mask Height (cm) *"}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="200"
                value={maskHeight}
                onChange={(e) => onChangeMaskHeight(e.target.value)}
                placeholder={isRTL ? "مثال: 22" : "e.g. 22"}
                className={`w-full bg-white dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 px-3.5 border focus:outline-none transition-all ${
                  errors?.maskHeight
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 dark:border-[#26313D] focus:border-[#FF1F3D]"
                }`}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-[#7F8A96] font-bold">
                cm
              </span>
            </div>
            {errors?.maskHeight && (
              <p className="text-[11px] font-medium text-red-500 dark:text-red-400 mt-1">
                {errors.maskHeight}
              </p>
            )}
          </div>

          {/* Circular Face Width */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-800 dark:text-[#F5F7FA] mb-1">
              {isRTL ? "عرض/محيط الوجه بشكل دائري (سم) *" : "Circular Face Width / Contour (cm) *"}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="200"
                value={circularWidth}
                onChange={(e) => onChangeCircularWidth(e.target.value)}
                placeholder={isRTL ? "مثال: 18" : "e.g. 18"}
                className={`w-full bg-white dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 px-3.5 border focus:outline-none transition-all ${
                  errors?.circularWidth
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 dark:border-[#26313D] focus:border-[#FF1F3D]"
                }`}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-[#7F8A96] font-bold">
                cm
              </span>
            </div>
            {errors?.circularWidth && (
              <p className="text-[11px] font-medium text-red-500 dark:text-red-400 mt-1">
                {errors.circularWidth}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
        {isRTL ? "الأبعاد بالسم (Dimensions in cm) *" : "Dimensions (Length × Width in cm) *"}
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Length Input */}
        <div>
          <label className="block text-[11px] text-gray-500 dark:text-[#AAB4C0] mb-1 font-medium">
            {isRTL ? "الطول (سم):" : "Length (cm):"}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="200"
              value={length}
              onChange={(e) => onChangeLength(e.target.value)}
              placeholder="e.g. 15"
              className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 px-3.5 border focus:outline-none transition-all ${
                errors?.length
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent dark:border-[#26313D] focus:border-gray-300 dark:focus:border-[#384656]"
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-[#7F8A96] font-bold">
              cm
            </span>
          </div>
          {errors?.length && (
            <p className="text-[11px] font-medium text-red-500 dark:text-red-400 mt-1">
              {errors.length}
            </p>
          )}
        </div>

        {/* Width Input */}
        <div>
          <label className="block text-[11px] text-gray-500 dark:text-[#AAB4C0] mb-1 font-medium">
            {isRTL ? "العرض (سم):" : "Width (cm):"}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="200"
              value={width}
              onChange={(e) => onChangeWidth(e.target.value)}
              placeholder="e.g. 10"
              className={`w-full bg-[#F3F4F6] dark:bg-[#151C24] text-gray-900 dark:text-[#F5F7FA] placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2.5 px-3.5 border focus:outline-none transition-all ${
                errors?.width
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent dark:border-[#26313D] focus:border-gray-300 dark:focus:border-[#384656]"
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-[#7F8A96] font-bold">
              cm
            </span>
          </div>
          {errors?.width && (
            <p className="text-[11px] font-medium text-red-500 dark:text-red-400 mt-1">
              {errors.width}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
