import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  X,
  Percent,
  Search,
  Trash2,
  Edit2,
  Copy,
  Check,
  Sparkles,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';
import {
  getSupabaseCoupons,
  saveSupabaseCoupon,
  deleteSupabaseCoupon
} from '../../../services/db.service';

export default function PromoCodes() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    type: 'percent', // 'percent' | 'amount'
    value: '',
    minSpend: '0',
    isActive: true,
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await getSupabaseCoupons();
      if (data && data.length > 0) {
        setCoupons(data);
      } else {
        const saved = localStorage.getItem('MIXO_promo_coupons');
        if (saved) {
          setCoupons(JSON.parse(saved));
        } else {
          setCoupons([]);
        }
      }
    } catch (e) {
      console.error(e);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`تم نسخ الكود "${code}" للحافظة 📋`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'percent',
      value: '',
      minSpend: '0',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.discountPercent ? 'percent' : 'amount',
      value: coupon.discountPercent || coupon.discountAmount || '',
      minSpend: coupon.minSpend || 0,
      isActive: coupon.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.value) return;

    const formattedCode = formData.code.trim().toUpperCase();
    const val = Number(formData.value) || 0;
    const minS = Number(formData.minSpend) || 0;

    const couponObj = {
      code: formattedCode,
      discountPercent: formData.type === 'percent' ? val : null,
      discountAmount: formData.type === 'amount' ? val : null,
      minSpend: minS,
      isActive: formData.isActive,
    };

    try {
      await saveSupabaseCoupon(couponObj);
      showToast(editingCoupon ? `تم تعديل كود الخصم "${formattedCode}" بنجاح ✏️` : `تم إنشاء كود الخصم "${formattedCode}" بنجاح 🎉`);
      loadCoupons();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ الكوبون');
    }
  };

  const handleDelete = async (code) => {
    if (window.confirm(`هل أنت تأكد من رغبتك في حذف كود الخصم "${code}"؟`)) {
      try {
        await deleteSupabaseCoupon(code);
        showToast(`تم حذف كود الخصم "${code}" 🗑️`);
        loadCoupons();
      } catch (err) {
        console.error(err);
        showToast('حدث خطأ أثناء الحذف');
      }
    }
  };

  // Filtered List
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || c.code.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && c.isActive !== false) ||
        (statusFilter === 'Inactive' && c.isActive === false);

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  const activeCount = useMemo(() => coupons.filter(c => c.isActive !== false).length, [coupons]);

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800 dir-rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Main Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Tag className="text-[#FF1F3D]" size={24} />
            <span>أكواد الخصم والكوبونات</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            إدارة كوبونات الخصم وتحديد قيم التخفيض المتاحة لعملاء المتجر.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-[#FF1F3D] hover:bg-[#D91832] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center gap-2 justify-center cursor-pointer"
        >
          <Plus size={16} />
          <span>إضافة كود خصم جديد</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-[#FF1F3D] rounded-xl">
            <Tag size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">إجمالي الكوبونات</p>
            <p className="text-xl font-extrabold text-gray-900">{coupons.length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">الكوبونات النشطة</p>
            <p className="text-xl font-extrabold text-gray-900">{activeCount}</p>
          </div>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث بكود الخصم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
          {['All', 'Active', 'Inactive'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {st === 'All' ? 'الكل' : st === 'Active' ? 'النشطة' : 'المعطلة'}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
          <p className="text-xs font-semibold animate-pulse">جاري تحميل الكوبونات...</p>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 space-y-2">
          <Tag size={36} className="mx-auto text-gray-300 stroke-[1.5]" />
          <p className="text-sm font-bold text-gray-700">لا توجد أكواد خصم مطابقة</p>
          <p className="text-xs text-gray-400">يمكنك إنشاء كود خصم جديد بالضغط على الزر أعلاه.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
            >
              {/* Badge & Code */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-rose-50 text-[#FF1F3D] border border-rose-100 font-mono font-extrabold text-sm rounded-xl tracking-wider uppercase">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="نسخ الكود"
                    >
                      {copiedCode === coupon.code ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                    coupon.isActive !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  {coupon.isActive !== false ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  <span>{coupon.isActive !== false ? 'نشط' : 'معطل'}</span>
                </span>
              </div>

              {/* Discount Amount Details */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-1">
                <div className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                  {coupon.discountPercent ? (
                    <>
                      <Percent size={16} className="text-[#FF1F3D]" />
                      <span>خصم {coupon.discountPercent}% من قيمة الطلب</span>
                    </>
                  ) : (
                    <>
                      <DollarSign size={16} className="text-[#FF1F3D]" />
                      <span>خصم {coupon.discountAmount} ج.م ثابت</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">
                  الحد الأدنى للشراء: <span className="font-bold text-gray-700">{coupon.minSpend || 0} ج.م</span>
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 font-medium">متاح لجميع الأجهزة</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(coupon)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="تعديل الكود"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.code)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف الكود"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create or Edit Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Tag className="text-[#FF1F3D]" size={20} />
                <span>{editingCoupon ? 'تعديل كود الخصم' : 'إضافة كود خصم جديد'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">كود الخصم (Coupon Code) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: MIXO20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase font-bold text-gray-900 focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">نوع الخصم *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'percent' })}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      formData.type === 'percent'
                        ? 'bg-rose-50 border-[#FF1F3D] text-[#FF1F3D]'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    نسبة مئوية (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'amount' })}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      formData.type === 'amount'
                        ? 'bg-rose-50 border-[#FF1F3D] text-[#FF1F3D]'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    مبلغ ثابت (ج.م)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {formData.type === 'percent' ? 'نسبة الخصم (%) *' : 'قيمة الخصم (ج.م) *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder={formData.type === 'percent' ? '20' : '50'}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">الحد الأدنى للشراء (ج.م)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded accent-[#FF1F3D] w-4 h-4"
                  />
                  <span className="font-semibold text-gray-800">تفعيل كود الخصم مباشرة للعملاء</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {editingCoupon ? 'حفظ التعديلات' : 'إضافة الكود'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
