import { useState, useMemo } from 'react';
import {
  Send,
  Settings,
  Search,
  Calendar,
  Filter,
  RotateCcw,
  Sparkles,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Tag,
  Gift,
  Users,
  ShoppingBag,
  Flame,
  Eye,
  Copy,
  Trash2,
  X,
  Laptop,
} from 'lucide-react';
import { getAdminData } from '../../../services/adminMockData';

const INITIAL_NOTIFICATIONS = [];

export default function Notifications() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('MIXO_admin_notifications');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Tabs & Search & Filters
  const [activeTab, setActiveTab] = useState('All Notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRange, setDateRange] = useState('May 1, 2024 - May 31, 2024');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modals
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [viewingNotif, setViewingNotif] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Send Notification Form State (In-App Only)
  const [sendForm, setSendForm] = useState({
    title: '',
    content: '',
    type: 'Promotion',
    audienceType: 'All Users',
    specificCustomerEmail: 'omar.ahmed@email.com',
    targetProduct: 'MIXO Pharaoh T-Shirt',
    segment: 'New Users',
    governorate: 'Cairo',
    scheduleMode: 'Immediately',
    scheduledDate: '2024-06-01T10:00',
  });

  // Automatic In-App Triggers Settings State
  const [autoTriggers, setAutoTriggers] = useState([
    { id: 'order_created', name: 'Order Created (تم إنشاء الطلب)', enabled: true },
    { id: 'payment_confirmed', name: 'Payment Confirmed (تم تأكيد الدفع)', enabled: true },
    { id: 'payment_failed', name: 'Payment Failed / Rejected (تم رفض الدفع)', enabled: true },
    { id: 'order_processing', name: 'Order Processing (جاري تجهيز الطلب)', enabled: true },
    { id: 'order_shipped', name: 'Order Shipped (تم شحن الطلب)', enabled: true },
    { id: 'out_for_delivery', name: 'Out for Delivery (خرج للتوصيل)', enabled: true },
    { id: 'order_delivered', name: 'Order Delivered (تم التسليم)', enabled: true },
    { id: 'order_cancelled', name: 'Order Cancelled (تم إلغاء الطلب)', enabled: true },
    { id: 'review_approved', name: 'Review Approved (تم قبول التقييم)', enabled: true },
    { id: 'coupon_granted', name: 'New Coupon Granted (حصلت على كوبون جديد)', enabled: true },
  ]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stats Calculations
  const totalSentCount = notifications.length;
  const deliveredCount = useMemo(() => notifications.filter((n) => n.status === 'Sent' || n.status === 'Delivered').length, [notifications]);
  const unreadCount = useMemo(() => notifications.filter((n) => n.status === 'Unread').length, [notifications]);
  const failedCount = useMemo(() => notifications.filter((n) => n.status === 'Failed').length, [notifications]);
  const scheduledCount = useMemo(() => notifications.filter((n) => n.status === 'Scheduled').length, [notifications]);

  // Type badge styling
  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case 'Promotion':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Discount':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Order Update':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Feedback':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Welcome':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Alert':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Announcement':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Occasion':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.audienceDetail.toLowerCase().includes(q);

      const matchesTab =
        activeTab === 'All Notifications' ||
        (activeTab === 'Sent' && n.status === 'Delivered') ||
        (activeTab === 'Scheduled' && n.status === 'Scheduled') ||
        (activeTab === 'Drafts' && n.status === 'Draft') ||
        (activeTab === 'Failed' && n.status === 'Failed');

      const matchesType = typeFilter === 'All Types' || n.type === typeFilter;
      const matchesStatus = statusFilter === 'All Status' || n.status === statusFilter;

      return matchesSearch && matchesTab && matchesType && matchesStatus;
    });
  }, [notifications, searchQuery, activeTab, typeFilter, statusFilter]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage) || 1;
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(start, start + itemsPerPage);
  }, [filteredNotifications, currentPage]);

  // Submit Send Notification
  const handleSendNotification = (e) => {
    e.preventDefault();

    let audienceText = 'All customers';
    if (sendForm.audienceType === 'Specific Customer') {
      audienceText = `Specific user (${sendForm.specificCustomerEmail})`;
    } else if (sendForm.audienceType === 'Product Buyers') {
      audienceText = `Buyers of ${sendForm.targetProduct}`;
    } else if (sendForm.audienceType === 'Segment') {
      if (sendForm.segment === 'Governorate') {
        audienceText = `${sendForm.governorate} Governorate customers`;
      } else {
        audienceText = `${sendForm.segment} segment`;
      }
    }

    const newNotif = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      title: sendForm.title,
      content: sendForm.content,
      type: sendForm.type,
      audienceType: sendForm.audienceType,
      audienceDetail: audienceText,
      channel: 'In-App',
      status: sendForm.scheduleMode === 'Scheduled' ? 'Scheduled' : 'Delivered',
      sentAt:
        sendForm.scheduleMode === 'Scheduled'
          ? new Date(sendForm.scheduledDate).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
      sentToCount: sendForm.scheduleMode === 'Scheduled' ? 0 : 2248,
      readCount: sendForm.scheduleMode === 'Scheduled' ? 0 : 1850,
      readPercentage: sendForm.scheduleMode === 'Scheduled' ? 'Scheduled' : '82.3%',
      icon: Bell,
      color: 'purple',
    };

    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    try {
      localStorage.setItem('MIXO_admin_notifications', JSON.stringify(updatedNotifs));

      // Dispatch to user account notifications
      const regUsers = JSON.parse(localStorage.getItem('MIXO_registered_users') || '[]');
      const userNotifObj = {
        id: newNotif.id,
        title: newNotif.title,
        message: newNotif.content,
        type: newNotif.type,
        createdAt: new Date().toISOString(),
        read: false,
      };

      if (sendForm.audienceType === 'Specific Customer' && sendForm.specificCustomerEmail) {
        const targetKey = `MIXO_user_notifications_${sendForm.specificCustomerEmail.toLowerCase()}`;
        const userNotifs = JSON.parse(localStorage.getItem(targetKey) || '[]');
        userNotifs.unshift(userNotifObj);
        localStorage.setItem(targetKey, JSON.stringify(userNotifs));
      } else {
        regUsers.forEach((u) => {
          if (!u.email) return;
          const targetKey = `MIXO_user_notifications_${u.email.toLowerCase()}`;
          const userNotifs = JSON.parse(localStorage.getItem(targetKey) || '[]');
          userNotifs.unshift(userNotifObj);
          localStorage.setItem(targetKey, JSON.stringify(userNotifs));
        });
      }
    } catch (e) {
      console.error(e);
    }

    setIsSendModalOpen(false);

    if (sendForm.scheduleMode === 'Scheduled') {
      triggerToast(`In-App Notification "${sendForm.title}" scheduled! 📅`);
    } else {
      triggerToast(`In-App Notification "${sendForm.title}" sent to website users! 🔔`);
    }
  };

  // Actions
  const handleDuplicate = (n) => {
    const duplicated = {
      ...n,
      id: `NOT-${Date.now().toString().slice(-4)}`,
      title: `${n.title} (Copy)`,
      status: 'Scheduled',
      sentAt: 'Jun 10, 2024, 10:00 AM',
    };
    setNotifications([duplicated, ...notifications]);
    triggerToast(`Notification "${n.title}" copied! 📋`);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete notification "${title}"?`)) {
      setNotifications(notifications.filter((n) => n.id !== id));
      triggerToast(`Notification "${title}" deleted. 🗑️`);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTab('All Notifications');
    setTypeFilter('All Types');
    setStatusFilter('All Status');
    setCurrentPage(1);
    triggerToast('All notification filters reset. 🔄');
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-gray-700 animate-bounce">
          <Sparkles size={16} className="text-[#C89A3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-gray-400 mb-1">
            Dashboard &gt; <span className="text-gray-700 font-semibold">Notifications</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">In-App Notifications</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage and send website notifications to your customers
          </p>
        </div>

        {/* Top Right Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSendModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-900 bg-[#C89A3D] hover:bg-[#b58832] hover:text-white rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Send size={15} />
            <span>Send In-App Notification</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs transition-all cursor-pointer"
          >
            <Settings size={15} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* ── 5 Stat KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Sent */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Total Sent</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Send size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{totalSentCount.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">All time</p>
            </div>
            <svg className="w-14 h-7 text-purple-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,15 Q10,5 20,12 T40,4 T50,10" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Delivered */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Delivered</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{deliveredCount.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">90.8% delivery rate</p>
            </div>
            <svg className="w-14 h-7 text-emerald-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,18 Q12,10 25,14 T45,3 T50,7" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Unread */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Unread</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{unreadCount}</p>
              <p className="text-[10px] text-amber-600 font-semibold mt-0.5">17.8% of delivered</p>
            </div>
            <svg className="w-14 h-7 text-amber-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,12 Q15,18 28,8 T42,14 T50,4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Failed */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Failed</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{failedCount}</p>
              <p className="text-[10px] text-rose-500 font-semibold mt-0.5">4.7% failure rate</p>
            </div>
            <svg className="w-14 h-7 text-rose-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,8 Q15,4 30,16 T45,12 T50,18" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: Scheduled */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Scheduled</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{scheduledCount}</p>
              <p className="text-[10px] text-blue-600 font-medium mt-0.5">Upcoming notifications</p>
            </div>
            <svg className="w-14 h-7 text-blue-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,16 Q10,6 22,12 T40,2 T50,8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Status Tabs Bar ── */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {['All Notifications', 'Sent', 'Scheduled', 'Drafts', 'Failed'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-gray-900 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Search & Filter Controls Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search website notifications by title or content..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89A3D] text-gray-700 placeholder-gray-400 bg-gray-50/50"
            />
          </div>

          {/* Types Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="Promotion">Promotion</option>
            <option value="Discount">Discount</option>
            <option value="Order Update">Order Update</option>
            <option value="Feedback">Feedback</option>
            <option value="Welcome">Welcome</option>
            <option value="Alert">Alert</option>
            <option value="Announcement">Announcement</option>
            <option value="Occasion">Occasion</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Date Picker Button & Popup */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Calendar size={14} className="text-gray-400" />
              <span>{dateRange}</span>
            </button>

            {showDatePicker && (
              <div className="absolute top-11 left-0 z-40 bg-white border border-gray-200 p-4 rounded-2xl shadow-xl flex flex-col gap-3 min-w-[260px]">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-800">Select Date Range</span>
                  <button type="button" onClick={() => setShowDatePicker(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setDateRange('May 1, 2024 - May 31, 2024');
                      setShowDatePicker(false);
                      triggerToast('Filtered for May 2024');
                    }}
                    className="p-2 text-left hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
                  >
                    May 2024 (Current Month)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDateRange('Apr 1, 2024 - Apr 30, 2024');
                      setShowDatePicker(false);
                      triggerToast('Filtered for April 2024');
                    }}
                    className="p-2 text-left hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
                  >
                    April 2024 (Last Month)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter & Reset Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => triggerToast('Notification filters applied! 🔍')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gray-900 rounded-xl hover:bg-black transition-colors cursor-pointer"
          >
            <Filter size={14} />
            <span>Filter</span>
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-3.5 px-4 w-[280px]">Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Audience</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sent At ⇣</th>
                <th className="py-3.5 px-4">Sent To / Read</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedNotifications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-xs">
                    No notifications found matching your search & filters.
                  </td>
                </tr>
              ) : (
                paginatedNotifications.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Title & Snippet */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Bell size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-xs">{n.title}</span>
                          <span className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{n.content}</span>
                        </div>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${getTypeBadgeStyle(n.type)}`}>
                        {n.type}
                      </span>
                    </td>

                    {/* Audience Detail */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-[11px]">{n.audienceType}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{n.audienceDetail}</span>
                      </div>
                    </td>

                    {/* Channel (In-App Only) */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        <Laptop size={12} /> In-App Website
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {n.status === 'Delivered' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Delivered
                        </span>
                      )}
                      {n.status === 'Scheduled' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Scheduled
                        </span>
                      )}
                      {n.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Failed
                        </span>
                      )}
                    </td>

                    {/* Sent At */}
                    <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">{n.sentAt}</td>

                    {/* Sent To / Read Stats */}
                    <td className="py-3.5 px-4">
                      {n.status === 'Scheduled' ? (
                        <span className="text-gray-400 text-[11px] font-medium">- Scheduled</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-xs">
                            {n.sentToCount.toLocaleString()} / {n.readCount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold">{n.readPercentage} read</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingNotif(n)}
                          title="View Details & Analytics"
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(n)}
                          title="Duplicate Notification"
                          className="p-1.5 text-gray-400 hover:text-[#C89A3D] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(n.id, n.title)}
                          title="Delete Notification"
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer & Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-700">{paginatedNotifications.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * itemsPerPage, filteredNotifications.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-700">28</span> notifications
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 cursor-pointer"
            >
              &lt;
            </button>

            {[1, 2, 3, '...', 4].map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-1.5 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#C89A3D] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: Send In-App Notification Modal ── */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Send size={18} className="text-[#C89A3D]" />
                <span>Create In-App Website Notification</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSendModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="flex flex-col gap-4 text-xs">
              {/* Headline & Type */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block mb-1 font-semibold text-gray-700">Notification Title / Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 🔥 30% Off on all products for 24h!"
                    value={sendForm.title}
                    onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Type Category</label>
                  <select
                    value={sendForm.type}
                    onChange={(e) => setSendForm({ ...sendForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 cursor-pointer font-medium"
                  >
                    <option value="Promotion">Promotion</option>
                    <option value="Discount">Discount</option>
                    <option value="Order Update">Order Update</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Welcome">Welcome</option>
                    <option value="Alert">Alert</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Occasion">Occasion</option>
                  </select>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Target Audience (المستهدفين داخل الموقع)</label>
                <select
                  value={sendForm.audienceType}
                  onChange={(e) => setSendForm({ ...sendForm, audienceType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 cursor-pointer"
                >
                  <option value="All Users">1. Send to All Customers (إرسال لكل العملاء)</option>
                  <option value="Specific Customer">2. Send to a Specific Customer (عميل معين)</option>
                  <option value="Product Buyers">3. Buyers of a Specific Product (الذين اشتروا منتج معين)</option>
                  <option value="Segment">4. Customer Segment (حسب الفئة والمحافظة)</option>
                </select>
              </div>

              {/* Conditional Audience Details */}
              {sendForm.audienceType === 'Specific Customer' && (
                <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                  <label className="block mb-1 font-semibold text-purple-900">Customer Email or ID</label>
                  <input
                    type="text"
                    required
                    placeholder="omar.ahmed@email.com"
                    value={sendForm.specificCustomerEmail}
                    onChange={(e) => setSendForm({ ...sendForm, specificCustomerEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-purple-200 text-gray-900 font-medium focus:outline-none bg-white"
                  />
                </div>
              )}

              {sendForm.audienceType === 'Product Buyers' && (
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <label className="block mb-1 font-semibold text-blue-900">Select Purchased Product</label>
                  <select
                    value={sendForm.targetProduct}
                    onChange={(e) => setSendForm({ ...sendForm, targetProduct: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-blue-200 text-gray-900 font-medium focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="MIXO Pharaoh T-Shirt">MIXO Pharaoh T-Shirt</option>
                    <option value="MIXO Ankh Polo">MIXO Ankh Polo</option>
                    <option value="MIXO Scarab Hoodie">MIXO Scarab Hoodie</option>
                    <option value="MIXO Horus Cap">MIXO Horus Cap</option>
                    <option value="MIXO Premium Jacket">MIXO Premium Jacket</option>
                  </select>
                </div>
              )}

              {sendForm.audienceType === 'Segment' && (
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 flex flex-col gap-2">
                  <label className="block font-semibold text-amber-900">Select Customer Segment</label>
                  <select
                    value={sendForm.segment}
                    onChange={(e) => setSendForm({ ...sendForm, segment: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-amber-200 text-gray-900 font-medium focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="New Users">New Customers (العملاء الجدد)</option>
                    <option value="VIP / Top Buyers">Top Buyers / VIP (العملاء الأكثر شراءً)</option>
                    <option value="Inactive Customers">Inactive Customers (العملاء غير النشطين)</option>
                    <option value="Governorate">Governorate / City (عملاء محافظة معينة)</option>
                  </select>

                  {sendForm.segment === 'Governorate' && (
                    <div className="mt-1">
                      <label className="block mb-1 font-medium text-amber-900">Choose Governorate</label>
                      <select
                        value={sendForm.governorate}
                        onChange={(e) => setSendForm({ ...sendForm, governorate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-amber-200 text-gray-900 font-medium focus:outline-none bg-white cursor-pointer"
                      >
                        <option value="Cairo">Cairo (القاهرة)</option>
                        <option value="Giza">Giza (الجيزة)</option>
                        <option value="Alexandria">Alexandria (الإسكندرية)</option>
                        <option value="Dakahlia">Dakahlia (الدقهلية)</option>
                        <option value="Sharqia">Sharqia (الشرقية)</option>
                        <option value="Gharbia">Gharbia (الغربية)</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Message Content Body */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Notification Message Body</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type the message content that will appear in the customer website bell header..."
                  value={sendForm.content}
                  onChange={(e) => setSendForm({ ...sendForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                />
              </div>

              {/* Channel Display */}
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center justify-between text-xs text-purple-900">
                <span className="font-bold flex items-center gap-1.5">
                  <Laptop size={15} /> Channel: In-App Website Bell Notification
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">Inside Website Only</span>
              </div>

              {/* Schedule Timing Options */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Dispatch Timing</label>
                  <select
                    value={sendForm.scheduleMode}
                    onChange={(e) => setSendForm({ ...sendForm, scheduleMode: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 cursor-pointer"
                  >
                    <option value="Immediately">Send Immediately (إرسال فوري)</option>
                    <option value="Scheduled">Schedule for Later (جدولة لاحقة)</option>
                  </select>
                </div>

                {sendForm.scheduleMode === 'Scheduled' && (
                  <div>
                    <label className="block mb-1 font-semibold text-gray-700">Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={sendForm.scheduledDate}
                      onChange={(e) => setSendForm({ ...sendForm, scheduledDate: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-medium focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={14} />
                  <span>{sendForm.scheduleMode === 'Scheduled' ? 'Schedule Notification' : 'Send In-App Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Automatic System Triggers Settings Modal ── */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Settings size={18} className="text-[#C89A3D]" />
                <span>Automatic Event In-App Triggers (الإشعارات التلقائية)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Enable or disable automatic in-app website notifications triggered on store events.
            </p>

            <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
              {autoTriggers.map((trig, idx) => (
                <div key={trig.id} className="p-3 bg-gray-50/70 rounded-xl border border-gray-200/70 flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-gray-800 flex-1">{trig.name}</span>

                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={trig.enabled}
                      onChange={(e) => {
                        const updated = [...autoTriggers];
                        updated[idx].enabled = e.target.checked;
                        setAutoTriggers(updated);
                      }}
                      className="w-4 h-4 accent-[#C89A3D] rounded cursor-pointer"
                    />
                    <span className="text-xs text-gray-700 font-semibold">Active In-App</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  triggerToast('Automatic event notification triggers updated! ⚙️');
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl cursor-pointer shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: View Notification Details & Analytics ── */}
      {viewingNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-[#C89A3D]" />
                <span>In-App Notification Analytics</span>
              </h3>
              <button
                type="button"
                onClick={() => setViewingNotif(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className={`inline-block w-max px-2.5 py-0.5 rounded text-[10px] font-bold border ${getTypeBadgeStyle(viewingNotif.type)}`}>
                {viewingNotif.type}
              </span>
              <h4 className="font-extrabold text-gray-900 text-sm">{viewingNotif.title}</h4>
              <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                "{viewingNotif.content}"
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100 text-center text-xs">
              <div>
                <span className="text-[10px] text-purple-700 font-semibold block">Total Sent</span>
                <span className="text-base font-extrabold text-gray-900">{viewingNotif.sentToCount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-700 font-semibold block">Read / Opened</span>
                <span className="text-base font-extrabold text-emerald-600">{viewingNotif.readCount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-700 font-semibold block">Read Rate</span>
                <span className="text-base font-extrabold text-purple-900">{viewingNotif.readPercentage}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setViewingNotif(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

