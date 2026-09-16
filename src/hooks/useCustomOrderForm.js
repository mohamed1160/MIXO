import { useState, useCallback } from "react";
import { customOrderService } from "../services/customOrderService";

export function useCustomOrderForm(isRTL = false) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [makerworldUrl, setMakerworldUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState("figures");
  const [description, setDescription] = useState("");

  // Dimensions
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [maskHeight, setMaskHeight] = useState("");
  const [circularWidth, setCircularWidth] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [material, setMaterial] = useState("PLA");
  const [color, setColor] = useState("Default");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMask = category === "masks" || category === "ماسك" || category === "ماسكات";

  const handleAddFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    const combinedFiles = [...files, ...fileArray].slice(0, 5);

    const validation = customOrderService.validateFiles(combinedFiles);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, images: validation.error }));
      return;
    }

    setErrors((prev) => ({ ...prev, images: null }));
    setFiles(combinedFiles);

    const newPreviews = combinedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  }, [files]);

  const handleRemoveImage = useCallback((index) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const validation = customOrderService.validateFiles(updated);
      if (updated.length === 0) {
        setErrors((err) => ({
          ...err,
          images: isRTL
            ? "من فضلك ارفع صورة واحدة على الأقل للتصميم."
            : "Please upload at least one image of your design.",
        }));
      } else {
        setErrors((err) => ({ ...err, images: validation.error }));
      }
      return updated;
    });

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, [isRTL]);

  const validateForm = useCallback(() => {
    const errs = {};

    if (!files || files.length === 0) {
      errs.images = isRTL
        ? "من فضلك ارفع صورة واحدة على الأقل للتصميم."
        : "Please upload at least one image of your design.";
    }

    if (!phoneNumber || phoneNumber.trim().length < 6) {
      errs.phoneNumber = isRTL
        ? "يرجى كتابة رقم تليفون صحيح للتواصل وتحديد السعر."
        : "Please enter a valid phone number for price quotes & contact.";
    }

    if (!description || description.trim().length < 10) {
      errs.description = isRTL
        ? "يرجى كتابة تفاصيل لا تقل عن 10 أحرف حول تصميمك."
        : "Please provide at least 10 characters describing your design.";
    }

    if (isMask) {
      const h = Number(maskHeight);
      if (!maskHeight || isNaN(h) || h <= 0 || h > 200) {
        errs.maskHeight = isRTL
          ? "يجب أن يكون ارتفاع الماسك بين 0.1 سم و 200 سم."
          : "Mask height must be between 0.1 cm and 200 cm.";
      }

      const w = Number(circularWidth);
      if (!circularWidth || isNaN(w) || w <= 0 || w > 200) {
        errs.circularWidth = isRTL
          ? "يجب أن يكون عرض/محيط الوجه الدائري بين 0.1 سم و 200 سم."
          : "Circular face width/contour must be between 0.1 cm and 200 cm.";
      }
    } else {
      const numLength = Number(length);
      if (!length || isNaN(numLength) || numLength <= 0 || numLength > 200) {
        errs.length = isRTL
          ? "يجب أن يكون الطول بين 0.1 سم و 200 سم."
          : "Length must be between 0.1 cm and 200 cm.";
      }

      const numWidth = Number(width);
      if (!width || isNaN(numWidth) || numWidth <= 0 || numWidth > 200) {
        errs.width = isRTL
          ? "يجب أن يكون العرض بين 0.1 سم و 200 سم."
          : "Width must be between 0.1 cm and 200 cm.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [files, phoneNumber, description, isMask, maskHeight, circularWidth, length, width, isRTL]);

  const resetForm = useCallback(() => {
    setFiles([]);
    setPreviews([]);
    setMakerworldUrl("");
    setPhoneNumber("");
    setCategory("figures");
    setDescription("");
    setLength("");
    setWidth("");
    setMaskHeight("");
    setCircularWidth("");
    setQuantity(1);
    setMaterial("PLA");
    setColor("Default");
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    files,
    previews,
    makerworldUrl,
    phoneNumber,
    category,
    isMask,
    description,
    length,
    width,
    maskHeight,
    circularWidth,
    quantity,
    material,
    color,
    errors,
    isSubmitting,
    setMakerworldUrl,
    setPhoneNumber,
    setCategory,
    setDescription,
    setLength,
    setWidth,
    setMaskHeight,
    setCircularWidth,
    setQuantity,
    setMaterial,
    setColor,
    setIsSubmitting,
    handleAddFiles,
    handleRemoveImage,
    validateForm,
    resetForm,
  };
}
