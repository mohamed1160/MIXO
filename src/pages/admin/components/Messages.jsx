import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Trash2, Eye, ExternalLink, Printer, Send, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    name: 'أحمد محمود',
    email: 'ahmed@example.com',
    phone: '01012345678',
    subject: 'طلب تسعير طباعة مجسم مفصلي خاص 3D',
    message: 'مرحباً، أريد طباعة هذا الموديل بحجم 25 سم باستخدام خامة PLA Silk باللون الذهبي الأسود. كم تكلفتها وميعاد التسليم؟',
    link: 'https://makerworld.com/en/models/12345',
    type: 'custom_quote',
    status: 'unread',
    date: '2026-09-15 14:30'
  },
  {
    id: 'msg-2',
    name: 'مي مصطفى',
    email: 'mai@example.com',
    phone: '01198765432',
    subject: 'استفسار عن توافر فيلامينت PETG شفاف',
    message: 'هل متوفر فيلامينت PETG شفاف 1.75mm في المخزن حالياً؟ ومتى تتوفر الألوان الخشبية؟',
    type: 'general',
    status: 'read',
    date: '2026-09-14 11:15'
  }
];

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const loaded = localStorage.getItem('MIXO_contact_messages');
    if (loaded) {
      try {
        setMessages(JSON.parse(loaded));
      } catch (e) {
        setMessages(INITIAL_MESSAGES);
        localStorage.setItem('MIXO_contact_messages', JSON.stringify(INITIAL_MESSAGES));
      }
    } else {
      setMessages(INITIAL_MESSAGES);
      localStorage.setItem('MIXO_contact_messages', JSON.stringify(INITIAL_MESSAGES));
    }
  }, []);

  const saveMessages = (updated) => {
    setMessages(updated);
    localStorage.setItem('MIXO_contact_messages', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleMarkAsRead = (msgId) => {
    const updated = messages.map(m => m.id === msgId ? { ...m, status: 'read' } : m);
    saveMessages(updated);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    toast.success('تم إرسال الرد للعميل وتحديث حالة الرسالة إلى مُجابة');
    const updated = messages.map(m => m.id === selectedMessage.id ? { ...m, status: 'read' } : m);
    saveMessages(updated);
    setReplyText('');
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (msgId) => {
    if (window.confirm('هل أنت متاكد من حذف هذه الرسالة؟')) {
      const updated = messages.filter(m => m.id !== msgId);
      saveMessages(updated);
      toast.success('تم حذف الرسالة بنجاح');
      if (selectedMessage?.id === msgId) setSelectedMessage(null);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch =
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.message || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.phone || '').includes(search);

    if (!matchesSearch) return false;
    if (filterTab === 'all') return true;
    if (filterTab === 'unread') return m.status === 'unread';
    if (filterTab === 'custom_quote') return m.type === 'custom_quote';
    return true;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="p-4 md:p-6 space-y-6 text-gray-900 dark:text-white min-h-screen dir-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-[#FF1F3D]" />
            رسائل وطلبات العملاء
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            متابعة رسائل نموذج التواصل واستفسارات تسعير المجسمات 3D
          </p>
        </div>

        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-xl text-left shadow-xs">
          <div className="text-xs text-gray-500 dark:text-gray-400">رسائل غير مقروءة</div>
          <div className="text-lg font-extrabold text-[#FF1F3D]">{unreadCount} رسائل جديدة</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'جميع الرسائل' },
            { id: 'unread', label: `غير مقروء (${unreadCount})` },
            { id: 'custom_quote', label: 'طلبات تسعير 3D 🎨' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-[#FF1F3D] text-white font-bold shadow-md'
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
            placeholder="بحث في الرسائل والأسماء..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMessages.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400">
            لا توجد رسائل مطابقة للفلتر المحـدد
          </div>
        ) : (
          filteredMessages.map(msg => {
            const isUnread = msg.status === 'unread';
            const isCustom = msg.type === 'custom_quote';

            return (
              <div
                key={msg.id}
                className={`bg-white dark:bg-[#121923] border rounded-2xl p-5 space-y-3 transition-all shadow-xs ${
                  isUnread
                    ? 'border-[#FF1F3D] ring-1 ring-[#FF1F3D]/20 bg-red-50/30 dark:bg-gradient-to-br dark:from-[#1A131A] dark:to-[#121923]'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#1A2332] border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-gray-900 dark:text-white text-sm">
                      {(msg.name || 'U').charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        {msg.name}
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#FF1F3D] animate-pulse"></span>
                        )}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-[11px] flex items-center gap-2 mt-0.5">
                        <span>{msg.date}</span>
                        <span>•</span>
                        <span dir="ltr" className="font-mono text-gray-700 dark:text-gray-300">{msg.phone}</span>
                      </div>
                    </div>
                  </div>

                  {isCustom ? (
                    <span className="px-2.5 py-1 bg-[#FF1F3D]/15 text-[#FF1F3D] border border-[#FF1F3D]/30 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <Printer className="w-3 h-3" />
                      طلب 3D
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold">
                      استفسار
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-xs mb-1">{msg.subject}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>

                {msg.link && (
                  <a
                    href={msg.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#FF1F3D] hover:underline font-bold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    رابط الموديل المرفق (MakerWorld)
                  </a>
                )}

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'unread') handleMarkAsRead(msg.id);
                    }}
                    className="px-4 py-1.5 bg-gray-100 dark:bg-[#1A2332] hover:bg-[#FF1F3D] text-gray-700 dark:text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    قراءة والرد
                  </button>

                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="p-1.5 bg-gray-100 dark:bg-[#1A2332] hover:bg-red-600 text-gray-600 dark:text-gray-400 hover:text-white rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Modal & Quick Reply */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg p-6 space-y-5 text-gray-900 dark:text-white dir-rtl relative shadow-2xl">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute left-5 top-5 p-2 rounded-full bg-gray-100 dark:bg-[#1A2332] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
              <MessageSquare className="w-6 h-6 text-[#FF1F3D]" />
              {selectedMessage.subject}
            </h2>

            <div className="bg-gray-50 dark:bg-[#1A2332] rounded-2xl p-4 space-y-2 border border-gray-200 dark:border-gray-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white text-sm">{selectedMessage.name}</span>
                <span className="text-gray-500 dark:text-gray-400">{selectedMessage.date}</span>
              </div>
              <div className="text-gray-600 dark:text-gray-300 flex items-center gap-4">
                <span>البريد: {selectedMessage.email || 'غير مدخل'}</span>
                <span dir="ltr">الهاتف: {selectedMessage.phone || 'غير مسجل'}</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#16202E] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs leading-relaxed text-gray-800 dark:text-gray-200">
              <div className="text-gray-500 dark:text-gray-400 text-[10px] mb-1 font-bold">مضمون الرسالة:</div>
              {selectedMessage.message}
            </div>

            {selectedMessage.link && (
              <a
                href={selectedMessage.link}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#FF1F3D]/10 border border-[#FF1F3D]/30 rounded-xl text-xs font-bold text-[#FF1F3D] flex items-center justify-between hover:bg-[#FF1F3D]/20 transition-all"
              >
                <span>رابط المجسم المطلوب للمعاينة والتسعير</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <form onSubmit={handleSendReply} className="space-y-3">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">كتابة رد مباشر للعميل:</label>
              <textarea
                rows="3"
                placeholder="اكتب ردك للعميل هنا (سيتم إرسالها وتحديث الحالة)..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  إرسال الرد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
