import React, { useState, useEffect } from 'react';
import { getSupabaseFaqs, saveSupabaseFaq, deleteSupabaseFaq } from '../../../services/db.service';
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getFAQs,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
  faqCategories,
} from '../../../services/faq.service';
import ConfirmDialog from './ConfirmDialog';
import { useLanguage } from '../../../providers/LanguageContext';

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const { isRTL } = useLanguage();

  const [formData, setFormData] = useState({
    questionAr: '',
    questionEn: '',
    answerAr: '',
    answerEn: '',
    category: 'general',
    isActive: true,
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    const data = await getSupabaseFaqs();
    setFaqs(data.length > 0 ? data : getFAQs());
  };

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        questionAr: faq.questionAr || '',
        questionEn: faq.questionEn || '',
        answerAr: faq.answerAr || '',
        answerEn: faq.answerEn || '',
        category: faq.category || 'general',
        isActive: faq.isActive ?? true,
      });
    } else {
      setEditingFaq(null);
      setFormData({
        questionAr: '',
        questionEn: '',
        answerAr: '',
        answerEn: '',
        category: 'general',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.questionAr.trim() && !formData.questionEn.trim()) {
      toast.error(isRTL ? 'يرجى إدخال السؤال على الأقل بلغة واحدة' : 'Please enter question in at least one language');
      return;
    }
    if (!formData.answerAr.trim() && !formData.answerEn.trim()) {
      toast.error(isRTL ? 'يرجى إدخال الإجابة على الأقل بلغة واحدة' : 'Please enter answer in at least one language');
      return;
    }

    await saveSupabaseFaq(formData);
    toast.success(isRTL ? 'تم حفظ السؤال بنجاح في قواعد البيانات 🎉' : 'FAQ saved successfully to Supabase 🎉');

    setIsModalOpen(false);
    loadFAQs();
  };

  const handleToggleStatus = (id) => {
    const updated = toggleFAQStatus(id);
    setFaqs(updated);
    toast.success(isRTL ? 'تم تغيير حالة الظهور' : 'Status toggled successfully');
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    await deleteSupabaseFaq(deleteTargetId);
    setDeleteTargetId(null);
    loadFAQs();
    toast.success(isRTL ? 'تم حذف السؤال بنجاح' : 'FAQ deleted');
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (faq.questionAr && faq.questionAr.toLowerCase().includes(query)) ||
      (faq.questionEn && faq.questionEn.toLowerCase().includes(query)) ||
      (faq.answerAr && faq.answerAr.toLowerCase().includes(query)) ||
      (faq.answerEn && faq.answerEn.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const activeCount = faqs.filter((f) => f.isActive).length;

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* ── Page Title & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0F151D] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2630] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-[#FF1F3D]/20 flex items-center justify-center text-[#FF1F3D]">
            <HelpCircle size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {isRTL ? 'إدارة الأسئلة والأجوبة (Q&A)' : 'FAQ & Q&A Management'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#7F8A96]">
              {isRTL
                ? 'إضافة وتعديل الأسئلة الشائعة التي تظهر للعملاء في المتجر'
                : 'Add and manage customer frequently asked questions across the store'}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer"
        >
          <Plus size={16} />
          <span>{isRTL ? 'إضافة سؤال جديد' : 'Add New Question'}</span>
        </button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0F151D] p-4 rounded-xl border border-slate-200 dark:border-[#1E2630] flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isRTL ? 'إجمالي الأسئلة' : 'Total Questions'}
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{faqs.length}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <HelpCircle size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F151D] p-4 rounded-xl border border-slate-200 dark:border-[#1E2630] flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isRTL ? 'الأسئلة النشطة بالمتجر' : 'Active Store FAQs'}
            </p>
            <p className="text-2xl font-black text-emerald-500 mt-1">{activeCount}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F151D] p-4 rounded-xl border border-slate-200 dark:border-[#1E2630] flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isRTL ? 'عدد التصنيفات' : 'Categories Count'}
            </p>
            <p className="text-2xl font-black text-[#FF1F3D] mt-1">{faqCategories.length - 1}</p>
          </div>
          <div className="p-3 bg-red-500/10 text-[#FF1F3D] rounded-xl">
            <Layers size={20} />
          </div>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0F151D] p-4 rounded-xl border border-slate-200 dark:border-[#1E2630]">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'بحث في الأسئلة والإجابات...' : 'Search questions & answers...'}
            className="w-full bg-slate-50 dark:bg-[#151C24] border border-slate-200 dark:border-[#26313D] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#FF1F3D] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#151C24] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-200 dark:hover:bg-[#1E2630]'
              }`}
            >
              {isRTL ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* ── FAQs Table / Card List ── */}
      <div className="bg-white dark:bg-[#0F151D] rounded-2xl border border-slate-200 dark:border-[#1E2630] overflow-hidden shadow-sm">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-[#7F8A96]">
            <HelpCircle size={40} className="mx-auto mb-3 opacity-30 text-[#FF1F3D]" />
            <p className="font-semibold text-sm">{isRTL ? 'لا توجد أسئلة مطابقة للبحث' : 'No matching FAQs found'}</p>
            <p className="text-xs mt-1">{isRTL ? 'جرب البحث بكلمات أخرى أو إضافة سؤال جديد' : 'Try searching other terms or add a new question'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-[#1E2630]">
            {filteredFaqs.map((faq) => {
              const catObj = faqCategories.find((c) => c.id === faq.category);

              return (
                <div
                  key={faq.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-[#151C24]/40 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20">
                        {isRTL ? catObj?.labelAr || faq.category : catObj?.labelEn || faq.category}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          faq.isActive
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}
                      >
                        {faq.isActive ? (
                          <>
                            <CheckCircle2 size={10} /> {isRTL ? 'ظاهر بالمتجر' : 'Active'}
                          </>
                        ) : (
                          <>
                            <XCircle size={10} /> {isRTL ? 'مخفي' : 'Hidden'}
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isRTL ? faq.questionAr || faq.questionEn : faq.questionEn || faq.questionAr}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#AAB4C0] leading-relaxed line-clamp-2">
                      {isRTL ? faq.answerAr || faq.answerEn : faq.answerEn || faq.answerAr}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleToggleStatus(faq.id)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        faq.isActive
                          ? 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                          : 'border-slate-300 dark:border-[#26313D] text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E2630]'
                      }`}
                      title={isRTL ? 'تبديل حالة الظهور' : 'Toggle visibility'}
                    >
                      {faq.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>

                    <button
                      onClick={() => handleOpenModal(faq)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-[#151C24] hover:bg-slate-200 dark:hover:bg-[#1E2630] border border-slate-200 dark:border-[#26313D] text-slate-700 dark:text-slate-200 transition-colors"
                      title={isRTL ? 'تعديل' : 'Edit'}
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => setDeleteTargetId(faq.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[#FF1F3D] border border-red-500/20 transition-colors"
                      title={isRTL ? 'حذف' : 'Delete'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0F151D] border border-slate-200 dark:border-[#1E2630] rounded-2xl w-full max-w-xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-[#FF1F3D]" />
              {editingFaq
                ? isRTL
                  ? 'تعديل السؤال والجواب'
                  : 'Edit Question & Answer'
                : isRTL
                ? 'إضافة سؤال وجواب جديد'
                : 'Add New Question & Answer'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRTL ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#151C24] border border-slate-200 dark:border-[#26313D] rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                >
                  {faqCategories
                    .filter((c) => c.id !== 'all')
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {isRTL ? cat.labelAr : cat.labelEn}
                      </option>
                    ))}
                </select>
              </div>

              {/* Question Ar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRTL ? 'السؤال (بالعربية)' : 'Question (Arabic)'}
                </label>
                <input
                  type="text"
                  value={formData.questionAr}
                  onChange={(e) => setFormData({ ...formData, questionAr: e.target.value })}
                  placeholder="مثال: كم يستغرق وقت شحن الطلبات المخصصة؟"
                  className="w-full bg-slate-50 dark:bg-[#151C24] border border-slate-200 dark:border-[#26313D] rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              {/* Question En */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRTL ? 'السؤال (بالإنجليزية)' : 'Question (English)'}
                </label>
                <input
                  type="text"
                  value={formData.questionEn}
                  onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                  placeholder="e.g. How long does custom order delivery take?"
                  className="w-full bg-slate-50 dark:bg-[#151C24] border border-slate-200 dark:border-[#26313D] rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              {/* Answer Ar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRTL ? 'الإجابة (بالعربية)' : 'Answer (Arabic)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.answerAr}
                  onChange={(e) => setFormData({ ...formData, answerAr: e.target.value })}
                  placeholder="اكتب الإجابة المفصلة التي ستظهر للعميل..."
                  className="w-full bg-slate-50 dark:bg-[#151C24] border border-slate-200 dark:border-[#26313D] rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              {/* Answer En */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRTL ? 'الإجابة (بالإنجليزية)' : 'Answer (English)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.answerEn}
                  onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                  placeholder="Type the detailed answer for English users..."
                  className="w-full bg-slate-50 dark:bg-[#151C24] border border-slate-200 dark:border-[#26313D] rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#FF1F3D] rounded"
                />
                <label htmlFor="isActive" className="text-xs font-semibold cursor-pointer">
                  {isRTL ? 'إظهار السؤال فوراً في المتجر (نشط)' : 'Show in store immediately (Active)'}
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#1E2630]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-[#26313D] hover:bg-slate-100 dark:hover:bg-[#151C24] transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF1F3D] hover:bg-[#D91832] text-white transition-colors shadow-md shadow-red-600/20"
                >
                  {isRTL ? 'حفظ التغيرات' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title={isRTL ? 'تأكيد حذف السؤال' : 'Confirm Delete FAQ'}
        message={
          isRTL
            ? 'هل أنت تأكد من رغبتك في حذف هذا السؤال من المتجر؟ لا يمكن التراجع عن هذا الإجراء.'
            : 'Are you sure you want to delete this question? This action cannot be undone.'
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
