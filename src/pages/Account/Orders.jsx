import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Eye,
  RotateCcw,
  Sparkles,
  CreditCard,
  X,
  Printer,
  ShoppingBag,
  Ruler,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useLanguage } from "../../providers/LanguageContext";

export default function AccountOrders() {
  const { isRTL } = useLanguage();
  const { user } = useAuthStore();
  
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Retrieve actual user orders from local storage
  const storedOrders = JSON.parse(localStorage.getItem("MIXO_customer_orders") || "[]");
  const userOrders = storedOrders.filter(
    (o) =>
      (o.customer?.phone && user?.phone && o.customer?.phone === user?.phone) ||
      (o.customer?.email && user?.email && o.customer?.email?.toLowerCase() === user?.email?.toLowerCase())
  );

  const filteredOrders = userOrders.filter((ord) => {
    if (activeFilter === "All") return true;
    const status = ord.orderStatus || ord.status || "Processing";
    return status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-900 dark:text-[#F5F7FA] relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151C24] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#26313D] animate-bounce">
          <Sparkles size={16} className="text-[#FF1F3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#1E2630] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Package size={24} className="text-[#FF1F3D]" />
            <span>{isRTL ? "طلبياتي وسجل الطباعة" : "My Orders & Printing History"}</span>
            <span className="text-xs font-bold text-[#FF1F3D] bg-red-500/10 px-2.5 py-1 rounded-full border border-[#FF1F3D]/20">
              {userOrders.length} {isRTL ? "طلب" : "Orders"}
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1">
            {isRTL
              ? "متابعة تتبع وحالة طلبيات الطباعة 3D والعروض المطلوبة."
              : "Track progress and status of your 3D printed items and custom orders."}
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: "All", label: isRTL ? "جميع الطلبات" : "All Orders" },
          { key: "Processing", label: isRTL ? "قيد المعالجة" : "Processing" },
          { key: "Shipped", label: isRTL ? "تم الشحن" : "Shipped" },
          { key: "Delivered", label: isRTL ? "تم التسليم" : "Delivered" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === tab.key
                ? "bg-[#FF1F3D] text-white shadow-md shadow-red-500/20"
                : "text-gray-600 dark:text-[#AAB4C0] bg-gray-50 dark:bg-[#151C24] hover:bg-gray-100 dark:hover:bg-[#1C2530] border border-gray-200 dark:border-[#26313D]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List / Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 dark:bg-[#0F151D] rounded-3xl border border-gray-100 dark:border-[#1E2630] flex flex-col items-center justify-center gap-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-[#FF1F3D] flex items-center justify-center shadow-inner">
            <Printer size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isRTL ? "لا توجد طلبيات سابقة" : "No Orders Placed Yet"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-[#7F8A96] max-w-sm mt-1 leading-relaxed">
              {isRTL
                ? "لم تقم بتقديم أي طلبية طباعة 3D حتى الآن. تصفح كتالوج المتجر أو قدم طلب تصميم مخصص."
                : "You haven't placed any 3D print orders yet. Browse the shop catalog or submit a custom 3D request."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link
              to="/shop"
              className="px-6 py-3 bg-[#FF1F3D] hover:bg-[#E01833] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-red-500/20 transition-all flex items-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>{isRTL ? "تصفح المتجر" : "Browse Shop"}</span>
            </Link>
            <Link
              to="/custom-order"
              className="px-6 py-3 bg-gray-900 dark:bg-[#151C24] hover:bg-black text-white text-xs font-bold rounded-xl border border-transparent dark:border-[#26313D] transition-all flex items-center gap-2 shadow-sm"
            >
              <Printer size={16} className="text-[#FF1F3D]" />
              <span className="text-white font-bold">{isRTL ? "طلب 3D مخصص" : "Custom 3D Order"}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredOrders.map((ord) => {
            const status = ord.orderStatus || ord.status || "Processing";
            const totalDisplay = ord.total > 0 ? `${Number(ord.total).toFixed(2)} ج.م` : (isRTL ? "في انتظار التسعير" : "Quote Pending");

            return (
              <div
                key={ord.id}
                className="bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col gap-4 hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#1E2630] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-[#FF1F3D] flex items-center justify-center font-bold text-xs shrink-0">
                      <Printer size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base">
                        Order #{ord.id}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                        {isRTL ? `تاريخ الطلب: ${ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ord.date || "Recent"}` : `Placed on ${ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ord.date || "Recent"}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        ord.statusColor || "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}
                    >
                      {status}
                    </span>
                    <span className="font-extrabold text-[#FF1F3D] text-base">{totalDisplay}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-3 py-1">
                  {(ord.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-[#151C24] rounded-2xl border border-gray-100 dark:border-[#26313D] gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-[#0B0F14] overflow-hidden shrink-0 border border-gray-200 dark:border-[#26313D]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-[#7F8A96]">
                            <span className="bg-red-500/10 text-[#FF1F3D] px-2 py-0.5 rounded-md font-semibold">
                              PLA Material
                            </span>
                            <span>× {item.quantity || 1}</span>
                          </div>
                          {(item.faceHeight || item.faceWidth) && (
                            <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 font-semibold">
                              <Ruler size={12} className="text-[#FF1F3D]" />
                              <span>
                                {isRTL
                                  ? `الأبعاد: ${item.faceHeight || "-"}سم ارتفاع × ${item.faceWidth || "-"}سم عرض`
                                  : `Dimensions: ${item.faceHeight || "-"}cm height × ${item.faceWidth || "-"}cm width`}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:text-right font-extrabold text-gray-900 dark:text-white text-sm">
                        {item.price > 0 ? `${(item.price * (item.quantity || 1)).toFixed(2)} ج.م` : (isRTL ? "قيد التسعير" : "Quote Pending")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-[#1E2630] pt-4 text-xs">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-[#7F8A96] text-[11px]">
                    <CreditCard size={15} className="text-[#FF1F3D]" />
                    <span className="font-semibold">{ord.paymentMethod || "Vodafone Cash / InstaPay"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(ord)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 dark:bg-[#151C24] hover:bg-black text-white text-xs font-bold rounded-xl border border-transparent dark:border-[#26313D] cursor-pointer transition-colors shadow-xs"
                    >
                      <Eye size={14} className="text-[#FF1F3D]" />
                      <span className="text-white font-bold">{isRTL ? "تفاصيل الطلب" : "View Details"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        triggerToast(
                          isRTL
                            ? `جاري إعادة إرسال طلب العناصر في الطلب #${ord.id}... 🛍️`
                            : `Reordering items from Order #${ord.id}... 🛍️`
                        )
                      }
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#FF1F3D] hover:bg-[#E01833] text-white rounded-xl font-bold cursor-pointer shadow-md hover:shadow-red-500/20 transition-all"
                    >
                      <RotateCcw size={14} />
                      <span>{isRTL ? "إعادة الطلب" : "Reorder"}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* View Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#0F151D] w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-[#1E2630] flex flex-col gap-4 relative">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1E2630] pb-3">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Printer size={18} className="text-[#FF1F3D]" />
                <span>{isRTL ? `ملخص الطلب #${selectedOrder.id}` : `Order Details #${selectedOrder.id}`}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#151C24] text-gray-500 hover:text-black dark:text-[#AAB4C0] dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3.5 bg-gray-50 dark:bg-[#151C24] rounded-2xl border border-gray-100 dark:border-[#26313D]">
                <span className="font-bold text-gray-400 block mb-1">{isRTL ? "عنوان التوصيل والمعلومات:" : "Shipping Info:"}</span>
                <span className="font-bold text-gray-900 dark:text-white block">
                  {selectedOrder.customer?.address || (isRTL ? "غير محدد" : "Not specified")}
                </span>
                <span className="text-gray-500 dark:text-[#7F8A96] block mt-1">
                  📞 {selectedOrder.customer?.phone || user?.phone || (isRTL ? "غير محدد" : "Not specified")}
                </span>
              </div>

              <div className="p-3.5 bg-red-500/5 rounded-2xl border border-[#FF1F3D]/20">
                <span className="font-bold text-[#FF1F3D] block mb-1">{isRTL ? "طريقة الدفع ومواصفات خامة الـ 3D:" : "Payment & Printing Spec:"}</span>
                <span className="font-bold text-gray-900 dark:text-white block">
                  {selectedOrder.paymentMethod || "Vodafone Cash"}
                </span>
                <span className="text-[#FF1F3D] font-semibold block mt-1">
                  ✓ High-Quality Eco PLA Filament
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-[#1E2630]">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#FF1F3D] hover:bg-[#E01833] rounded-xl cursor-pointer shadow-md"
              >
                {isRTL ? "إغلاق التفاصيل" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
