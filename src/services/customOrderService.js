import { upload3DFileToSupabase } from './db.service';

export const customOrderService = {
  validateFiles(files) {
    const maxFiles = 5;
    const maxSizeMB = 10;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!files || files.length === 0) {
      return { isValid: false, error: "Please upload at least one image of your design." };
    }

    if (files.length > maxFiles) {
      return { isValid: false, error: `You can upload a maximum of ${maxFiles} images.` };
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        return {
          isValid: false,
          error: `File "${file.name}" is invalid. Allowed formats: JPG, PNG, WEBP.`,
        };
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return {
          isValid: false,
          error: `File "${file.name}" exceeds the maximum size limit of ${maxSizeMB}MB.`,
        };
      }
    }

    return { isValid: true, error: null };
  },

  async uploadCustomImages(files) {
    if (!files || files.length === 0) return [];
    
    const imageUrls = [];
    for (const file of Array.from(files)) {
      const supaUrl = await upload3DFileToSupabase(file);
      if (supaUrl) {
        imageUrls.push(supaUrl);
      } else {
        imageUrls.push(URL.createObjectURL(file));
      }
    }
    return imageUrls;
  },


  createCustomOrderItem(data) {
    const {
      description,
      imageUrls,
      makerworldUrl = "",
      phoneNumber = "",
      category = "figures",
      isMask = false,
      maskHeight,
      circularWidth,
      length,
      width,
      quantity = 1,
      material = "PLA",
      color = "Default",
      isRTL = false,
    } = data;

    const uniqueId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      id: uniqueId,
      type: "custom",
      title: isMask
        ? isRTL
          ? "طلب ماسك مخصص (Custom Mask)"
          : "Custom 3D Mask"
        : isRTL
        ? "طلب تصميم 3D مخصص"
        : "Custom 3D Print",
      name: isMask
        ? isRTL
          ? "طلب ماسك مخصص (Custom Mask)"
          : "Custom 3D Mask"
        : isRTL
        ? "طلب تصميم 3D مخصص"
        : "Custom 3D Print",
      description: description.trim(),
      images: imageUrls && imageUrls.length > 0 ? imageUrls : [],
      image: imageUrls && imageUrls.length > 0 ? imageUrls[0] : "",
      makerworldUrl: makerworldUrl.trim(),
      phoneNumber: phoneNumber.trim(),
      category,
      isMask,
      maskHeight: isMask ? Number(maskHeight) : null,
      circularWidth: isMask ? Number(circularWidth) : null,
      length: !isMask ? Number(length) : Number(maskHeight),
      width: !isMask ? Number(width) : Number(circularWidth),
      unit: "cm",
      quantity: Number(quantity),
      material,
      color,
      price: 0,
      priceText: isRTL ? "في انتظار تحديد السعر" : "Pending Quote",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
  },
};
