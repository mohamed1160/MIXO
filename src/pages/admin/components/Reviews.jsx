import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Sparkles,
  Filter,
  User,
  Package
} from 'lucide-react';
import { getSupabaseReviews, updateSupabaseReviewStatus, deleteSupabaseReview } from '../../../services/db.service';

export default function Reviews() {
  const [rawReviews, setRawReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  const loadReviewsData = async () => {
    setLoading(true);
    try {
      const data = await getSupabaseReviews();
      setRawReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviewsData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = async (review) => {
    const newStatus = review.status === 'approved' ? 'pending' : 'approved';
    try {
      await updateSupabaseReviewStatus(review.id, newStatus);
      showToast(newStatus === 'approved' ? 'تمت الموافقة على التقييم بنجاح ✨' : 'تم تغيير حالة التقييم إلى معلق ⏳');
      loadReviewsData();
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء تعديل الحالة');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذا التقييم؟')) {
      try {
        await deleteSupabaseReview(id);
        showToast('تم حذف التقييم بنجاح 🗑️');
        loadReviewsData();
      } catch (err) {
        console.error(err);
        showToast('حدث خطأ أثناء الحذف');
      }
    }
  };

  // Processed Reviews
  const reviews = useMemo(() => {
    return rawReviews.map((r) => ({
      id: r.id,
      text: r.comment || 'لا يوجد تعليق مکتوب',
      rating: Number(r.rating) || 5,
      status: r.status === 'approved' ? 'approved' : 'pending',
      date: r.date || 'مؤخراً',
      userName: r.userName || 'عميل المتجر',
      userEmail: r.userEmail || 'عميل مجهول',
      productName: r.productName || `منتج #${r.productId || '1'}`,
      productId: r.productId,
    }));
  }, [rawReviews]);

  // Statistics
  const totalCount = reviews.length;
  const avgRating = totalCount > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1) 
    : '5.0';

  // Filtered List
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        r.text.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Approved' && r.status === 'approved') ||
        (statusFilter === 'Pending' && r.status === 'pending');

      return matchesQuery && matchesStatus;
    });
  }, [reviews, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800 dir-rtl">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-[#FF1F3D]" size={24} />
            <span>ريفيوهات العملاء</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            جميع التقييمات والآراء المرسلة من قبل عملاء المتجر.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-[#FF1F3D] rounded-xl">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">إجمالي الريفيوهات</p>
              <p className="text-lg font-bold text-gray-900">{totalCount}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
              <Star size={18} className="fill-current" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">متوسط التقييم</p>
              <p className="text-lg font-bold text-gray-900">{avgRating} / 5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث باسم العميل، المنتج، أو التقييم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500">الحالة:</span>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {['All', 'Approved', 'Pending'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {st === 'All' ? 'الكل' : st === 'Approved' ? 'المقبولة' : 'المعلقة'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Content */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
          <p className="text-xs font-semibold animate-pulse">جاري تحميل الريفيوهات...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 space-y-2">
          <MessageSquare size={36} className="mx-auto text-gray-300 stroke-[1.5]" />
          <p className="text-sm font-bold text-gray-700">لا توجد تقييمات مطابقة</p>
          <p className="text-xs text-gray-400">لم يتم العثور على أي ريفيوهات بناءً على خيارات البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
            >
              {/* Header: User & Rating */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-[#FF1F3D] font-bold text-sm flex items-center justify-center border border-rose-100 shrink-0">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      {rev.userName}
                    </h3>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Package size={12} className="text-gray-400" />
                      <span>{rev.productName}</span>
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100 shrink-0">
                  <Star size={14} className="text-amber-400 fill-current" />
                  <span className="text-xs font-bold text-amber-700">{rev.rating}.0</span>
                </div>
              </div>

              {/* Comment Bubble */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-xs text-gray-700 leading-relaxed font-medium">
                "{rev.text}"
              </div>

              {/* Footer: Date, Status, Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <span className="text-[11px] text-gray-400">{rev.date}</span>

                <div className="flex items-center gap-2">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleStatus(rev)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                      rev.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {rev.status === 'approved' ? (
                      <>
                        <CheckCircle size={12} />
                        <span>مقبول (مُفعل)</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={12} />
                        <span>معلق (إخفاء)</span>
                      </>
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف التقييم"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
