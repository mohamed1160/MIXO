import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useShopStore } from '../../store/useShopStore';
import { useAuthStore } from '../../store/useAuthStore';
import { checkoutSchema } from '../../utils/validators';
import { useCreateOrder } from '../../hooks/useCreateOrder';
import { useLanguage } from '../../providers/LanguageContext';
import { useSEO } from '../../hooks/useSEO';

import CheckoutProgress from '../../components/checkout/CheckoutProgress';
import ShippingForm from '../../components/checkout/ShippingForm';
import DeliveryMethods from '../../components/checkout/DeliveryMethods';
import PaymentMethods from '../../components/checkout/PaymentMethods';
import OrderSummary from '../../components/checkout/OrderSummary';
import CheckoutSuccess from '../../components/checkout/CheckoutSuccess';
import { saveSupabaseOrder } from '../../services/db.service';

export default function Checkout() {
  const { isRTL } = useLanguage();

  // ── SEO (noindex) ──
  useSEO({ noindex: true });

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const rawCart = useShopStore((state) => state.cart) || [];
  const cart = rawCart.filter(item => item && typeof item.price === 'number');
  const emptyCart = useShopStore((state) => state.emptyCart);

  const [step, setStep] = useState(1);
  const [selectedMethodId, setSelectedMethodId] = useState("standard");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const createOrderMutation = useCreateOrder();

  const { register, handleSubmit, formState: { errors }, watch, trigger, control, setValue } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      contact: { 
        email: user?.email || "", 
        newsletter: true 
      },
      shipping: { 
        fullName: user?.name || "",
        phone: user?.phone || "",
        streetAddress: "",
        city: "",
        governorate: "Cairo",
        saveInfo: true 
      },
      paymentMethod: "instapay",
      transferReceipt: "",
    },
    mode: "onBlur"
  });

  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart', { replace: true });
    }
  }, [cart, orderSuccess, navigate]);

  const onSubmit = async (data) => {
    const totalAmount = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    const newOrderObj = {
      id: "ORD-" + Math.floor(Math.random() * 90000 + 10000),
      user_id: user?.id || null,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      orderStatus: "Processing",
      paymentStatus: data.paymentMethod === "cod" ? "Pending" : "Paid",
      statusColor: "bg-[#FF1F3D]/10 text-[#FF1F3D] border-[#FF1F3D]/20",
      total: totalAmount,
      paymentMethod: data.paymentMethod?.toUpperCase() || "InstaPay / Vodafone Cash",
      transferReceipt: data.transferReceipt || null,
      customer: {
        name: `${data.shipping?.fullName || (isRTL ? 'عميل المتجر' : 'Store Customer')}`.trim(),
        phone: data.shipping?.phone || '01012345678',
        email: data.contact?.email || 'customer@mixo3d.com',
        governorate: data.shipping?.governorate || 'Cairo',
        address: `${data.shipping?.streetAddress || ''}, ${data.shipping?.city || ''}, ${data.shipping?.governorate || 'Cairo'}`.trim(),
      },
      items: cart.map(i => ({
        name: i.name || i.title,
        quantity: i.quantity || 1,
        price: i.price || 0,
        image: i.image || i.images?.[0],
        category: i.category || '3D Print',
        material: 'High-Quality Eco PLA Filament',
      })),
    };

    try {
      await saveSupabaseOrder(newOrderObj);

      const orderData = {
        ...data,
        shippingMethod: selectedMethodId,
        items: cart,
      };
      
      if (import.meta.env.VITE_API_URL) {
        await createOrderMutation.mutateAsync(orderData).catch(() => {});
      }
      
      if (emptyCart) {
        emptyCart();
      } else {
        useShopStore.setState({ cart: [] });
      }
      
      setOrderSuccess(newOrderObj.id);
      window.scrollTo(0, 0);
    } catch (error) {
      await saveSupabaseOrder(newOrderObj);

      setOrderSuccess(newOrderObj.id);
      useShopStore.setState({ cart: [] });
      window.scrollTo(0, 0);
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isStepValid = await trigger(["contact.email", "shipping.fullName", "shipping.phone", "shipping.city", "shipping.streetAddress", "shipping.governorate"]);
      if (isStepValid) {
        setStep(2);
        window.scrollTo(0, 0);
      } else {
        toast.error(isRTL 
          ? "يرجى استكمال جميع بيانات الاسم والبريد والعنوان ورقم الهاتف" 
          : "Please complete all required name, email, phone & shipping fields.");
      }
    } else if (step === 2) {
      if (selectedMethodId) {
        setStep(3);
        window.scrollTo(0, 0);
      } else {
        toast.error(isRTL ? "يرجى تحديد طريقة التوصيل والشحن" : "Please select a shipping delivery method.");
      }
    } else if (step === 3) {
      const isStepValid = await trigger(["paymentMethod", "transferReceipt"]);
      if (isStepValid) {
        setStep(4);
        window.scrollTo(0, 0);
      } else {
        toast.error(isRTL ? "يرجى رفع صورة إيصال التحويل أولاً لإتمام العملية" : "Please upload the transfer receipt image to proceed.");
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0F14] pt-24 flex flex-col justify-between transition-colors">
        <CheckoutSuccess orderId={orderSuccess} />
      </div>
    );
  }

  if (cart.length === 0) return null;

  const NextArrow = isRTL ? ArrowLeft : ArrowRight;
  const PrevArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-[#FAF7F2] dark:bg-[#0B0F14] flex flex-col pt-16 text-gray-900 dark:text-white font-sans transition-colors ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}
    >
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutProgress currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          
          {/* Left Column - Forms */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <ShippingForm register={register} errors={errors} watch={watch} cart={cart} setValue={setValue} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <DeliveryMethods 
                    selectedMethodId={selectedMethodId} 
                    onMethodSelect={setSelectedMethodId}
                    watch={watch}
                    cart={cart}
                  />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <PaymentMethods register={register} errors={errors} watch={watch} setValue={setValue} cart={cart} />
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl mb-8 space-y-6 transition-colors">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                      <ShieldCheck className="w-6 h-6 text-[#FF1F3D]" />
                      <span>{isRTL ? "4. مراجعة وتأكيد الطلب النهائي" : "4. Review & Confirm Order"}</span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isRTL 
                        ? "برجاء مراجعة بيانات الشحن ووسيلة الدفع المحددة قبل إتمام الشراء."
                        : "Please review your shipping and payment details before completing your order."}
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-[#1A2332] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">{isRTL ? "الاسم والشحن:" : "Full Name:"}</span>
                        <span className="font-bold text-gray-900 dark:text-white">{watch("shipping.fullName") || (isRTL ? "عميل زائر" : "Guest Customer")}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">{isRTL ? "المحافظة والعنوان:" : "Governorate & Address:"}</span>
                        <span className="font-bold text-gray-900 dark:text-white">{watch("shipping.governorate")} - {watch("shipping.city")}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">{isRTL ? "طريقة الدفع المحددة:" : "Selected Payment Method:"}</span>
                        <span className="font-bold text-[#FF1F3D] dark:text-yellow-400 uppercase">{watch("paymentMethod")}</span>
                      </div>
                      {(watch("paymentMethod") === "instapay" || watch("paymentMethod") === "vodafone") && watch("transferReceipt") && (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-gray-500 dark:text-gray-400">{isRTL ? "إيصال التحويل المرفق:" : "Attached Transfer Receipt:"}</span>
                          <img src={watch("transferReceipt")} alt="Receipt" className="w-12 h-12 rounded-lg object-cover border border-[#FF1F3D]" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Step Navigation Buttons */}
            <div className="flex justify-between items-center mt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 h-12 px-6 border border-gray-300 dark:border-gray-700 hover:border-gray-500 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-all bg-white dark:bg-[#1A2332]"
                >
                  <PrevArrow size={16} />
                  <span>{isRTL ? "رجـوع" : "Back"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#FF1F3D] transition-colors"
                >
                  {isRTL ? "الرجوع للسلة" : "Return to Cart"}
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={step === 2 && !selectedMethodId}
                  className="group flex items-center justify-center gap-2 h-12 px-8 bg-[#FF1F3D] hover:bg-[#D91832] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#FF1F3D]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {isRTL 
                      ? (step === 1 ? 'الانتقال للتوصيل' : step === 2 ? 'الانتقال للدفع' : 'الانتقال للمراجعة')
                      : (step === 1 ? 'Continue to Delivery' : step === 2 ? 'Continue to Payment' : 'Continue to Review')
                    }
                  </span>
                  <NextArrow size={16} className="group-hover:scale-110 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={createOrderMutation.isPending}
                  className="group flex items-center justify-center gap-2 h-12 px-10 bg-[#FF1F3D] hover:bg-[#D91832] text-white text-xs font-extrabold rounded-xl transition-all shadow-lg shadow-[#FF1F3D]/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {createOrderMutation.isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>{isRTL ? "تأكيد وإتمام الطلب الآن" : "Place Order Now"}</span>
                      <NextArrow size={16} className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 h-full relative">
            <OrderSummary cart={cart} control={control} register={register} watch={watch} selectedMethodId={selectedMethodId} />
          </div>

        </div>
      </div>
    </motion.div>
  );
}
