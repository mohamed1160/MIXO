import api from '../api/axios';

export const shippingService = {
  getShippingMethods: async () => {
    return [
      {
        _id: "standard",
        name: "Standard Shipping",
        nameAr: "الشحن القياسي لجميع المحافظات",
        description: "الشحن العادي حسب المحافظة وتجهيز الطباعة (خلال 2-4 أيام عمل)",
        descriptionAr: "الشحن العادي حسب المحافظة وتجهيز الطباعة (خلال 2-4 أيام عمل)",
        descriptionEn: "Standard governorate shipping rate with careful 3D print packaging (2-4 business days)",
        price: 0,
        estimatedDays: "2 - 4 business days",
        estimatedDaysAr: "خلال 2 - 4 أيام عمل",
        icon: "truck",
        available: true
      }
    ];
  },
  saveShippingMethod: async (methodId) => {
    return { success: true, methodId };
  }
};
