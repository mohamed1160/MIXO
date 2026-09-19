import React, { useRef } from "react";
import { Upload, X, FileBox, FileText } from "lucide-react";

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

  const isImageFile = (src) => {
    if (!src) return false;
    const lower = src.toLowerCase();
    return (
      lower.startsWith("data:image") ||
      lower.includes(".jpg") ||
      lower.includes(".jpeg") ||
      lower.includes(".png") ||
      lower.includes(".webp") ||
      lower.includes("blob:")
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-[#F5F7FA]">
          {isRTL ? "رفع صور أو ملفات 3D *" : "Upload Design / 3D File *"}
        </label>
        <span className="text-[10px] text-gray-500 dark:text-[#7F8A96]">
          {isRTL ? "حتى 5 ملفات (أقصى حجم 50MB)" : "Up to 5 files (max 50MB each)"}
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
          accept="image/*,.stl,.obj,.3mf,.step,.stp,.ply,.zip,.rar"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-10 h-10 rounded-full bg-red-500/10 text-[#FF1F3D] flex items-center justify-center">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
          {isRTL ? "اضغط هنا لرفع صور أو ملفات 3D (STL, OBJ, 3MF, ZIP)" : "Click to Upload Images or 3D Files (STL, OBJ, 3MF, ZIP)"}
        </p>
        <p className="text-[10px] text-gray-400 dark:text-[#7F8A96]">
          Images (JPG, PNG, WEBP) & 3D Models (STL, OBJ, 3MF, STEP, ZIP)
        </p>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Previews Grid */}
      {previews && previews.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 pt-2">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-[#26313D] group shadow-sm bg-gray-100 dark:bg-[#151C24] flex items-center justify-center"
            >
              {isImageFile(src) ? (
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2 text-[#FF1F3D]">
                  <FileBox size={24} />
                  <span className="text-[9px] font-bold mt-1 text-gray-700 dark:text-gray-300">
                    ملف 3D #{index + 1}
                  </span>
                </div>
              )}
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
                aria-label={`Remove file ${index + 1}`}
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
