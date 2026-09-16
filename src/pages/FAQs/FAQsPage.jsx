import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Box,
  Truck,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { getFAQs, faqCategories } from '../../services/faq.service';
import { useLanguage } from '../../providers/LanguageContext';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);
  const { isRTL } = useLanguage();

  useEffect(() => {
    // Load active FAQs from service (synced with admin dashboard)
    const data = getFAQs().filter((f) => f.isActive !== false);
    setFaqs(data);
    if (data.length > 0) {
      setOpenFaqId(data[0].id);
    }
  }, []);

  const toggleAccordion = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (faq.questionAr && faq.questionAr.toLowerCase().includes(query)) ||
      (faq.questionEn && faq.questionEn.toLowerCase().includes(query)) ||
      (faq.answerAr && faq.answerAr.toLowerCase().includes(query)) ||
      (faq.answerEn && faq.answerEn.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070B10] text-gray-900 dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* ── Hero Header ── */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#FF1F3D] border border-[#FF1F3D]/20 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={14} />
            {isRTL ? 'مركز المساعدة والاستفسارات' : 'Help & Support Center'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            {isRTL ? 'الأسئلة الشائعة والأجوبة' : 'Frequently Asked Questions'}
          </h1>

          <p className="text-sm text-gray-600 dark:text-[#AAB4C0] max-w-xl mx-auto leading-relaxed">
            {isRTL
              ? 'كل ما تريد معرفته عن خدمات الطباعة ثلاثية الأبعاد، الطلبات المخصصة، مواعيد الشحن وطرق الدفع المتاحة.'
              : 'Everything you need to know about Mixo 3D printing services, custom orders, shipping timelines, and payment options.'}
          </p>

          {/* Search Input */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                  isRTL ? 'right-4' : 'left-4'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'ابحث عن سؤالك هنا...' : 'Search for questions or answers...'}
                className={`w-full bg-white dark:bg-[#0F151D] border border-gray-200 dark:border-[#1E2630] rounded-2xl py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#7F8A96] focus:outline-none focus:border-[#FF1F3D] shadow-sm transition-colors ${
                  isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
                }`}
              />
            </div>
          </div>
        </div>

        {/* ── Category Selector Tabs ── */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#FF1F3D] text-white shadow-md shadow-red-600/20'
                  : 'bg-white dark:bg-[#0F151D] text-gray-700 dark:text-[#AAB4C0] hover:bg-gray-100 dark:hover:bg-[#151C24] border border-gray-200 dark:border-[#1E2630]'
              }`}
            >
              {isRTL ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* ── FAQs Accordion List ── */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white dark:bg-[#0F151D] p-12 text-center rounded-2xl border border-gray-200 dark:border-[#1E2630]">
              <HelpCircle size={44} className="mx-auto mb-3 text-gray-300 dark:text-[#26313D]" />
              <h3 className="text-base font-bold text-gray-800 dark:text-white">
                {isRTL ? 'لم نجد أي أسئلة مطابقة' : 'No matching questions found'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1">
                {isRTL
                  ? 'جرب البحث بكلمات أخرى أو تصفح التصنيفات المختلفة.'
                  : 'Try searching with different keywords or switch categories.'}
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const question = isRTL ? faq.questionAr || faq.questionEn : faq.questionEn || faq.questionAr;
              const answer = isRTL ? faq.answerAr || faq.answerEn : faq.answerEn || faq.answerAr;

              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-[#0F151D] rounded-2xl border border-gray-200 dark:border-[#1E2630] overflow-hidden transition-all duration-200 shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-gray-50/80 dark:hover:bg-[#151C24]/50 transition-colors"
                  >
                    <span className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                      {question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-[#151C24] flex items-center justify-center text-gray-500 dark:text-[#AAB4C0] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-red-500/10 text-[#FF1F3D]' : ''
                      }`}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-gray-100 dark:border-[#151C24]">
                      <p className="text-xs text-gray-600 dark:text-[#AAB4C0] leading-relaxed whitespace-pre-line">
                        {answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Still Have Questions Card ── */}
        <div className="bg-gradient-to-r from-[#FF1F3D]/10 via-[#0F151D] to-[#FF1F3D]/5 border border-[#FF1F3D]/20 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF1F3D] text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
            <MessageSquare size={24} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isRTL ? 'لم تجد الإجابة التي تبحث عنها؟' : 'Still have questions?'}
          </h2>

          <p className="text-xs text-gray-600 dark:text-[#AAB4C0] max-w-md mx-auto">
            {isRTL
              ? 'فريق دعم Mixo جاهز للرد على استفساراتك المخصصة ومساعدتك في تنفيذ مجسماتك.'
              : 'Our Mixo 3D support team is ready to assist you with custom orders and inquiries.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/custom-order"
              className="px-5 py-2.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
            >
              <span>{isRTL ? 'طلب مجسم مخصص 3D' : 'Request Custom 3D Order'}</span>
              {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </Link>

            <Link
              to="/contact"
              className="px-5 py-2.5 bg-white dark:bg-[#151C24] hover:bg-gray-100 dark:hover:bg-[#1E2630] border border-gray-200 dark:border-[#26313D] text-gray-800 dark:text-white rounded-xl text-xs font-bold transition-all"
            >
              {isRTL ? 'تواصل معنا' : 'Contact Support'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
