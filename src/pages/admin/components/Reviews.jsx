import { useState, useMemo } from 'react';
import {
  Star,
  Check,
  X,
  Search,
  Calendar,
  Filter,
  RotateCcw,
  Download,
  Settings,
  Eye,
  Trash2,
  Undo2,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { getAdminData } from '../../../services/adminMockData';

// Initial dataset matching the exact screenshot design
const INITIAL_REVIEWS = [];

export default function Reviews() {
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem('MIXO_product_reviews');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('All Products');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRange, setDateRange] = useState('May 1, 2024 - May 31, 2024');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Toast Banner
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [viewingReview, setViewingReview] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    autoApprove4StarPlus: true,
    requirePurchaseVerification: true,
    notifyAdminOn1Star: true,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stats Calculations
  const totalReviewsCount = reviews.length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1) : '0.0';
  const pendingCount = useMemo(() => reviews.filter((r) => r.status === 'Pending').length, [reviews]);
  const publishedCount = useMemo(() => reviews.filter((r) => r.status === 'Published').length, [reviews]);
  const disapprovedCount = useMemo(() => reviews.filter((r) => r.status === 'Disapproved').length, [reviews]);

  // Unique product options for filter
  const productOptions = useMemo(() => {
    const set = new Set(reviews.map((r) => r.product.name));
    return ['All Products', ...Array.from(set)];
  }, [reviews]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        r.customer.name.toLowerCase().includes(q) ||
        r.customer.email.toLowerCase().includes(q) ||
        r.product.name.toLowerCase().includes(q);

      const matchesProduct = productFilter === 'All Products' || r.product.name === productFilter;
      const matchesRating = ratingFilter === 'All Ratings' || String(r.rating) === ratingFilter.split(' ')[0];
      const matchesStatus = statusFilter === 'All Status' || r.status === statusFilter;

      return matchesSearch && matchesProduct && matchesRating && matchesStatus;
    });
  }, [reviews, searchQuery, productFilter, ratingFilter, statusFilter]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Review ID', 'Title', 'Rating', 'Text', 'Customer Name', 'Customer Email', 'Product Name', 'Status', 'Date'];
    const rows = filteredReviews.map((r) => [
      r.id,
      `"${r.title}"`,
      r.rating,
      `"${r.text}"`,
      `"${r.customer.name}"`,
      r.customer.email,
      `"${r.product.name}"`,
      r.status,
      `"${r.date}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MIXO_Reviews_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Product Reviews report exported to CSV! 📥');
  };

  // Actions handlers: ONLY Publish / Disapprove / Delete
  const handleApprove = (id, title) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Published' } : r)));
    triggerToast(`Review "${title}" approved and published! ✅`);
  };

  const handleDisapprove = (id, title) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Disapproved' } : r)));
    triggerToast(`Review "${title}" disapproved. ❌`);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete review "${title}"?`)) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      triggerToast(`Review "${title}" deleted. 🗑️`);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setProductFilter('All Products');
    setRatingFilter('All Ratings');
    setStatusFilter('All Status');
    setShowDatePicker(false);
    setCurrentPage(1);
    triggerToast('All review filters reset. 🔄');
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
            Dashboard &gt; <span className="text-gray-700 font-semibold">Reviews</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reviews</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage product reviews and customer feedback
          </p>
        </div>

        {/* Top Right Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs transition-all cursor-pointer"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* ── 5 Stat KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Reviews */}
        <div
          onClick={() => {
            setStatusFilter('All Status');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'All Status' ? 'border-[#C89A3D] shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Total Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={16} className="fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{totalReviewsCount.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">All time reviews</p>
            </div>
            <svg className="w-14 h-7 text-amber-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,15 Q10,5 20,12 T40,4 T50,10" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Average Rating */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Star size={16} className="fill-emerald-500 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{avgRating} / 5</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">All time average</p>
            </div>
            <svg className="w-14 h-7 text-emerald-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,18 Q12,10 25,14 T45,3 T50,7" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Pending Reviews */}
        <div
          onClick={() => {
            setStatusFilter('Pending');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'Pending' ? 'border-purple-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Pending Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{pendingCount}</p>
              <p className="text-[10px] text-purple-600 font-medium mt-0.5">Awaiting approval</p>
            </div>
            <svg className="w-14 h-7 text-purple-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,12 Q15,18 28,8 T42,14 T50,4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Published Reviews */}
        <div
          onClick={() => {
            setStatusFilter('Published');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'Published' ? 'border-blue-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Published Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{publishedCount.toLocaleString()}</p>
              <p className="text-[10px] text-blue-600 font-medium mt-0.5">Visible on store</p>
            </div>
            <svg className="w-14 h-7 text-blue-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,16 Q10,6 22,12 T40,2 T50,8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: Disapproved Reviews */}
        <div
          onClick={() => {
            setStatusFilter('Disapproved');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'Disapproved' ? 'border-rose-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Disapproved Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{disapprovedCount}</p>
              <p className="text-[10px] text-rose-500 font-medium mt-0.5">Not visible</p>
            </div>
            <svg className="w-14 h-7 text-rose-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,8 Q15,4 30,16 T45,12 T50,18" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by review, product, customer..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89A3D] text-gray-700 placeholder-gray-400 bg-gray-50/50"
            />
          </div>

          {/* Product Select Dropdown */}
          <select
            value={productFilter}
            onChange={(e) => {
              setProductFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            {productOptions.map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>

          {/* Ratings Select Dropdown */}
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            <option value="All Ratings">All Ratings</option>
            <option value="5 Stars">5 Stars ⭐⭐⭐⭐⭐</option>
            <option value="4 Stars">4 Stars ⭐⭐⭐⭐</option>
            <option value="3 Stars">3 Stars ⭐⭐⭐</option>
            <option value="2 Stars">2 Stars ⭐⭐</option>
            <option value="1 Star">1 Star ⭐</option>
          </select>

          {/* Status Select Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Published">Published</option>
            <option value="Pending">Pending</option>
            <option value="Disapproved">Disapproved</option>
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
            onClick={() => triggerToast('Review filters applied! 🔍')}
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
                <th className="py-3.5 px-4 w-[280px]">Review</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-xs">
                    No customer reviews found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Review Title & Content */}
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={r.customer.avatar}
                          alt={r.customer.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0 mt-0.5"
                        />
                        <div className="flex flex-col gap-0.5">
                          <h4 className="font-bold text-gray-900 text-xs">{r.title}</h4>
                          <div className="flex items-center gap-0.5 text-amber-400 my-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                className={star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                              />
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                            {r.text}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Product Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.product.image}
                          alt={r.product.name}
                          className="w-9 h-9 rounded-lg object-cover border border-gray-100 bg-gray-50 shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-[11px]">{r.product.name}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{r.product.category}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{r.product.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-900 text-xs">{r.customer.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{r.customer.email}</span>
                        {r.customer.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                            <ShieldCheck size={11} /> Verified Buyer
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rating Stars */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={13}
                            className={star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {r.status === 'Published' && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                          Published
                        </span>
                      )}
                      {r.status === 'Pending' && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600">
                          Pending
                        </span>
                      )}
                      {r.status === 'Disapproved' && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-500">
                          Disapproved
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                      {r.date}
                    </td>

                    {/* Action Buttons: ONLY Moderation (Publish/Disapprove/View/Delete) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {r.status === 'Published' ? (
                          <>
                            {/* View Detail Button */}
                            <button
                              type="button"
                              onClick={() => setViewingReview(r)}
                              title="View Review"
                              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>
                            {/* Disapprove / Unpublish Button */}
                            <button
                              type="button"
                              onClick={() => handleDisapprove(r.id, r.title)}
                              title="Disapprove / Unpublish"
                              className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <X size={15} />
                            </button>
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDelete(r.id, r.title)}
                              title="Delete Review"
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        ) : r.status === 'Pending' ? (
                          <>
                            {/* Approve / Publish Check Button */}
                            <button
                              type="button"
                              onClick={() => handleApprove(r.id, r.title)}
                              title="Approve & Publish Review"
                              className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Check size={15} />
                            </button>
                            {/* Disapprove X Button */}
                            <button
                              type="button"
                              onClick={() => handleDisapprove(r.id, r.title)}
                              title="Disapprove Review"
                              className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <X size={15} />
                            </button>
                            {/* View Detail Button */}
                            <button
                              type="button"
                              onClick={() => setViewingReview(r)}
                              title="View Review"
                              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>
                          </>
                        ) : (
                          /* Disapproved: View & Re-Publish / Undo */
                          <>
                            <button
                              type="button"
                              onClick={() => setViewingReview(r)}
                              title="View Review"
                              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(r.id, r.title)}
                              title="Restore / Publish"
                              className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Undo2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(r.id, r.title)}
                              title="Delete Review"
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
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
            Showing <span className="font-semibold text-gray-700">{paginatedReviews.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * itemsPerPage, filteredReviews.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-700">1,248</span> reviews
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

            {[1, 2, 3, '...', 250].map((page, idx) =>
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

      {/* ── View Review Detail Modal ── */}
      {viewingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#C89A3D]" />
                <span>Review Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setViewingReview(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer & Product Info Header */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 font-medium block">Customer</span>
                <p className="font-bold text-gray-900 mt-0.5">{viewingReview.customer.name}</p>
                <p className="text-[10px] text-gray-500">{viewingReview.customer.email}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-medium block">Product</span>
                <p className="font-bold text-gray-900 mt-0.5">{viewingReview.product.name}</p>
                <p className="text-[10px] text-gray-500">{viewingReview.product.category}</p>
              </div>
            </div>

            {/* Rating & Review Content */}
            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= viewingReview.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                    />
                  ))}
                  <span className="text-xs font-bold text-gray-900 ml-1.5">{viewingReview.rating} / 5</span>
                </div>
                <span className="text-[11px] text-gray-400">{viewingReview.date}</span>
              </div>

              <h4 className="font-bold text-gray-900 text-sm mt-1">{viewingReview.title}</h4>
              <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 font-medium">
                "{viewingReview.text}"
              </p>
            </div>

            {/* Modal Actions: ONLY Moderation Publish / Disapprove / Close */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-gray-500">
                Status:{' '}
                <span
                  className={
                    viewingReview.status === 'Published'
                      ? 'text-emerald-600 font-bold'
                      : viewingReview.status === 'Pending'
                      ? 'text-amber-600 font-bold'
                      : 'text-rose-500 font-bold'
                  }
                >
                  {viewingReview.status}
                </span>
              </span>

              <div className="flex items-center gap-2">
                {viewingReview.status !== 'Published' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApprove(viewingReview.id, viewingReview.title);
                      setViewingReview(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer shadow-xs"
                  >
                    Publish Review
                  </button>
                )}
                {viewingReview.status !== 'Disapproved' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDisapprove(viewingReview.id, viewingReview.title);
                      setViewingReview(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer shadow-xs"
                  >
                    Disapprove
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewingReview(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Review Settings Modal ── */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Settings size={18} className="text-[#C89A3D]" />
                <span>Review Settings</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer">
                <div>
                  <span className="font-bold text-gray-900 block">Auto-Approve 4+ Star Reviews</span>
                  <span className="text-[10px] text-gray-400">Automatically publish positive customer reviews</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoApprove4StarPlus}
                  onChange={(e) => setSettings({ ...settings, autoApprove4StarPlus: e.target.checked })}
                  className="w-4 h-4 accent-[#C89A3D] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer">
                <div>
                  <span className="font-bold text-gray-900 block">Require Verified Buyer Badge</span>
                  <span className="text-[10px] text-gray-400">Only allow customers who purchased the product</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requirePurchaseVerification}
                  onChange={(e) => setSettings({ ...settings, requirePurchaseVerification: e.target.checked })}
                  className="w-4 h-4 accent-[#C89A3D] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer">
                <div>
                  <span className="font-bold text-gray-900 block">Alert Admin on 1-Star Reviews</span>
                  <span className="text-[10px] text-gray-400">Send instant notification on critical feedback</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyAdminOn1Star}
                  onChange={(e) => setSettings({ ...settings, notifyAdminOn1Star: e.target.checked })}
                  className="w-4 h-4 accent-[#C89A3D] rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  triggerToast('Review settings saved successfully! ⚙️');
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl cursor-pointer shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

