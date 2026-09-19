import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Box,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  MapPin,
  Phone,
  FileText,
  AlertCircle,
  ShoppingBag,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../providers/LanguageContext';
import { formatCurrency } from '../../utils/formatCurrency';

import { getSupabaseOrders, subscribeToRealtimeOrders } from '../../services/db.service';
import { useSEO } from '../../hooks/useSEO';

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || '';
  const [orderIdQuery, setOrderIdQuery] = useState(initialQuery);
  const [foundOrder, setFoundOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const { isRTL } = useLanguage();

  // ── SEO (noindex) ──
  useSEO({ noindex: true });

  const handleSearchOrder = async (queryToSearch = orderIdQuery) => {
    const q = (queryToSearch || '').trim().toLowerCase();
    setSearched(true);
    if (!q) {
      setFoundOrder(null);
      return;
    }

    try {
      const orders = await getSupabaseOrders();
      if (orders && orders.length > 0) {
        const match = orders.find(
          (o) =>
            o.id.toLowerCase() === q ||
            o.id.toLowerCase().replace(/[^a-z0-9]/g, '') === q.replace(/[^a-z0-9]/g, '') ||
            (o.customer && o.customer.phone && o.customer.phone.includes(q))
        );
        if (match) {
          setFoundOrder(match);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // No order found in database
    setFoundOrder(null);
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearchOrder(initialQuery);
    }
  }, [initialQuery]);

  // Listen to live changes from Supabase Realtime & Storage events
  useEffect(() => {
    const unsubscribeRealtime = subscribeToRealtimeOrders(() => {
      if (orderIdQuery) {
        handleSearchOrder(orderIdQuery);
      }
    });

    const syncLiveOrders = () => {
      if (orderIdQuery) {
        handleSearchOrder(orderIdQuery);
      }
    };
    window.addEventListener('storage', syncLiveOrders);

    return () => {
      unsubscribeRealtime();
      window.removeEventListener('storage', syncLiveOrders);
    };
  }, [orderIdQuery]);

  const getStepStatus = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('delivered') || s.includes('completed') || s.includes('تسليم')) {
      return 4;
    }
    if (s.includes('shipped') || s.includes('out') || s.includes('شحن')) {
      return 3;
    }
    if (s.includes('printing') || s.includes('processing') || s.includes('تجهيز')) {
      return 2;
    }
    return 1;
  };

  const getStatusDisplayLabel = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s === 'pending quote' || s.includes('quote')) {
      return isRTL ? 'في انتظار التسعير ومراجعة الملف 3D ⏳' : 'Pending 3D Print Quote ⏳';
    }
    if (s === 'processing' || s.includes('processing') || s.includes('تجهيز')) {
      return isRTL ? 'جاري الطباعة والتصنيع 3D 🖨️' : '3D Printing & Manufacturing in Progress 🖨️';
    }
    if (s === 'shipped' || s.includes('shipped') || s.includes('شحن')) {
      return isRTL ? 'تم التغليف والشحن في الطريق إليك 🚚' : 'Shipped & Out for Delivery 🚚';
    }
    if (s === 'delivered' || s.includes('delivered') || s.includes('تسليم')) {
      return isRTL ? 'تم التسليم بنجاح 🎉' : 'Order Delivered Successfully 🎉';
    }
    if (s === 'cancelled' || s.includes('cancelled') || s.includes('ملغي')) {
      return isRTL ? 'طلب ملغي ❌' : 'Order Cancelled ❌';
    }
    return isRTL ? 'تم استلام الطلب وقيد المراجعة' : 'Order Received & Under Review';
  };

  const rawStatus = foundOrder ? foundOrder.status || foundOrder.orderStatus : 'Processing';
  const currentStep = getStepStatus(rawStatus);
  const isCancelled = (rawStatus || '').toLowerCase().includes('cancel') || (rawStatus || '').includes('ملغي');

  const STEPS = [
    {
      num: 1,
      titleAr: 'استلام ومراجعة الطلب',
      titleEn: 'Order Received',
      descAr: 'تأكيد البيانات ومراجعة ملف 3D',
      descEn: 'Confirmed & files verified',
      icon: FileText,
    },
    {
      num: 2,
      titleAr: 'جاري الطباعة 3D 🖨️',
      titleEn: '3D Printing',
      descAr: 'تشكيل وطباعة النماذج بالليزر/الفلامنت',
      descEn: '3D slice manufacturing in progress',
      icon: Printer,
    },
    {
      num: 3,
      titleAr: 'المعاينة والتغليف 📦',
      titleEn: 'Inspection & Packaging',
      descAr: 'فحص الجودة والتغليف المقوى',
      descEn: 'Quality check & anti-shock wrap',
      icon: Box,
    },
    {
      num: 4,
      titleAr: 'التوصيل والتسليم 🚚',
      titleEn: 'Delivery & Receipt',
      descAr: 'في الطريق إلى عنوانك بالمحافظة',
      descEn: 'Out for delivery to doorstep',
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B10] text-gray-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20 text-xs font-extrabold uppercase tracking-wider">
            <Truck size={14} />
            {isRTL ? 'تتبع حالة طلبات المتجر مباشرة' : 'Live Dashboard-Synced Order Tracking'}
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {isRTL ? 'تتبع طلبك بالرقم أو الهاتف' : 'Track Your Order Status'}
          </h1>

          <p className="text-xs text-gray-600 dark:text-[#AAB4C0] max-w-md mx-auto">
            {isRTL
              ? 'أدخل كود الطلب (مثل ORD-9481 أو ORD-9482) لمتابعة حالة طباعة مجسمك وحالة التوصيل لحظياً.'
              : 'Enter your Order Code (e.g. ORD-9481) to follow your live Dashboard order status.'}
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchOrder();
            }}
            className="pt-4 max-w-md mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                  isRTL ? 'right-4' : 'left-4'
                }`}
              />
              <input
                type="text"
                value={orderIdQuery}
                onChange={(e) => setOrderIdQuery(e.target.value)}
                placeholder={isRTL ? 'مثال: ORD-9481 أو رقم هاتفك' : 'e.g. ORD-9481 or Phone Number'}
                className={`w-full bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-2xl py-3.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#7F8A96] focus:outline-none focus:border-[#FF1F3D] shadow-sm transition-colors ${
                  isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
                }`}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-red-600/20 shrink-0 cursor-pointer"
            >
              {isRTL ? 'تتبـع' : 'Track'}
            </button>
          </form>
        </div>

        {/* Order Found Details */}
        {foundOrder ? (
          <div className="bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
            {/* Status Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-[#1E2630]">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-[#7F8A96]">
                  {isRTL ? 'رقم الطلب المسجل بالداشبورد' : 'Dashboard Order Reference'}
                </span>
                <h2 className="text-xl font-black text-[#FF1F3D]">{foundOrder.id}</h2>
                <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-0.5">
                  {isRTL ? 'التاريخ:' : 'Placed on:'} {foundOrder.date || 'Today'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 border shadow-xs ${
                    isCancelled
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}
                >
                  {isCancelled ? <XCircle size={15} /> : <Clock size={15} />}
                  <span>{getStatusDisplayLabel(rawStatus)}</span>
                </span>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#151C24] dark:hover:bg-[#1E2630] text-gray-800 dark:text-[#F5F7FA] rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border border-gray-200 dark:border-[#26313D] shadow-xs active:scale-95 cursor-pointer"
                  title={isRTL ? 'طباعة / حفظ إيصال الطلب كـ PDF' : 'Print or Save Receipt as PDF'}
                >
                  <Printer size={14} className="text-[#FF1F3D]" />
                  <span>{isRTL ? 'طباعة الإيصال 📄' : 'Print Receipt 📄'}</span>
                </button>
              </div>
            </div>

            {/* 4-Step Progress Bar */}
            {!isCancelled && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-[#7F8A96]">
                  {isRTL ? 'مراحل تجهيز الطلب 3D (محدثة لحظياً من اللوحة)' : 'Live 3D Order Status Timeline'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                  {STEPS.map((s) => {
                    const Icon = s.icon;
                    const isCompleted = s.num <= currentStep;
                    const isCurrent = s.num === currentStep;

                    return (
                      <div
                        key={s.num}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-red-500/5 border-[#FF1F3D] shadow-md shadow-red-600/10 mixo-card-hover'
                            : isCompleted
                            ? 'bg-gray-50 dark:bg-[#151C24] border-gray-200 dark:border-[#26313D]'
                            : 'bg-gray-50/50 dark:bg-[#121923]/40 border-gray-200/50 dark:border-[#1E2630]/50 opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isCurrent
                                ? 'bg-[#FF1F3D] text-white shadow-sm animate-pulse-glow'
                                : isCompleted
                                ? 'bg-[#FF1F3D] text-white shadow-sm'
                                : 'bg-gray-200 dark:bg-[#1E2630] text-gray-500 dark:text-[#7F8A96]'
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          <span className="text-[10px] font-mono text-gray-400">0{s.num}</span>
                        </div>

                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                          {isRTL ? s.titleAr : s.titleEn}
                        </h4>
                        <p className="text-[10px] text-gray-500 dark:text-[#7F8A96] mt-1 leading-tight">
                          {isRTL ? s.descAr : s.descEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom 3D Order Details if available */}
            {foundOrder.customData && (
              <div className="p-4 bg-red-500/5 border border-[#FF1F3D]/20 rounded-2xl space-y-2 text-xs">
                <p className="font-bold text-[#FF1F3D] flex items-center gap-1.5">
                  <Printer size={16} />
                  <span>{isRTL ? 'تفاصيل طلب مجسم 3D مخصص:' : 'Custom 3D Print Request Details:'}</span>
                </p>
                {foundOrder.customData.mask && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {isRTL ? 'أبعاد الخوذة/المجسم:' : 'Dimensions:'} <span className="font-mono font-bold">{foundOrder.customData.mask}</span>
                  </p>
                )}
                {foundOrder.customData.filament && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {isRTL ? 'الخامة المطلوبة:' : 'Filament:'} <span className="font-bold">{foundOrder.customData.filament}</span>
                  </p>
                )}
                {foundOrder.customData.notes && (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    "{foundOrder.customData.notes}"
                  </p>
                )}
              </div>
            )}

            {/* Order Items Breakdown */}
            <div className="space-y-3 border-t border-gray-200 dark:border-[#1E2630] pt-6">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#FF1F3D]" />
                <span>{isRTL ? 'محتويات الشحنة والمنتجات' : 'Order Items Breakdown'}</span>
              </h3>

              <div className="divide-y divide-gray-100 dark:divide-[#1E2630] bg-gray-50 dark:bg-[#151C24] rounded-2xl p-4">
                {(foundOrder.items || []).map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF1F3D]/10 text-[#FF1F3D] flex items-center justify-center font-bold">
                        {item.quantity || 1}x
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-gray-500 dark:text-[#7F8A96]">{item.category || '3D Print'}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#FF1F3D]">
                      {item.price ? formatCurrency(item.price) : isRTL ? 'في انتظار التسعير' : 'Awaiting Quote'}
                    </span>
                  </div>
                ))}

                <div className="pt-3 mt-2 border-t border-gray-200 dark:border-[#26313D] flex items-center justify-between text-xs font-bold">
                  <span>{isRTL ? 'إجمالي قيمة الطلب النهائي:' : 'Order Total Amount:'}</span>
                  <span className="text-base text-[#FF1F3D] font-black">
                    {foundOrder.total ? formatCurrency(foundOrder.total) : isRTL ? 'بانتظار التسعير ⏳' : 'Pending Quote'}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address Summary */}
            {foundOrder.customer && (
              <div className="p-4 bg-gray-50 dark:bg-[#151C24] rounded-2xl border border-gray-200 dark:border-[#1E2630] text-xs space-y-1">
                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin size={14} className="text-[#FF1F3D]" />
                  <span>{isRTL ? 'بيانات العميل وعنوان التسليم:' : 'Shipping Address:'}</span>
                </p>
                <p className="text-gray-600 dark:text-[#AAB4C0] pl-6">
                  {foundOrder.customer.name} - {foundOrder.customer.address} (
                  {foundOrder.customer.governorate || 'القاهرة'})
                </p>
                {foundOrder.customer.phone && (
                  <p className="text-gray-500 dark:text-gray-400 pl-6 font-mono dir-ltr">
                    📞 {foundOrder.customer.phone}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : searched ? (
          <div className="bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-3xl p-10 text-center space-y-3">
            <AlertCircle size={40} className="mx-auto text-[#FF1F3D]" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {isRTL ? 'لم نجد طلباً بهذا الرقم في اللوحة' : 'No order found in Dashboard with this reference'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96] max-w-sm mx-auto">
              {isRTL
                ? 'تأكد من كتابة كود الطلب (مثل ORD-9481 أو ORD-9482) أو البحث برقم الهاتف المسجل.'
                : 'Double check your order code (e.g. ORD-9481) or search with your registered phone number.'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
