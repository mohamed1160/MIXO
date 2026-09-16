import { z } from 'zod';

export const checkoutSchema = z.object({
  contact: z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح / Invalid email address"),
    newsletter: z.boolean().optional(),
  }),
  shipping: z.object({
    fullName: z.string().min(2, "الاسم بالكامل مطلوب / Full name is required"),
    phone: z.string().min(10, "رقم الهاتف غير صحيح / Valid phone number is required"),
    streetAddress: z.string().min(3, "عنوان الشارع بالتفصيل مطلوب / Street address is required"),
    city: z.string().min(2, "المنطقة أو المدينة مطلوبة / City is required"),
    governorate: z.string().min(2, "المحافظة مطلوبة / Governorate is required"),
    postalCode: z.string().optional(),
    saveInfo: z.boolean().optional(),
  }),
  paymentMethod: z.enum(["instapay", "vodafone", "cod"], {
    errorMap: () => ({ message: "رجاء اختيار طريقة الدفع / Please select a payment method" }),
  }),
  transferReceipt: z.string().optional(),
});
