import React, { useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function CustomImageUploader({
  previews,
  onAddFiles,
  onRemoveImage,
  error,
  isRTL,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
          {isRTL ? "رفع صور التصميم *" : "Upload Your Design *"}
        </label>
        <span className="text-[10px] text-gray-500 dark:text-[#7F8A96]">
          {isRTL ? "حتى 5 صور (أقصى حجم 10MB)" : "Up to 5 images (max 10MB each)"}
        </span>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
          error
            ? "border-red-500 bg-red-50/50 dark:bg-red-500/10"
            : "border-gray-200 dark:border-[#26313D] bg-gray-50 dark:bg-[#151C24] hover:bg-gray-100 dark:hover:bg-[#1A232E]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-10 h-10 rounded-full bg-red-500/10 text-[#FF1F3D] flex items-center justify-center">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
          {isRTL ? "اضغط هنا لرفع الصور" : "Click to Upload Images"}
        </p>
        <p className="text-[10px] text-gray-400 dark:text-[#7F8A96]">
          JPG, PNG, WEBP (camera capture supported)
        </p>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Image Previews */}
      {previews && previews.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 pt-2">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-[#26313D] group shadow-sm bg-black/10"
            >
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                #{index + 1}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(index);
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
