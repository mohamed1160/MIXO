import React, { useState, useEffect } from 'react';
import {
  getSupabaseOrders,
  updateSupabaseOrderStatus,
  deleteSupabaseOrder,
  subscribeToRealtimeOrders
} from '../../../services/db.service';
import {
  Search,
  Eye,
  Filter,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
  DollarSign,
  Trash2,
  Sliders,
  Phone,
  MapPin,
  X,
  Printer,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  'Pending Quote': { label: 'طلب سعر 3D', bg: 'rgba(234, 179, 8, 0.15)', color: '#EAB308', icon: Clock },
  'Pending': { label: 'قيد الانتظار', bg: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', icon: Clock },
  'Processing': { label: 'جاري التجهيز', bg: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', icon: Package },
  'Shipped': { label: 'تم الشحن', bg: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8', icon: Truck },
  'Delivered': { label: 'تم التسليم', bg: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', icon: CheckCircle2 },
  'Cancelled': { label: 'ملغي', bg: 'rgba(239, 68, 68, 0.15)', color: '#F87171', icon: XCircle },
};

// Fallback demo orders if localStorage is empty
const INITIAL_DEMO_ORDERS = [
  {
    id: 'ORD-9482',
    type: '3d_custom',
    customer: { name: 'أحمد محمود', phone: '01012345678', address: 'القاهرة - المعادي - شارع 9' },
    date: '2026-09-16 19:30',
    total: 350,
    status: 'Pending Quote',
    paymentMethod: 'Vodafone Cash',
    customData: {
      url: 'https://makerworld.com/en/models/123456',
      mask: '150 x 120 x 80 mm',
      filament: 'PLA Plus (Black)',
      notes: 'برجاء طباعة الجزء الداخلي بدقة 0.16mm ونسبة ملء 20%'
    },
    items: [
      { id: 'custom-1', name: 'مجسم 3D مخصص (MakerWorld)', price: 350, quantity: 1 }
    ]
  },
  {
    id: 'ORD-9481',
    type: 'standard',
    customer: { name: 'سارة علي', phone: '01198765432', address: 'الجيزة - الدقي - ميدان المساحة' },
    date: '2026-09-16 15:10',
    total: 620,
    status: 'Processing',
    paymentMethod: 'InstaPay',
    items: [
      { id: 'p1', name: 'تمثال التنين الخرافي 3D', price: 450, quantity: 1 },
      { id: 'p2', name: 'بكرة فيلامينت PLA Silk Gold 1kg', price: 170, quantity: 1 }
    ]
  },
  {
    id: 'ORD-9480',
    type: 'standard',
    customer: { name: 'عمر خالد', phone: '01234567890', address: 'الإسكندرية - سموحة' },
    date: '2026-09-15 11:20',
    total: 280,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    items: [
      { id: 'p3', name: 'فازة هندسية مدرجة 3D', price: 280, quantity: 1 }
    ]
  }
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quotePriceInput, setQuotePriceInput] = useState('');

  // Load orders from Supabase & LocalStorage fallback
  const fetchOrders = async () => {
    const data = await getSupabaseOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();

    const unsubscribe = subscribeToRealtimeOrders(() => {
      fetchOrders();
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateSupabaseOrderStatus(orderId, newStatus);
    fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    toast.success(`تم تحديث حالة الطلب إلى: ${newStatus}`);
  };

  const handleApproveQuote = async (orderId) => {
    const priceNum = parseFloat(quotePriceInput);
    if (!priceNum || priceNum <= 0) {
      toast.error('برجاء إدخال سعر صحيح للطلب 3D');
      return;
    }
    await updateSupabaseOrderStatus(orderId, 'Processing', priceNum);
    fetchOrders();
    toast.success(`تم اعتماد سعر الطباعة 3D (${priceNum} ج.م) وتغيير حالة الطلب إلى جاري التجهيز 🎉`);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('هل أنت تأكد من حذف هذا الطلب؟')) {
      await deleteSupabaseOrder(orderId);
      fetchOrders();
      toast.success('تم حذف الطلب بنجاح');
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    }
  };

  // Filtering
  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.phone || '').includes(search);

    if (!matchesSearch) return false;
    if (filterTab === 'all') return true;
    if (filterTab === '3d_custom') return o.type === '3d_custom' || o.status === 'Pending Quote';
    if (filterTab === 'pending') return o.status === 'Pending' || o.status === 'Pending Quote';
    if (filterTab === 'processing') return o.status === 'Processing';
    if (filterTab === 'delivered') return o.status === 'Delivered';
    if (filterTab === 'cancelled') return o.status === 'Cancelled';
    return true;
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? (o.total || 0) : 0), 0);
  const pendingCount = orders.filter(o => o.status === 'Pending' || o.status === 'Pending Quote').length;
  const customQuoteCount = orders.filter(o => o.type === '3d_custom' || o.status === 'Pending Quote').length;

  return (
    <div className="p-4 md:p-6 space-y-6 text-gray-900 dark:text-white min-h-screen dir-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-[#FF1F3D]" />
            إدارة الطلبات والتسعير 3D
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            متابعة طلبات المتجر وتحديد أسعار الطباعة الخاصة لروابط MakerWorld
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-xl text-left shadow-xs">
            <div className="text-xs text-gray-500 dark:text-gray-400">إجمالي المبيعات</div>
            <div className="text-lg font-extrabold text-[#FF1F3D]">{totalRevenue.toLocaleString()} ج.م</div>
          </div>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            {orders.length}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">إجمالي الطلبات</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{orders.length} طلب</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold">
            {pendingCount}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">في الانتظار</div>
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{pendingCount} طلب</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FF1F3D]/10 text-[#FF1F3D] flex items-center justify-center font-bold">
            {customQuoteCount}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">طلبات مجسمات 3D</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{customQuoteCount} طلب</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center font-bold">
            {orders.filter(o => o.status === 'Delivered').length}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">تم التسليم</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {orders.filter(o => o.status === 'Delivered').length} طلب
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: '3d_custom', label: 'طلبات 3D مخصصة 🎨' },
            { id: 'pending', label: 'قيد الانتظار' },
            { id: 'processing', label: 'جاري التجهيز' },
            { id: 'delivered', label: 'تم التسليم' },
            { id: 'cancelled', label: 'ملغي' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-[#FF1F3D] text-white font-bold shadow-lg shadow-[#FF1F3D]/20'
                  : 'bg-gray-100 dark:bg-[#1A2332] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث برقم الطلب، الاسم، أو الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-[#1A2332] text-gray-700 dark:text-gray-300 text-xs border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-semibold">رقم الطلب والتاريخ</th>
                <th className="p-4 font-semibold">العميل والهاتف</th>
                <th className="p-4 font-semibold">نوع الطلب</th>
                <th className="p-4 font-semibold">التفاصيل / رابط 3D</th>
                <th className="p-4 font-semibold">المبلغ الإجمالي</th>
                <th className="p-4 font-semibold">الحالة</th>
                <th className="p-4 font-semibold text-center">الإجراءات والبيان والتسعير</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    لا يوجد طلبات مطابقة للبحث أو الفلتر المحدد
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
                  const StatusIcon = statusInfo.icon;
                  const is3D = order.type === '3d_custom' || order.status === 'Pending Quote';

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-[#16202E] transition-colors">
                      {/* Order ID & Date */}
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{order.id}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5 font-mono">{order.date}</div>
                      </td>

                      {/* Customer Info */}
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white">{order.customer?.name || 'عميل زائر'}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-[11px] flex items-center gap-1 mt-0.5 font-mono" dir="ltr">
                          <Phone className="w-3 h-3 text-[#FF1F3D]" />
                          {order.customer?.phone || 'غير مسجل'}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="p-4">
                        {is3D ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FF1F3D]/15 text-[#FF1F3D] border border-[#FF1F3D]/30">
                            <Printer className="w-3 h-3" />
                            طلب تسعير 3D
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Package className="w-3 h-3" />
                            طلب منتجات
                          </span>
                        )}
                      </td>

                      {/* Items / 3D Details */}
                      <td className="p-4 max-w-xs">
                        {is3D ? (
                          <div className="space-y-1">
                            {order.customData?.url && (
                              <a
                                href={order.customData.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#FF1F3D] hover:underline font-semibold"
                              >
                                <ExternalLink className="w-3 h-3" />
                                فتح رابط MakerWorld
                              </a>
                            )}
                            {order.customData?.mask && (
                              <div className="text-gray-600 dark:text-gray-300 text-[11px]">
                                الأبعاد: <span className="text-gray-900 dark:text-white font-mono">{order.customData.mask}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-600 dark:text-gray-300 line-clamp-2">
                            {order.items?.map(i => `${i.name} (x${i.quantity || 1})`).join(' ، ')}
                          </div>
                        )}
                      </td>

                      {/* Total Price */}
                      <td className="p-4">
                        <div className="font-extrabold text-sm text-[#FF1F3D]">
                          {order.total ? `${order.total} ج.م` : 'بانتظار التسعير ⏳'}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{order.paymentMethod}</div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                          style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setQuotePriceInput(order.total ? String(order.total) : '');
                            }}
                            className="px-3 py-1.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                            title="تسعير وعرض التفاصيل"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{order.status === 'Pending Quote' || !order.total ? 'تحديد السعر 💰' : 'عرض التفاصيل'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 bg-gray-100 dark:bg-[#1A2332] hover:bg-red-600 text-gray-600 dark:text-gray-400 hover:text-white rounded-xl text-xs transition-all cursor-pointer"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Quote Approval Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 text-gray-900 dark:text-white dir-rtl relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute left-5 top-5 p-2 rounded-full bg-gray-100 dark:bg-[#1A2332] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">تفاصيل الطلب الكاملة وتحديد السعر</div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mt-1">
                <Package className="w-6 h-6 text-[#FF1F3D]" />
                {selectedOrder.id}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({selectedOrder.date})</span>
              </h2>
            </div>

            {/* Customer & Shipping Section */}
            <div className="bg-gray-50 dark:bg-[#1A2332] rounded-2xl p-4 space-y-3 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xs font-bold text-[#FF1F3D] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> بيانات العمـيل والشحـن
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">الاسم: </span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.customer?.name || 'غير محدد'}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">رقم الهاتف: </span>
                  <span className="font-mono text-gray-900 dark:text-white font-bold" dir="ltr">{selectedOrder.customer?.phone || 'غير مسجل'}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500 dark:text-gray-400">عنوان التسليم: </span>
                  <span className="text-gray-800 dark:text-white">{selectedOrder.customer?.address || 'غير مدخل'}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">طريقة الدفع: </span>
                  <span className="text-amber-600 dark:text-yellow-400 font-bold">{selectedOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* 3D Custom Quote Details if applicable */}
            {selectedOrder.customData && (
              <div className="bg-red-50/40 dark:bg-gradient-to-br dark:from-[#1F1722] dark:to-[#16202E] border border-[#FF1F3D]/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Printer className="w-5 h-5 text-[#FF1F3D]" />
                    طلب تسعير مجسم 3D مخصص
                  </h3>
                  {selectedOrder.customData?.url && (
                    <a
                      href={selectedOrder.customData.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#FF1F3D] text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#D91832] transition-all shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      فتح موديل MakerWorld
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-[#121923]/80 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-gray-500 dark:text-gray-400 text-[11px]">أبعاد الموديل المطلوب (Mask Dimensions):</div>
                    <div className="text-gray-900 dark:text-white font-mono font-bold mt-1">
                      {selectedOrder.customData?.mask || 'تلقائي حسب الرابط'}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#121923]/80 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-gray-500 dark:text-gray-400 text-[11px]">نوع الخامة (Filament):</div>
                    <div className="text-gray-900 dark:text-white font-bold mt-1">
                      {selectedOrder.customData?.filament || 'PLA Plus High Toughness'}
                    </div>
                  </div>
                </div>

                {selectedOrder.customData?.notes && (
                  <div className="bg-white dark:bg-[#121923]/80 p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-xs">
                    <div className="text-gray-500 dark:text-gray-400 text-[11px] mb-1">ملاحظات العميل:</div>
                    <div className="text-gray-800 dark:text-gray-200">{selectedOrder.customData.notes}</div>
                  </div>
                )}
              </div>
            )}

            {/* 🎯 Prominent Price Quote Input Form for ALL Orders */}
            <div className="bg-white dark:bg-[#121923] p-5 rounded-2xl border-2 border-[#FF1F3D] space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#FF1F3D]" />
                  <span>تحديد واعتماد سعر الطلب بعد الاتفاق مع العميل (ج.م):</span>
                </label>
                {selectedOrder.total > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">السعر الحالي: {selectedOrder.total} ج.م</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="أدخل السعر المتفق عليه هنا (مثال: 450)"
                  value={quotePriceInput}
                  onChange={(e) => setQuotePriceInput(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white font-bold placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                />
                <button
                  onClick={() => handleApproveQuote(selectedOrder.id)}
                  className="px-6 py-2.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-[#FF1F3D]/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>اعتماد السعر وتأكيد الطلب</span>
                </button>
              </div>
            </div>

            {/* Standard Order Items Table */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300">محتويات الشحنة والمنتجات:</h3>
                <div className="bg-gray-50 dark:bg-[#1A2332] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-gray-100 dark:bg-[#121923] text-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        <th className="p-3">اسم المنتج</th>
                        <th className="p-3">الكمية</th>
                        <th className="p-3">السعر الفردي</th>
                        <th className="p-3">المجموع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-800 dark:text-gray-300">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">{item.name}</td>
                          <td className="p-3 font-mono">{item.quantity || 1}</td>
                          <td className="p-3">{item.price} ج.م</td>
                          <td className="p-3 font-bold text-[#FF1F3D]">
                            {(item.price * (item.quantity || 1)).toLocaleString()} ج.م
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Status Change Selector */}
            <div className="bg-gray-50 dark:bg-[#1A2332] rounded-2xl p-4 border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">تحديث حالة الشحنة مباشرة:</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">الحالة الحالية: {selectedOrder.status}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.keys(STATUS_CONFIG).map(statusKey => (
                  <button
                    key={statusKey}
                    onClick={() => handleStatusChange(selectedOrder.id, statusKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedOrder.status === statusKey
                        ? 'bg-[#FF1F3D] text-white'
                        : 'bg-white dark:bg-[#121923] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {STATUS_CONFIG[statusKey].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
