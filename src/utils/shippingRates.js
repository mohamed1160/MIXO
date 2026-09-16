export const FREE_SHIPPING_LIMIT = 2000;

export const GOVERNORATE_RATES = {
  "Cairo": { nameEn: "Cairo", nameAr: "القاهرة", rate: 60 },
  "Giza": { nameEn: "Giza", nameAr: "الجيزة", rate: 60 },
  "Qalyubia": { nameEn: "Qalyubia", nameAr: "القليوبية", rate: 65 },
  "Alexandria": { nameEn: "Alexandria", nameAr: "الإسكندرية", rate: 75 },
  "Beheira": { nameEn: "Beheira", nameAr: "البحيرة", rate: 75 },
  "Dakahlia": { nameEn: "Dakahlia", nameAr: "الدقهلية", rate: 75 },
  "Damietta": { nameEn: "Damietta", nameAr: "دمياط", rate: 75 },
  "Gharbia": { nameEn: "Gharbia", nameAr: "الغربية", rate: 75 },
  "Monufia": { nameEn: "Monufia", nameAr: "المنوفية", rate: 75 },
  "Sharqia": { nameEn: "Sharqia", nameAr: "الشرقية", rate: 75 },
  "Kafr El Sheikh": { nameEn: "Kafr El Sheikh", nameAr: "كفر الشيخ", rate: 75 },
  "Ismailia": { nameEn: "Ismailia", nameAr: "الإسماعيلية", rate: 85 },
  "Port Said": { nameEn: "Port Said", nameAr: "بورسعيد", rate: 85 },
  "Suez": { nameEn: "Suez", nameAr: "السويس", rate: 85 },
  "Faiyum": { nameEn: "Faiyum", nameAr: "الفيوم", rate: 90 },
  "Beni Suef": { nameEn: "Beni Suef", nameAr: "بني سويف", rate: 90 },
  "Minya": { nameEn: "Minya", nameAr: "المنيا", rate: 95 },
  "Asyut": { nameEn: "Asyut", nameAr: "أسيوط", rate: 95 },
  "Sohag": { nameEn: "Sohag", nameAr: "سوهاج", rate: 100 },
  "Qena": { nameEn: "Qena", nameAr: "قنا", rate: 105 },
  "Luxor": { nameEn: "Luxor", nameAr: "الأقصر", rate: 110 },
  "Aswan": { nameEn: "Aswan", nameAr: "أسوان", rate: 115 },
  "Red Sea": { nameEn: "Red Sea", nameAr: "البحر الأحمر", rate: 120 },
  "New Valley": { nameEn: "New Valley", nameAr: "الوادي الجديد", rate: 125 },
  "Matrouh": { nameEn: "Matrouh", nameAr: "مطروح", rate: 125 },
  "North Sinai": { nameEn: "North Sinai", nameAr: "شمال سيناء", rate: 130 },
  "South Sinai": { nameEn: "South Sinai", nameAr: "جنوب سيناء", rate: 130 },
  "Outside Egypt": { nameEn: "International / Outside Egypt", nameAr: "خارج مصر (شحن دولي)", rate: 350 },
};

export const getGovernorateRate = (governorateName) => {
  if (!governorateName) return 60; // Default rate if none selected
  const gov = GOVERNORATE_RATES[governorateName];
  return gov ? gov.rate : 60;
};

export const calculateShippingFee = (governorateName, subtotal = 0, shippingMethod = "standard") => {
  const baseRate = getGovernorateRate(governorateName);
  const premiumExtra = shippingMethod === "premium" ? 100 : 0;
  const totalBaseRate = baseRate + premiumExtra;

  if (subtotal >= FREE_SHIPPING_LIMIT) {
    return {
      fee: premiumExtra,
      originalFee: totalBaseRate,
      baseRate,
      premiumExtra,
      isFree: true,
      remainingForFree: 0,
      limit: FREE_SHIPPING_LIMIT,
    };
  }

  return {
    fee: totalBaseRate,
    originalFee: totalBaseRate,
    baseRate,
    premiumExtra,
    isFree: false,
    remainingForFree: FREE_SHIPPING_LIMIT - subtotal,
    limit: FREE_SHIPPING_LIMIT,
  };
};
