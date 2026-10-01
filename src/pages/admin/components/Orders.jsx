import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import {
  getSupabaseOrders,
  updateSupabaseOrderStatus,
  updateSupabaseOrderPaymentStatus,
  deleteSupabaseOrder,
  subscribeToRealtimeOrders
} from '../../../services/db.service';
import { supabase } from '../../../services/supabaseClient';
import { useLanguage } from '../../../providers/LanguageContext';
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
  Phone,
  MapPin,
  X,
  Printer,
  CreditCard,
  LayoutGrid,
  List,
  Copy,
  User,
  Calendar,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Orders() {
  const navigate = useNavigate();
  const { isRTL, lang } = useLanguage();
  const { id: paramOrderId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlOrderId = paramOrderId || searchParams.get('orderId') || searchParams.get('id');

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quotePriceInput, setQuotePriceInput] = useState('');

  const currencyText = isRTL ? 'ج.م' : 'EGP';

  const STATUS_CONFIG = {
    'Pending Quote': {
      label: isRTL ? 'طلب سعر 3D' : '3D Quote Request',
      bg: 'rgba(234, 179, 8, 0.15)',
      color: '#EAB308',
      icon: Clock
    },
    'Pending': {
      label: isRTL ? 'قيد الانتظار' : 'Pending',
      bg: 'rgba(59, 130, 246, 0.15)',
      color: '#60A5FA',
      icon: Clock
    },
    'Processing': {
      label: isRTL ? 'جاري التجهيز' : 'Processing',
      bg: 'rgba(168, 85, 247, 0.15)',
      color: '#C084FC',
      icon: Package
    },
    'Shipped': {
      label: isRTL ? 'تم الشحن' : 'Shipped',
      bg: 'rgba(14, 165, 233, 0.15)',
      color: '#38BDF8',
      icon: Truck
    },
    'Delivered': {
      label: isRTL ? 'تم التسليم' : 'Delivered',
      bg: 'rgba(34, 197, 94, 0.15)',
      color: '#4ADE80',
      icon: CheckCircle2
    },
    'Cancelled': {
      label: isRTL ? 'ملغي' : 'Cancelled',
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#F87171',
      icon: XCircle
    },
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    if (paramOrderId) {
      navigate('/admin/orders', { replace: true });
    } else if (searchParams.get('orderId') || searchParams.get('id')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('orderId');
      newParams.delete('id');
      setSearchParams(newParams, { replace: true });
    }
  };

  // Fetch orders from Supabase / LocalStorage
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

  // Auto select order if parameter is in URL
  useEffect(() => {
    if (!urlOrderId) return;

    let isMounted = true;

    const resolveOrder = async () => {
      const match = orders.find(
        (o) => String(o.id).toLowerCase() === String(urlOrderId).toLowerCase()
      );

      if (match) {
        if (isMounted) {
          setSelectedOrder(match);
          setQuotePriceInput(match.total ? String(match.total) : '');
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', urlOrderId)
          .maybeSingle();

        if (data && !error && isMounted) {
          const formatted = {
            id: data.id,
            user_id: data.user_id,
            customer: data.customer,
            items: data.items,
            customData: data.custom_data,
            status: data.status,
            paymentStatus: data.customer?.paymentStatus || data.payment_status || 'Pending',
            paymentMethod: data.payment_method || 'InstaPay / Vodafone Cash',
            transferReceipt: data.transfer_receipt || null,
            total: data.total,
            date: data.date,
            createdAt: data.created_at
          };

          setSelectedOrder(formatted);
          setQuotePriceInput(formatted.total ? String(formatted.total) : '');
          setOrders((prev) => [formatted, ...prev.filter((o) => o.id !== formatted.id)]);
        }
      } catch (err) {
        console.warn('Direct order fetch error:', err);
      }
    };

    resolveOrder();

    return () => {
      isMounted = false;
    };
  }, [urlOrderId, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateSupabaseOrderStatus(orderId, newStatus);
    fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    const statusLabel = STATUS_CONFIG[newStatus]?.label || newStatus;
    toast.success(
      isRTL
        ? `تم تغيير حالة الطلب ${orderId} إلى: ${statusLabel}`
        : `Updated order status to: ${statusLabel}`
    );
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    await updateSupabaseOrderPaymentStatus(orderId, newPaymentStatus);
    fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
    }
    const label = (newPaymentStatus === 'Paid' || newPaymentStatus === 'تم تأكيد الدفع') 
      ? (isRTL ? 'تم تأكيد الدفع بنجاح ✓' : 'Payment Confirmed ✓')
      : (isRTL ? 'لم يتم التأكد من التحويل (قيد المراجعة)' : 'Payment Pending Verification');
    toast.success(`${isRTL ? 'تم تحديث حالة الدفع إلى:' : 'Payment status updated:'} ${label}`);
  };

  const handleApproveQuote = async (orderId) => {
    const priceNum = parseFloat(quotePriceInput);
    if (!priceNum || priceNum <= 0) {
      toast.error(isRTL ? 'برجاء إدخال سعر صحيح للطلب 3D' : 'Please enter a valid price');
      return;
    }
    await updateSupabaseOrderStatus(orderId, 'Processing', priceNum);
    fetchOrders();
    toast.success(
      isRTL
        ? `تم اعتماد سعر الطباعة 3D (${priceNum} ${currencyText}) وتغيير حالة الطلب إلى جاري التجهيز 🎉`
        : `Approved 3D quote (${priceNum} ${currencyText})! 🎉`
    );
    handleCloseModal();
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(isRTL ? 'هل أنت تأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this order?')) {
      await deleteSupabaseOrder(orderId);
      fetchOrders();
      toast.success(isRTL ? 'تم حذف الطلب بنجاح' : 'Order deleted successfully');
      if (selectedOrder?.id === orderId) handleCloseModal();
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${isRTL ? 'تم نسخ' : 'Copied'} ${label}`);
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
    <div className={`p-4 md:p-6 space-y-6 text-gray-900 dark:text-white min-h-screen ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-[#FF1F3D]" />
            <span>{isRTL ? 'إدارة الطلبات والتسعير 3D' : 'Orders & 3D Quotes Management'}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {isRTL 
              ? 'متابعة طلبات المتجر وتحديد أسعار الطباعة الخاصة لروابط MakerWorld'
              : 'Manage store orders, MakerWorld URLs and custom 3D printing quotes'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-2xl shadow-xs">
            <div className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? 'إجمالي المبيعات' : 'Total Revenue'}</div>
            <div className="text-lg font-extrabold text-[#FF1F3D]">{totalRevenue.toLocaleString()} {currencyText}</div>
          </div>
        </div>
      </div>

      {/* ── Stats Quick Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            {orders.length}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? 'إجمالي الطلبات' : 'Total Orders'}</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{orders.length} {isRTL ? 'طلب' : 'Orders'}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold">
            {pendingCount}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? 'في الانتظار' : 'Pending Orders'}</div>
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{pendingCount} {isRTL ? 'طلب' : 'Orders'}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FF1F3D]/10 text-[#FF1F3D] flex items-center justify-center font-bold">
            {customQuoteCount}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? 'طلبات 3D مخصصة' : '3D Custom Quotes'}</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{customQuoteCount} {isRTL ? 'طلب' : 'Quotes'}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center font-bold">
            {orders.filter(o => o.status === 'Delivered').length}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? 'تم التسليم' : 'Delivered'}</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {orders.filter(o => o.status === 'Delivered').length} {isRTL ? 'طلب' : 'Orders'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Control Bar: Filters, View Mode Toggle & Search ── */}
      <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: isRTL ? 'الكل' : 'All' },
            { id: '3d_custom', label: isRTL ? 'طلبات 3D مخصصة 🎨' : '3D Quotes 🎨' },
            { id: 'pending', label: isRTL ? 'قيد الانتظار' : 'Pending' },
            { id: 'processing', label: isRTL ? 'جاري التجهيز' : 'Processing' },
            { id: 'delivered', label: isRTL ? 'تم التسليم' : 'Delivered' },
            { id: 'cancelled', label: isRTL ? 'ملغي' : 'Cancelled' },
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

        {/* View Mode Toggle & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* View Switcher: Card Grid vs Table */}
          <div className="flex items-center bg-gray-100 dark:bg-[#1A2332] p-1 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'cards'
                  ? 'bg-[#FF1F3D] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title={isRTL ? "عرض الكروت المميزة" : "Cards View"}
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">{isRTL ? "كروت" : "Cards"}</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-[#FF1F3D] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title={isRTL ? "عرض الجدول" : "Table View"}
            >
              <List size={15} />
              <span className="hidden sm:inline">{isRTL ? "جدول" : "Table"}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isRTL ? "بحث برقم الطلب، الاسم، أو الهاتف..." : "Search by order ID, name, or phone..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
            />
          </div>
        </div>
      </div>

      {/* ── Main Orders Container (Cards Grid View or Table View) ── */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center text-gray-500 dark:text-gray-400 space-y-3">
          <Package className="w-12 h-12 text-gray-400 mx-auto opacity-50" />
          <p className="text-sm font-bold">
            {isRTL ? "لا يوجد طلبات مطابقة للبحث أو الفلتر المحدد" : "No orders found matching your search or filter criteria."}
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* ── 📱 Desktop & Mobile Enhanced Order Cards Grid ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => {
            const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
            const StatusIcon = statusInfo.icon;
            const is3D = order.type === '3d_custom' || order.status === 'Pending Quote';
            const isPaid = order.paymentStatus === 'Paid' || order.paymentStatus === 'تم تأكيد الدفع';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#121923] border border-gray-200/90 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-[#FF1F3D]/30 transition-all duration-300 flex flex-col justify-between gap-4 group relative overflow-hidden"
              >
                {/* Card Header: ID, Type Tag & Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-base text-gray-900 dark:text-white font-mono tracking-wide">
                          {order.id}
                        </span>
                        <button
                          onClick={() => copyToClipboard(order.id, 'رقم الطلب')}
                          className="p-1 text-gray-400 hover:text-[#FF1F3D] transition-colors"
                          title="Copy Order ID"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono block mt-0.5">
                        {order.date}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold shrink-0 shadow-xs"
                      style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>

                  {/* Customer Info Card Box */}
                  <div className="bg-gray-50/80 dark:bg-[#17202C] p-3 rounded-2xl border border-gray-100 dark:border-gray-800/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#FF1F3D]" />
                        <span>{order.customer?.name || (isRTL ? 'عميل زائر' : 'Guest Customer')}</span>
                      </span>

                      {order.customer?.phone && (
                        <a
                          href={`tel:${order.customer.phone}`}
                          className="font-mono text-[#FF1F3D] font-bold hover:underline flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-lg text-[11px]"
                          dir="ltr"
                        >
                          <Phone size={11} />
                          <span>{order.customer.phone}</span>
                        </a>
                      )}
                    </div>

                    {/* WhatsApp Quick Contact Button (Request 3) */}
                    {(order.customer?.whatsapp || order.customer?.phone) && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                        <span className="text-[11px] text-gray-500 font-semibold">{isRTL ? "واتساب:" : "WhatsApp:"}</span>
                        <a
                          href={`https://wa.me/${String(order.customer?.whatsapp || order.customer?.phone).replace(/[^0-9]/g, '').replace(/^0/, '20')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-lg text-[11px]"
                          dir="ltr"
                        >
                          <span>💬 {order.customer?.whatsapp || order.customer?.phone}</span>
                        </a>
                      </div>
                    )}

                    {order.customer?.address && (
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 pt-0.5">
                        <MapPin size={12} className="shrink-0 text-gray-400" />
                        <span className="truncate">{order.customer.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Type & Items Preview */}
                  <div className="space-y-2">
                    {/* Order Type Badge */}
                    <div>
                      {is3D ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#FF1F3D]/15 text-[#FF1F3D] border border-[#FF1F3D]/30">
                          <Printer className="w-3 h-3" />
                          <span>{isRTL ? "طلب تسعير 3D مخصص" : "Custom 3D Print Quote"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          <Package className="w-3 h-3" />
                          <span>{isRTL ? "طلب منتجات المتجر" : "Standard Store Products"}</span>
                        </span>
                      )}
                    </div>

                    {/* 3D Custom Links or Products List */}
                    {is3D ? (
                      <div className="space-y-1.5 text-xs bg-red-500/5 dark:bg-[#1F1722]/50 p-2.5 rounded-xl border border-[#FF1F3D]/20">
                        {order.customData?.url && (
                          <a
                            href={order.customData.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[#FF1F3D] hover:underline font-bold"
                          >
                            <ExternalLink size={13} />
                            <span>{isRTL ? "فتح رابط MakerWorld" : "Open MakerWorld URL"}</span>
                          </a>
                        )}

                        {(order.customData?.fileUrl || order.customData?.uploadedFiles?.length > 0) && (
                          <div className="flex flex-col gap-1">
                            {(order.customData.uploadedFiles || [order.customData.fileUrl]).map((file, idx) => (
                              <a
                                key={idx}
                                href={file}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                              >
                                <Download size={13} />
                                <span>{isRTL ? `تحميل ملف الـ 3D المرفوع #${idx + 1}` : `Download 3D File #${idx + 1}`}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {order.customData?.mask && (
                          <div className="text-[11px] text-gray-600 dark:text-gray-300 font-semibold pt-1 border-t border-[#FF1F3D]/10">
                            {isRTL ? "أبعاد الماسك:" : "Mask Dimensions:"} <span className="font-mono text-gray-900 dark:text-white">{order.customData.mask}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {order.items?.map((item, idx) => {
                          const itemColor = item.color || item.selectedColor;
                          const hasMask = item.maskHeight || item.circularWidth || item.size;

                          return (
                            <div key={idx} className="flex flex-col gap-1 text-xs bg-gray-50/50 dark:bg-[#17202C]/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                              <div className="flex justify-between items-center font-bold text-gray-900 dark:text-white">
                                <span className="truncate">{item.name}</span>
                                <span className="font-mono text-gray-500 shrink-0 ml-2">x{item.quantity || 1}</span>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {itemColor && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-[#FF1F3D] dark:text-red-400 text-[10px] font-bold border border-red-500/20">
                                    <span>🎨 {itemColor}</span>
                                  </span>
                                )}
                                {hasMask && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                                    <span>🎭 {item.maskHeight ? `${item.maskHeight}×${item.circularWidth || ''} cm` : item.size}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Price, Payment Status & Action Buttons */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-extrabold">{isRTL ? "المبلغ الإجمالي" : "Total Price"}</div>
                      <div className="text-base font-black text-[#FF1F3D]">
                        {order.total ? `${order.total} ${currencyText}` : (isRTL ? "بانتظار التسعير ⏳" : "Pending Quote ⏳")}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                        isPaid
                          ? 'bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}>
                        {isPaid ? (isRTL ? 'تم الدفع ✓' : 'Paid ✓') : (isRTL ? 'لم يتم الدفع ⏳' : 'Payment Pending')}
                      </span>
                    </div>
                  </div>

                  {/* Buttons Action Bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setQuotePriceInput(order.total ? String(order.total) : '');
                      }}
                      className="flex-1 py-2.5 px-3 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#FF1F3D]/20 active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{order.status === 'Pending Quote' || !order.total ? (isRTL ? 'تحديد السعر 💰' : 'Set Price 💰') : (isRTL ? 'عرض التفاصيل' : 'View Details')}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-2.5 bg-gray-100 dark:bg-[#1A2332] hover:bg-red-600 text-gray-600 dark:text-gray-400 hover:text-white rounded-xl text-xs transition-all cursor-pointer shrink-0"
                      title={isRTL ? "حذف الطلب" : "Delete Order"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── 💻 Desktop Classic Table View ── */
        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
              <thead>
                <tr className="bg-gray-100 dark:bg-[#1A2332] text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4 font-semibold">{isRTL ? "رقم الطلب والتاريخ" : "Order ID & Date"}</th>
                  <th className="p-4 font-semibold">{isRTL ? "العميل والهاتف" : "Customer & Phone"}</th>
                  <th className="p-4 font-semibold">{isRTL ? "نوع الطلب" : "Order Type"}</th>
                  <th className="p-4 font-semibold">{isRTL ? "التفاصيل والمنتجات / الـ 3D" : "Details & Products"}</th>
                  <th className="p-4 font-semibold">{isRTL ? "المبلغ الإجمالي" : "Total Amount"}</th>
                  <th className="p-4 font-semibold">{isRTL ? "الحالة" : "Status"}</th>
                  <th className="p-4 font-semibold text-center">{isRTL ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {filteredOrders.map(order => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
                  const StatusIcon = statusInfo.icon;
                  const is3D = order.type === '3d_custom' || order.status === 'Pending Quote';
                  const isPaid = order.paymentStatus === 'Paid' || order.paymentStatus === 'تم تأكيد الدفع';

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-[#16202E] transition-colors">
                      {/* Order ID & Date */}
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white text-sm font-mono">{order.id}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5 font-mono">{order.date}</div>
                      </td>

                      {/* Customer Info */}
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white">{order.customer?.name || (isRTL ? 'عميل زائر' : 'Guest Customer')}</div>
                        {order.customer?.phone && (
                          <a href={`tel:${order.customer.phone}`} className="text-gray-500 dark:text-gray-400 text-[11px] flex items-center gap-1 mt-0.5 font-mono hover:text-[#FF1F3D]">
                            <Phone className="w-3 h-3 text-[#FF1F3D]" />
                            {order.customer.phone}
                          </a>
                        )}
                      </td>

                      {/* Type Badge */}
                      <td className="p-4">
                        {is3D ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FF1F3D]/15 text-[#FF1F3D] border border-[#FF1F3D]/30">
                            <Printer className="w-3 h-3" />
                            {isRTL ? "طلب تسعير 3D" : "3D Quote"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Package className="w-3 h-3" />
                            {isRTL ? "طلب منتجات" : "Products Order"}
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
                                className="inline-flex items-center gap-1 text-xs text-[#FF1F3D] hover:underline font-semibold block"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {isRTL ? "فتح رابط MakerWorld" : "MakerWorld URL"}
                              </a>
                            )}
                            {(order.customData?.fileUrl || (order.customData?.uploadedFiles && order.customData.uploadedFiles.length > 0)) && (
                              <div className="flex flex-col gap-1">
                                {(order.customData.uploadedFiles || [order.customData.fileUrl]).map((file, idx) => (
                                  <a
                                    key={idx}
                                    href={file}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                                  >
                                    <Download className="w-3 h-3" />
                                    {isRTL ? `تحميل ملف الـ 3D #${idx + 1}` : `Download 3D File #${idx + 1}`}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-600 dark:text-gray-300 line-clamp-2">
                            {order.items?.map(i => `${i.name} (x${i.quantity || 1})`).join(' ، ')}
                          </div>
                        )}
                      </td>

                      {/* Total Price & Payment Status */}
                      <td className="p-4">
                        <div className="font-extrabold text-sm text-[#FF1F3D]">
                          {order.total ? `${order.total} ${currencyText}` : (isRTL ? 'بانتظار التسعير ⏳' : 'Pending Quote ⏳')}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{order.paymentMethod}</div>
                        <div className="mt-1">
                          {isPaid ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30">
                              {isRTL ? "تم تأكيد الدفع ✓" : "Paid ✓"}
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              {isRTL ? "لم يتم التأكد ⏳" : "Pending ⏳"}
                            </span>
                          )}
                        </div>
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
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{order.status === 'Pending Quote' || !order.total ? (isRTL ? 'تحديد السعر 💰' : 'Set Price') : (isRTL ? 'عرض التفاصيل' : 'Details')}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 bg-gray-100 dark:bg-[#1A2332] hover:bg-red-600 text-gray-600 dark:text-gray-400 hover:text-white rounded-xl text-xs transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 🔍 Order Detail & Quote Approval Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 text-gray-900 dark:text-white ${isRTL ? 'dir-rtl' : 'dir-ltr'} relative shadow-2xl`}>
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute left-5 top-5 p-2 rounded-full bg-gray-100 dark:bg-[#1A2332] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? "تفاصيل الطلب الكاملة وتحديد السعر" : "Full Order Details & Pricing"}</div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mt-1">
                <Package className="w-6 h-6 text-[#FF1F3D]" />
                <span>{selectedOrder.id}</span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({selectedOrder.date})</span>
              </h2>
            </div>

            {/* Customer & Shipping Section */}
            <div className="bg-gray-50 dark:bg-[#1A2332] rounded-2xl p-4 space-y-3 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xs font-bold text-[#FF1F3D] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {isRTL ? "بيانات العمـيل والشحـن" : "Customer & Shipping Info"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">{isRTL ? "الاسم: " : "Name: "}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.customer?.name || (isRTL ? 'غير محدد' : 'N/A')}</span>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400">{isRTL ? "رقم الهاتف: " : "Phone: "}</span>
                  {selectedOrder.customer?.phone ? (
                    <a href={`tel:${selectedOrder.customer.phone}`} className="font-mono text-[#FF1F3D] font-bold hover:underline">
                      {selectedOrder.customer.phone}
                    </a>
                  ) : (
                    <span className="font-mono text-gray-900 dark:text-white">{isRTL ? 'غير مسجل' : 'N/A'}</span>
                  )}
                </div>

                {/* WhatsApp Contact Field (Request 3) */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">{isRTL ? "رقم الواتساب للتواصل: " : "WhatsApp Number: "}</span>
                  {(selectedOrder.customer?.whatsapp || selectedOrder.customer?.phone) ? (
                    <a
                      href={`https://wa.me/${String(selectedOrder.customer?.whatsapp || selectedOrder.customer?.phone).replace(/[^0-9]/g, '').replace(/^0/, '20')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg"
                    >
                      <span>💬 {selectedOrder.customer?.whatsapp || selectedOrder.customer?.phone} ({isRTL ? "مراسلة مباشرة على الواتس" : "Direct WhatsApp Chat"})</span>
                    </a>
                  ) : (
                    <span className="font-mono text-gray-900 dark:text-white">{isRTL ? 'غير مسجل' : 'N/A'}</span>
                  )}
                </div>

                <div className="md:col-span-2">
                  <span className="text-gray-500 dark:text-gray-400">{isRTL ? "عنوان التسليم: " : "Delivery Address: "}</span>
                  <span className="text-gray-800 dark:text-white">{selectedOrder.customer?.address || (isRTL ? 'غير مدخل' : 'N/A')}</span>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400">{isRTL ? "طريقة الدفع: " : "Payment Method: "}</span>
                  <span className="text-amber-600 dark:text-yellow-400 font-bold">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Shipping Notice Box for Order (Request 4) */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-700 dark:text-amber-300 font-bold leading-relaxed space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <Truck size={14} className="shrink-0" />
                  <span>{isRTL ? "تنبيه مصاريف الشحن:" : "Shipping Fee Notice:"}</span>
                </div>
                <p>
                  {isRTL
                    ? "سيتم التواصل مع العميل لإبلاغه بتفاصيل مصاريف الشحن، والمبلغ المكتوب في الطلب يمثل تكلفة المنتجات فقط غير شاملة لمصاريف الشحن."
                    : "Customer will be contacted regarding shipping fee details. The written order total is for products only and excludes shipping fees."}
                </p>
              </div>

              {selectedOrder.transferReceipt && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{isRTL ? "إيصال التحويل المرفق من العميل:" : "Attached Transfer Receipt:"}</span>
                  </div>
                  <a href={selectedOrder.transferReceipt} target="_blank" rel="noreferrer" className="block border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:opacity-95 transition-opacity max-w-sm">
                    <img src={selectedOrder.transferReceipt} alt="Receipt" className="w-full max-h-64 object-contain bg-black/5 dark:bg-black/40 p-2" />
                  </a>
                </div>
              )}
            </div>

            {/* 💳 Payment Verification Control Box */}
            <div className="bg-white dark:bg-[#121923] p-4 rounded-2xl border-2 border-amber-500/30 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#FF1F3D]" />
                    <span>{isRTL ? "تأكيد حالة التحويل والدفع:" : "Confirm Payment Status:"}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {isRTL ? "(وقت التأكد للعميل: من 2 إلى 5 ساعات عمل)" : "(Customer SLA: 2 to 5 business hours)"}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                  (selectedOrder.paymentStatus === 'Paid' || selectedOrder.paymentStatus === 'تم تأكيد الدفع')
                    ? 'bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                }`}>
                  {(selectedOrder.paymentStatus === 'Paid' || selectedOrder.paymentStatus === 'تم تأكيد الدفع')
                    ? (isRTL ? 'تم تأكيد الدفع ✓' : 'Payment Confirmed ✓')
                    : (isRTL ? 'لم يتم التأكد من التحويل ⏳' : 'Payment Pending ⏳')}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handlePaymentStatusChange(selectedOrder.id, 'Paid')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    (selectedOrder.paymentStatus === 'Paid' || selectedOrder.paymentStatus === 'تم تأكيد الدفع')
                      ? 'bg-green-600 text-white shadow-md font-extrabold ring-2 ring-green-400'
                      : 'bg-gray-100 dark:bg-[#1A2332] text-gray-700 dark:text-gray-300 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>{isRTL ? "تم تأكيد الدفع" : "Confirm Payment"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentStatusChange(selectedOrder.id, 'Pending')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    (selectedOrder.paymentStatus !== 'Paid' && selectedOrder.paymentStatus !== 'تم تأكيد الدفع')
                      ? 'bg-amber-600 text-white shadow-md font-extrabold ring-2 ring-amber-400'
                      : 'bg-gray-100 dark:bg-[#1A2332] text-gray-700 dark:text-gray-300 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  <Clock size={16} />
                  <span>{isRTL ? "لم يتم التأكد من التحويل" : "Mark Pending"}</span>
                </button>
              </div>
            </div>

            {/* 3D Custom Quote Details if applicable */}
            {selectedOrder.customData && (
              <div className="bg-red-50/40 dark:bg-gradient-to-br dark:from-[#1F1722] dark:to-[#16202E] border border-[#FF1F3D]/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Printer className="w-5 h-5 text-[#FF1F3D]" />
                    <span>{isRTL ? "طلب تسعير مجسم 3D مخصص" : "Custom 3D Print Quote Details"}</span>
                  </h3>
                  {selectedOrder.customData?.url && (
                    <a
                      href={selectedOrder.customData.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#FF1F3D] text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#D91832] transition-all shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isRTL ? "فتح موديل MakerWorld" : "MakerWorld Model"}</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-[#121923]/80 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-gray-500 dark:text-gray-400 text-[11px]">{isRTL ? "أبعاد الموديل المطلوب (Mask Dimensions):" : "Mask Dimensions:"}</div>
                    <div className="text-gray-900 dark:text-white font-mono font-bold mt-1">
                      {selectedOrder.customData?.mask || (isRTL ? 'تلقائي حسب الرابط' : 'Default / From URL')}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#121923]/80 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="text-gray-500 dark:text-gray-400 text-[11px]">{isRTL ? "نوع الخامة (Filament):" : "Filament Material:"}</div>
                    <div className="text-gray-900 dark:text-white font-bold mt-1">
                      {selectedOrder.customData?.filament || 'PLA Plus High Toughness'}
                    </div>
                  </div>
                </div>

                {selectedOrder.customData?.notes && (
                  <div className="bg-white dark:bg-[#121923]/80 p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-xs">
                    <div className="text-gray-500 dark:text-gray-400 text-[11px] mb-1">{isRTL ? "ملاحظات العميل:" : "Customer Notes:"}</div>
                    <div className="text-gray-800 dark:text-gray-200">{selectedOrder.customData.notes}</div>
                  </div>
                )}
              </div>
            )}

            {/* 🎯 Prominent Price Quote Input Form */}
            <div className="bg-white dark:bg-[#121923] p-5 rounded-2xl border-2 border-[#FF1F3D] space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#FF1F3D]" />
                  <span>{isRTL ? "تحديد واعتماد سعر الطلب بعد الاتفاق مع العميل (ج.م):" : "Approve & Set Final Order Price:"}</span>
                </label>
                {selectedOrder.total > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{isRTL ? `السعر الحالي: ${selectedOrder.total} ج.م` : `Current Price: ${selectedOrder.total} EGP`}</span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="number"
                  placeholder={isRTL ? "أدخل السعر المتفق عليه هنا (مثال: 450)" : "Enter agreed price (e.g. 450)"}
                  value={quotePriceInput}
                  onChange={(e) => setQuotePriceInput(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white font-bold placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                />
                <button
                  onClick={() => handleApproveQuote(selectedOrder.id)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-[#FF1F3D]/20 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <CheckCircle2 size={16} />
                  <span>{isRTL ? "اعتماد السعر وتأكيد الطلب" : "Approve & Confirm"}</span>
                </button>
              </div>
            </div>

            {/* Standard Order Items List / Table */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300">{isRTL ? "محتويات الشحنة والمنتجات:" : "Order Items & Details:"}</h3>
                
                {/* Mobile Cards View (< sm) */}
                <div className="sm:hidden space-y-2.5">
                  {selectedOrder.items.map((item, idx) => {
                    const hasMaskDimensions = (
                      item.maskHeight ||
                      item.circularWidth ||
                      item.faceHeight ||
                      item.faceWidth ||
                      item.size ||
                      item.dimensions
                    );
                    const itemColor = item.color || item.selectedColor;

                    return (
                      <div key={idx} className="bg-gray-50 dark:bg-[#1A2332] p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
                        <div className="font-bold text-gray-900 dark:text-white text-sm">
                          {item.name}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {itemColor && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-[#FF1F3D] dark:text-red-400 text-[11px] font-bold">
                              <span>🎨 {isRTL ? "اللون:" : "Color:"}</span>
                              <span>{itemColor}</span>
                            </div>
                          )}
                          {hasMaskDimensions && (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                              <span>🎭 {isRTL ? "مقاسات الماسك:" : "Mask Dimensions:"}</span>
                              <span>
                                {(item.maskHeight || item.faceHeight) ? `${isRTL ? "الارتفاع:" : "H:"} ${item.maskHeight || item.faceHeight} cm` : ''}
                                {(item.maskHeight || item.faceHeight) && (item.circularWidth || item.faceWidth) ? ' | ' : ''}
                                {(item.circularWidth || item.faceWidth) ? `${isRTL ? "عرض/محيط الوجه:" : "W:"} ${item.circularWidth || item.faceWidth} cm` : ''}
                                {item.size && !(item.maskHeight || item.faceHeight) ? item.size : ''}
                                {item.dimensions && !(item.maskHeight || item.faceHeight) ? item.dimensions : ''}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Quantity and Prices */}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-800/60 flex items-center justify-between text-gray-600 dark:text-gray-400">
                          <div>
                            <span>{isRTL ? "الكمية:" : "Qty:"} <strong className="text-gray-900 dark:text-white font-mono">{item.quantity || 1}</strong></span>
                            <span className="mx-2">•</span>
                            <span>{item.price} {currencyText}</span>
                          </div>
                          <div className="font-bold text-[#FF1F3D] text-xs">
                            {(item.price * (item.quantity || 1)).toLocaleString()} {currencyText}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table View (>= sm) */}
                <div className="hidden sm:block bg-gray-50 dark:bg-[#1A2332] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} text-xs`}>
                    <thead className="bg-gray-100 dark:bg-[#121923] text-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        <th className="p-3">{isRTL ? "اسم المنتج" : "Item Name"}</th>
                        <th className="p-3">{isRTL ? "الكمية" : "Qty"}</th>
                        <th className="p-3">{isRTL ? "السعر الفردي" : "Unit Price"}</th>
                        <th className="p-3">{isRTL ? "المجموع" : "Subtotal"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-800 dark:text-gray-300">
                      {selectedOrder.items.map((item, idx) => {
                        const hasMaskDimensions = (
                          item.maskHeight ||
                          item.circularWidth ||
                          item.faceHeight ||
                          item.faceWidth ||
                          item.size ||
                          item.dimensions
                        );
                        const itemColor = item.color || item.selectedColor;

                        return (
                          <tr key={idx}>
                            <td className="p-3 font-semibold text-gray-900 dark:text-white">
                              <div>{item.name}</div>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {itemColor && (
                                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-[#FF1F3D] dark:text-red-400 text-[11px] font-bold">
                                    <span>🎨 {isRTL ? "اللون:" : "Color:"}</span>
                                    <span>{itemColor}</span>
                                  </div>
                                )}
                                {hasMaskDimensions && (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                                    <span>🎭 {isRTL ? "مقاسات الماسك:" : "Mask Dimensions:"}</span>
                                    <span>
                                      {(item.maskHeight || item.faceHeight) ? `${isRTL ? "الارتفاع:" : "H:"} ${item.maskHeight || item.faceHeight} cm` : ''}
                                      {(item.maskHeight || item.faceHeight) && (item.circularWidth || item.faceWidth) ? ' | ' : ''}
                                      {(item.circularWidth || item.faceWidth) ? `${isRTL ? "عرض/محيط الوجه:" : "W:"} ${item.circularWidth || item.faceWidth} cm` : ''}
                                      {item.size && !(item.maskHeight || item.faceHeight) ? item.size : ''}
                                      {item.dimensions && !(item.maskHeight || item.faceHeight) ? item.dimensions : ''}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3 font-mono">{item.quantity || 1}</td>
                            <td className="p-3">{item.price} {currencyText}</td>
                            <td className="p-3 font-bold text-[#FF1F3D]">
                              {(item.price * (item.quantity || 1)).toLocaleString()} {currencyText}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Status Change Selector */}
            <div className="bg-gray-50 dark:bg-[#1A2332] rounded-2xl p-4 border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? "تحديث حالة الشحنة مباشرة:" : "Update Order Status:"}</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{isRTL ? `الحالة الحالية: ${selectedOrder.status}` : `Current Status: ${selectedOrder.status}`}</div>
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
