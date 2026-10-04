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
  Download,
  Upload,
  Plus,
  SlidersHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight
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
      label: isRTL ? 'طلب سعر 3D' : 'Pending Quote',
      bg: 'rgba(249, 115, 22, 0.15)',
      color: '#F97316',
      icon: Clock
    },
    'Pending': {
      label: isRTL ? 'قيد الانتظار' : 'Pending',
      bg: 'rgba(249, 115, 22, 0.15)',
      color: '#F97316',
      icon: Clock
    },
    'Processing': {
      label: isRTL ? 'جاري التجهيز' : 'Processing',
      bg: 'rgba(59, 130, 246, 0.15)',
      color: '#3B82F6',
      icon: Package
    },
    'Shipped': {
      label: isRTL ? 'تم الشحن' : 'Shipped',
      bg: 'rgba(168, 85, 247, 0.15)',
      color: '#A855F7',
      icon: Truck
    },
    'Delivered': {
      label: isRTL ? 'مكتمل' : 'Fulfilled',
      bg: 'rgba(34, 197, 94, 0.15)',
      color: '#22C55E',
      icon: CheckCircle2
    },
    'Fulfilled': {
      label: isRTL ? 'مكتمل' : 'Fulfilled',
      bg: 'rgba(34, 197, 94, 0.15)',
      color: '#22C55E',
      icon: CheckCircle2
    },
    'Cancelled': {
      label: isRTL ? 'ملغي' : 'Cancelled',
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#EF4444',
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
    setOrders(data || []);
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
      (o.customer?.phone || '').includes(search) ||
      (o.items || []).some(i => i.name.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterTab === 'all') return true;
    if (filterTab === 'fulfilled' || filterTab === 'delivered') return o.status === 'Delivered' || o.status === 'Fulfilled';
    if (filterTab === 'processing') return o.status === 'Processing';
    if (filterTab === 'shipped') return o.status === 'Shipped';
    if (filterTab === 'pending') return o.status === 'Pending' || o.status === 'Pending Quote';
    if (filterTab === 'cancelled') return o.status === 'Cancelled';
    return true;
  });

  // Calculate counts
  const fulfilledCount = orders.filter(o => o.status === 'Delivered' || o.status === 'Fulfilled').length;
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const pendingCount = orders.filter(o => o.status === 'Pending' || o.status === 'Pending Quote').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  return (
    <div className={`p-4 md:p-6 space-y-6 text-gray-900 dark:text-white min-h-screen bg-gray-50 dark:bg-[#07090e] ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      
      {/* ── 1. Top Header Row (Matches Image Layout) ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {isRTL ? 'الطلبات' : 'Orders'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isRTL ? 'إدارة ومتابعة طلبات العملاء والطلبات المخصصة' : 'Manage and track all customer orders'}
          </p>
        </div>

        {/* Right Actions & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isRTL ? "بحث برقم الطلب، العميل أو المنتج..." : "Search orders by ID, customer or product..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-[#0f141d] border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={() => toast.success(isRTL ? 'جاري تصدير الطلبات...' : 'Exporting orders...')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#0f141d] hover:bg-gray-100 dark:hover:bg-[#161d2a] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-800 dark:text-white transition-all cursor-pointer shadow-xs"
          >
            <Upload size={14} />
            <span>{isRTL ? 'تصدير' : 'Export'}</span>
          </button>

          {/* + New Order Button */}
          <button
            onClick={() => navigate('/custom-order')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-[#FF1F3D]/20 active:scale-95"
          >
            <Plus size={15} />
            <span>{isRTL ? '+ طلب جديد' : '+ New Order'}</span>
          </button>

          {/* View Switcher Button */}
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            className="p-2 bg-white dark:bg-[#0f141d] hover:bg-gray-100 dark:hover:bg-[#161d2a] border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-white transition-all cursor-pointer shadow-xs"
            title={viewMode === 'cards' ? 'Switch to Table' : 'Switch to Cards'}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* ── 2. Status Filter Pills Bar (Exact Image Design) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0d121b] p-2.5 sm:p-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* ALL Tab */}
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              filterTab === 'all'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-gray-100 dark:bg-[#151c28] text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span>{isRTL ? 'الكل' : 'All'}</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${filterTab === 'all' ? 'bg-white/20 dark:bg-black/20' : 'bg-gray-200 dark:bg-white/10'}`}>
              {orders.length}
            </span>
          </button>

          {/* FULFILLED Tab */}
          <button
            onClick={() => setFilterTab('fulfilled')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              filterTab === 'fulfilled'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-gray-100 dark:bg-[#151c28] text-gray-700 dark:text-gray-400 hover:text-emerald-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isRTL ? 'مكتمل' : 'Fulfilled'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono">
              {fulfilledCount}
            </span>
          </button>

          {/* PROCESSING Tab */}
          <button
            onClick={() => setFilterTab('processing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              filterTab === 'processing'
                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40 shadow-sm'
                : 'bg-gray-100 dark:bg-[#151c28] text-gray-700 dark:text-gray-400 hover:text-blue-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{isRTL ? 'جاري التجهيز' : 'Processing'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-mono">
              {processingCount}
            </span>
          </button>

          {/* SHIPPED Tab */}
          <button
            onClick={() => setFilterTab('shipped')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              filterTab === 'shipped'
                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40 shadow-sm'
                : 'bg-gray-100 dark:bg-[#151c28] text-gray-700 dark:text-gray-400 hover:text-purple-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>{isRTL ? 'تم الشحن' : 'Shipped'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-mono">
              {shippedCount}
            </span>
          </button>

          {/* PENDING Tab */}
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              filterTab === 'pending'
                ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/40 shadow-sm'
                : 'bg-gray-100 dark:bg-[#151c28] text-gray-700 dark:text-gray-400 hover:text-orange-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>{isRTL ? 'قيد الانتظار' : 'Pending'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-mono">
              {pendingCount}
            </span>
          </button>

          {/* CANCELLED Tab */}
          <button
            onClick={() => setFilterTab('cancelled')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              filterTab === 'cancelled'
                ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40 shadow-sm'
                : 'bg-gray-100 dark:bg-[#151c28] text-gray-700 dark:text-gray-400 hover:text-red-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>{isRTL ? 'ملغي' : 'Cancelled'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-mono">
              {cancelledCount}
            </span>
          </button>

        </div>

        {/* Filters Quick Action */}
        <button
          onClick={() => setSearch('')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#151c28] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <Filter size={13} />
          <span>{isRTL ? 'الفلاتر' : 'Filters'}</span>
        </button>
      </div>

      {/* ── 3. Orders List (Exact Image Row Cards) ── */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#0d121b] border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center text-gray-500 dark:text-gray-400 space-y-3 shadow-xs">
          <Package className="w-12 h-12 text-gray-400 mx-auto opacity-50" />
          <p className="text-sm font-bold">
            {isRTL ? "لا يوجد طلبات مطابقة للبحث أو الفلتر المحدد" : "No orders found matching your search or filter criteria."}
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="space-y-3.5">
          {filteredOrders.map((order) => {
            const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
            const StatusIcon = statusInfo.icon;
            const is3D = order.type === '3d_custom' || order.status === 'Pending Quote';
            const isPaid = order.paymentStatus === 'Paid' || order.paymentStatus === 'تم تأكيد الدفع';

            const formattedTime = order.time || '10:45 AM';
            const formattedDate = order.date || 'May 25, 2026';
            const customerName = order.customer?.name || (isRTL ? 'عميل زائر' : 'Guest Customer');
            const customerEmail = order.customer?.email || order.customer?.phone || 'customer@example.com';
            const itemsCount = order.items?.length || 1;
            const itemsSummary = order.items
              ? order.items.map(i => i.name).join(', ')
              : (isRTL ? 'طلب تسعير مجسم 3D' : 'Custom 3D Print Model');

            return (
              <div
                key={order.id}
                className="relative bg-white dark:bg-[#0d121b] border border-gray-200 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-md overflow-hidden flex flex-col gap-3 group hover:border-[#FF1F3D]/40 transition-all duration-300"
              >
                {/* Left Status Color Vertical Accent Bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: statusInfo.color }}
                />

                {/* ── TOP TIER: Order ID & Date (Left) + Total Amount (Right) ── */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-2.5 pl-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm sm:text-base text-gray-900 dark:text-white tracking-wide">
                      {order.id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(order.id, 'رقم الطلب')}
                      className="p-0.5 text-gray-400 hover:text-white transition-colors"
                      title="Copy Order ID"
                    >
                      <Copy size={12} />
                    </button>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono hidden sm:inline">
                      • {formattedDate}
                    </span>
                  </div>

                  {/* Price (Top Right) */}
                  <div className="font-black text-sm sm:text-base text-gray-900 dark:text-white font-mono">
                    {order.total ? `${Number(order.total).toLocaleString('en-US')} ${currencyText}` : (isRTL ? 'بانتظار التسعير' : 'Quote Pending')}
                  </div>
                </div>

                {/* ── MIDDLE TIER: Product Image Thumbnails + Items Summary (Left) & Status Badge + Method (Right) ── */}
                <div className="flex items-center justify-between gap-3 pl-2.5">
                  
                  {/* Left: Product Image Thumbnails & Summary */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="flex items-center -space-x-1.5 shrink-0">
                      {order.items && order.items.length > 0 ? (
                        order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 dark:bg-[#1a2332] border border-gray-200 dark:border-white/15 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-xs">
                            <img src={item.image || item.img} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          </div>
                        ))
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 dark:bg-[#1a2332] border border-gray-200 dark:border-white/15 flex items-center justify-center text-gray-400">
                          <Package size={16} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="font-black text-xs text-gray-900 dark:text-white truncate">
                        {order.items ? `${itemsCount} ${isRTL ? 'منتجات' : 'Items'}` : (isRTL ? 'طلب 3D مخصص' : '3D Custom Quote')}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[110px] sm:max-w-[200px]">
                        {itemsSummary}
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1a2332] hover:bg-gray-200 dark:hover:bg-[#253246] px-2 py-0.5 rounded-md transition-colors inline-block border border-gray-200 dark:border-white/10 cursor-pointer"
                      >
                        {isRTL ? 'عرض العناصر' : 'View Items'}
                      </button>
                    </div>
                  </div>

                  {/* Right: Status Badge & Payment Method Dropdown */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="appearance-none px-2.5 py-1 pr-6 rounded-xl text-[11px] font-extrabold cursor-pointer border focus:outline-none transition-all shadow-xs"
                        style={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                          borderColor: statusInfo.color + '50'
                        }}
                      >
                        <option value="Pending">{isRTL ? 'قيد الانتظار' : 'Pending'}</option>
                        <option value="Processing">{isRTL ? 'جاري التجهيز' : 'Processing'}</option>
                        <option value="Shipped">{isRTL ? 'تم الشحن' : 'Shipped'}</option>
                        <option value="Delivered">{isRTL ? 'مكتمل' : 'Fulfilled'}</option>
                        <option value="Fulfilled">{isRTL ? 'مكتمل' : 'Fulfilled'}</option>
                        <option value="Cancelled">{isRTL ? 'ملغي' : 'Cancelled'}</option>
                      </select>
                    </div>

                    <select
                      value={order.paymentStatus || 'Pending'}
                      onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                      className="appearance-none px-2 py-0.5 text-[10px] font-extrabold rounded-lg bg-gray-100 dark:bg-[#161d28] text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-white/10 focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">{isRTL ? 'لم يتم الدفع ⏳' : 'Via Pending ⏳'}</option>
                      <option value="Paid">{isRTL ? 'تم الدفع ✓' : 'Via InstaPay ✓'}</option>
                    </select>
                  </div>

                </div>

                {/* ── BOTTOM TIER: Customer Info (Left) & Actions (Right) ── */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10 text-xs pl-2.5">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#1a2332] flex items-center justify-center text-xs font-bold text-gray-800 dark:text-white shrink-0 overflow-hidden">
                      {order.customer?.avatar ? (
                        <img src={order.customer.avatar} alt={customerName} className="w-full h-full object-cover" />
                      ) : (
                        <User size={12} className="text-gray-400" />
                      )}
                    </div>
                    <span className="font-extrabold text-gray-800 dark:text-gray-200 text-xs truncate max-w-[130px] sm:max-w-[200px]">
                      {customerName}
                    </span>
                    {order.customer?.phone && (
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title={order.customer.phone}
                      >
                        <Phone size={12} />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setQuotePriceInput(order.total ? String(order.total) : '');
                      }}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-[#161d28] hover:bg-gray-200 dark:hover:bg-[#202b3c] text-gray-900 dark:text-white text-[11px] font-extrabold rounded-lg border border-gray-200 dark:border-white/10 transition-colors shadow-xs cursor-pointer"
                    >
                      {isRTL ? 'التفاصيل' : 'View Details'}
                    </button>

                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title={isRTL ? 'حذف' : 'Delete'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#0d121b] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
              <thead>
                <tr className="bg-gray-100 dark:bg-[#151c28] text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-white/10 font-bold">
                  <th className="p-4">{isRTL ? "رقم الطلب والتاريخ" : "Order ID & Date"}</th>
                  <th className="p-4">{isRTL ? "العميل والهاتف" : "Customer & Phone"}</th>
                  <th className="p-4">{isRTL ? "نوع الطلب" : "Order Type"}</th>
                  <th className="p-4">{isRTL ? "التفاصيل والمنتجات" : "Details & Products"}</th>
                  <th className="p-4">{isRTL ? "المبلغ الإجمالي" : "Total Amount"}</th>
                  <th className="p-4">{isRTL ? "الحالة" : "Status"}</th>
                  <th className="p-4 text-center">{isRTL ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredOrders.map(order => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
                  const StatusIcon = statusInfo.icon;
                  const is3D = order.type === '3d_custom' || order.status === 'Pending Quote';
                  const isPaid = order.paymentStatus === 'Paid' || order.paymentStatus === 'تم تأكيد الدفع';

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-[#141b27] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white text-sm font-mono">{order.id}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5 font-mono">{order.date}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white">{order.customer?.name || (isRTL ? 'عميل زائر' : 'Guest Customer')}</div>
                        {order.customer?.phone && (
                          <a href={`tel:${order.customer.phone}`} className="text-gray-500 dark:text-gray-400 text-[11px] flex items-center gap-1 mt-0.5 font-mono hover:text-[#FF1F3D]">
                            <Phone className="w-3 h-3 text-[#FF1F3D]" />
                            {order.customer.phone}
                          </a>
                        )}
                      </td>

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
                          </div>
                        ) : (
                          <div className="text-gray-600 dark:text-gray-300 line-clamp-2 font-medium">
                            {order.items?.map(i => `${i.name} (x${i.quantity || 1})`).join(' ، ')}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-sm text-[#FF1F3D]">
                          {order.total ? `${Number(order.total).toLocaleString('en-US')} ${currencyText}` : (isRTL ? 'بانتظار التسعير ⏳' : 'Pending Quote ⏳')}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                          style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setQuotePriceInput(order.total ? String(order.total) : '');
                          }}
                          className="px-3 py-1.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'التفاصيل' : 'Details'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 4. Footer Pagination Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
        <div>
          {isRTL
            ? `عرض 1 إلى ${filteredOrders.length} من إجمالي ${orders.length} طلب`
            : `Showing 1 to ${filteredOrders.length} of ${orders.length} orders`}
        </div>

        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded-xl bg-white dark:bg-[#0d121b] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-white transition-colors disabled:opacity-40">
            <ChevronLeft size={15} />
          </button>
          <button className="px-3 py-1.5 rounded-xl bg-[#FF1F3D] text-white font-extrabold text-xs shadow-sm">
            1
          </button>
          <button className="p-2 rounded-xl bg-white dark:bg-[#0d121b] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-white transition-colors disabled:opacity-40">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 5. Order Details & 3D Quote Approval Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-[#0d121b] border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 text-gray-900 dark:text-white ${isRTL ? 'dir-rtl' : 'dir-ltr'} relative shadow-2xl`}>
            
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute left-5 top-5 p-2 rounded-full bg-gray-100 dark:bg-[#161d28] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-gray-200 dark:border-white/10 pb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {isRTL ? "تفاصيل الطلب الكاملة وتأكيد التسعير" : "Full Order Details & Pricing"}
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mt-1">
                <Package className="w-6 h-6 text-[#FF1F3D]" />
                <span>{selectedOrder.id}</span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 font-mono">({selectedOrder.date})</span>
              </h2>
            </div>

            {/* Customer & Shipping Section */}
            <div className="bg-gray-50 dark:bg-[#131924] rounded-2xl p-4 space-y-3 border border-gray-200 dark:border-white/10">
              <h3 className="text-xs font-bold text-[#FF1F3D] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {isRTL ? "بيانات العمـيل والشحـن" : "Customer & Shipping Info"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">{isRTL ? "الاسم: " : "Name: "}</span>
                  <span className="font-extrabold text-gray-900 dark:text-white">{selectedOrder.customer?.name || (isRTL ? 'غير محدد' : 'N/A')}</span>
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

                {/* WhatsApp Direct Link */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">{isRTL ? "رقم الواتساب للتواصل: " : "WhatsApp Number: "}</span>
                  {(selectedOrder.customer?.whatsapp || selectedOrder.customer?.phone) ? (
                    <a
                      href={`https://wa.me/${String(selectedOrder.customer?.whatsapp || selectedOrder.customer?.phone).replace(/[^0-9]/g, '').replace(/^0/, '20')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg"
                    >
                      <span>💬 {selectedOrder.customer?.whatsapp || selectedOrder.customer?.phone} ({isRTL ? "مراسلة ميكسو على الواتس" : "Direct WhatsApp Chat"})</span>
                    </a>
                  ) : (
                    <span className="font-mono text-gray-900 dark:text-white">{isRTL ? 'غير مسجل' : 'N/A'}</span>
                  )}
                </div>

                <div className="md:col-span-2">
                  <span className="text-gray-500 dark:text-gray-400">{isRTL ? "عنوان التسليم: " : "Delivery Address: "}</span>
                  <span className="text-gray-800 dark:text-white font-semibold">{selectedOrder.customer?.address || (isRTL ? 'غير مدخل' : 'N/A')}</span>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400">{isRTL ? "طريقة الدفع: " : "Payment Method: "}</span>
                  <span className="text-amber-600 dark:text-yellow-400 font-bold">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Shipping Notice Box */}
              <div className="p-3 bg-white dark:bg-[#0d121b] border border-gray-200 dark:border-white/10 rounded-xl text-[11px] text-gray-900 dark:text-white font-bold leading-relaxed space-y-0.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-extrabold">
                  <Truck size={14} className="shrink-0 text-[#FF1F3D]" />
                  <span>{isRTL ? "تنبيه مصاريف الشحن:" : "Shipping Fee Notice:"}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 font-semibold">
                  {isRTL
                    ? "سيتم التواصل مع العميل لإبلاغه بتفاصيل مصاريف الشحن، والمبلغ المكتوب في الطلب يمثل تكلفة المنتجات فقط غير شاملة لمصاريف الشحن."
                    : "Customer will be contacted regarding shipping fee details. The written order total is for products only and excludes shipping fees."}
                </p>
              </div>

              {selectedOrder.transferReceipt && (
                <div className="pt-2 border-t border-gray-200 dark:border-white/10 space-y-2">
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{isRTL ? "إيصال التحويل المرفق من العميل:" : "Attached Transfer Receipt:"}</span>
                  </div>
                  <a
                    href={selectedOrder.transferReceipt}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 p-2 bg-gray-100 dark:bg-[#161d28] border border-gray-200 dark:border-white/10 rounded-xl hover:opacity-90 transition-opacity max-w-xs group"
                  >
                    <img
                      src={selectedOrder.transferReceipt}
                      alt="Receipt"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-white/10 shrink-0 bg-black/20"
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1 group-hover:text-[#FF1F3D]">
                        <span>{isRTL ? "معاينة الإيصال" : "View Full Receipt"}</span>
                        <ExternalLink size={12} />
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">
                        {isRTL ? "اضغط لفتح الصورة بحجم كامل ↗" : "Click to view full image ↗"}
                      </div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Payment Verification Box */}
            <div className="bg-white dark:bg-[#0d121b] p-4 rounded-2xl border-2 border-amber-500/30 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#FF1F3D]" />
                    <span>{isRTL ? "تأكيد حالة التحويل والدفع:" : "Confirm Payment Status:"}</span>
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
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    (selectedOrder.paymentStatus === 'Paid' || selectedOrder.paymentStatus === 'تم تأكيد الدفع')
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-[#161d28] text-gray-700 dark:text-gray-300 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>{isRTL ? "تم تأكيد الدفع" : "Confirm Payment"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentStatusChange(selectedOrder.id, 'Pending')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    (selectedOrder.paymentStatus !== 'Paid' && selectedOrder.paymentStatus !== 'تم تأكيد الدفع')
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-[#161d28] text-gray-700 dark:text-gray-300 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  <Clock size={16} />
                  <span>{isRTL ? "لم يتم التأكد" : "Mark Pending"}</span>
                </button>
              </div>
            </div>

            {/* 3D Custom Quote Data */}
            {selectedOrder.customData && (
              <div className="bg-red-50/40 dark:bg-gradient-to-br dark:from-[#1A121F] dark:to-[#0F1622] border border-[#FF1F3D]/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <Printer className="w-5 h-5 text-[#FF1F3D]" />
                    <span>{isRTL ? "تفاصيل طلب تسعير 3D المخصص" : "Custom 3D Quote Details"}</span>
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
                  <div className="bg-white dark:bg-[#0d121b] p-3 rounded-xl border border-gray-200 dark:border-white/10">
                    <div className="text-gray-500 dark:text-gray-400 text-[11px]">{isRTL ? "أبعاد الموديل (Mask Dimensions):" : "Mask Dimensions:"}</div>
                    <div className="text-gray-900 dark:text-white font-mono font-bold mt-1">
                      {selectedOrder.customData?.mask || (isRTL ? 'تلقائي حسب الرابط' : 'Default / From URL')}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#0d121b] p-3 rounded-xl border border-gray-200 dark:border-white/10">
                    <div className="text-gray-500 dark:text-gray-400 text-[11px]">{isRTL ? "نوع الخامة (Filament):" : "Filament Material:"}</div>
                    <div className="text-gray-900 dark:text-white font-bold mt-1">
                      {selectedOrder.customData?.filament || 'PLA Plus High Toughness'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Set Price Input Box */}
            <div className="bg-white dark:bg-[#0d121b] p-5 rounded-2xl border-2 border-[#FF1F3D] space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#FF1F3D]" />
                  <span>{isRTL ? "تحديد واعتماد سعر الطلب (ج.م):" : "Approve & Set Final Order Price:"}</span>
                </label>
                {selectedOrder.total > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{isRTL ? `السعر الحالي: ${selectedOrder.total} ج.م` : `Current Price: ${selectedOrder.total} EGP`}</span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="number"
                  placeholder={isRTL ? "أدخل السعر المتفق عليه (مثال: 450)" : "Enter agreed price (e.g. 450)"}
                  value={quotePriceInput}
                  onChange={(e) => setQuotePriceInput(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-[#161d28] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white font-bold placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
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

            {/* Standard Order Items Table */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300">{isRTL ? "محتويات الشحنة والمنتجات:" : "Order Items & Details:"}</h3>
                
                <div className="bg-gray-50 dark:bg-[#131924] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                  <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} text-xs`}>
                    <thead className="bg-gray-100 dark:bg-[#0d121b] text-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 font-bold">
                      <tr>
                        <th className="p-3">{isRTL ? "اسم المنتج" : "Item Name"}</th>
                        <th className="p-3">{isRTL ? "الكمية" : "Qty"}</th>
                        <th className="p-3">{isRTL ? "السعر" : "Unit Price"}</th>
                        <th className="p-3">{isRTL ? "المجموع" : "Subtotal"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-gray-800 dark:text-gray-300 font-medium">
                      {selectedOrder.items.map((item, idx) => {
                        const itemImg = item.image || item.img || item.productImage;
                        const itemColor = item.color || item.selectedColor;
                        const hasDimensions = item.maskHeight || item.circularWidth || item.size;

                        return (
                          <tr key={idx}>
                            <td className="p-3 font-semibold text-gray-900 dark:text-white">
                              <div className="flex items-center gap-3">
                                {itemImg ? (
                                  <img
                                    src={itemImg}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0 bg-gray-100 dark:bg-[#161d28] p-0.5"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#161d28] border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0 text-gray-400">
                                    <Package size={20} />
                                  </div>
                                )}
                                <div>
                                  <div className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white">{item.name}</div>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {itemColor && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-[#FF1F3D] text-[10px] font-bold border border-red-500/20">
                                        🎨 {itemColor}
                                      </span>
                                    )}
                                    {hasDimensions && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                                        🎭 {item.maskHeight ? `${item.maskHeight}×${item.circularWidth || ''} cm` : item.size}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-mono font-bold text-gray-900 dark:text-white">{item.quantity || 1}</td>
                            <td className="p-3">{item.price ? `${Number(item.price).toLocaleString()} ${currencyText}` : '-'}</td>
                            <td className="p-3 font-extrabold text-[#FF1F3D]">
                              {item.price ? `${(Number(item.price) * (item.quantity || 1)).toLocaleString()} ${currencyText}` : '-'}
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
            <div className="bg-gray-50 dark:bg-[#131924] rounded-2xl p-4 border border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{isRTL ? "تحديث حالة الشحنة:" : "Update Order Status:"}</div>
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
                        : 'bg-white dark:bg-[#0d121b] text-gray-700 dark:text-gray-300 hover:text-white border border-gray-200 dark:border-white/10'
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
