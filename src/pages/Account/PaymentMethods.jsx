import { useState } from 'react';
import { CreditCard, Plus, Trash2, Check, Sparkles, X, Smartphone, Globe, Shield } from 'lucide-react';

const INITIAL_METHODS = [
  {
    id: 'PM-1',
    type: 'Vodafone Cash',
    title: 'Vodafone Cash Wallet',
    details: '01012345678',
    isDefault: true,
    badgeColor: 'bg-rose-50 text-rose-600 border-rose-200',
  },
  {
    id: 'PM-2',
    type: 'InstaPay',
    title: 'InstaPay Handle',
    details: 'mohamed@instapay',
    isDefault: false,
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
  },
];

export default function PaymentMethods() {
  const [methods, setMethods] = useState(INITIAL_METHODS);
  const [toastMessage, setToastMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [methodForm, setMethodForm] = useState({
    type: 'Vodafone Cash',
    title: 'Vodafone Cash Wallet',
    details: '01000000000',
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSetDefault = (id) => {
    setMethods(methods.map((m) => ({ ...m, isDefault: m.id === id })));
    triggerToast('Default payment method updated! 📌');
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Remove payment method "${title}"?`)) {
      setMethods(methods.filter((m) => m.id !== id));
      triggerToast(`Payment method removed. 🗑️`);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newM = {
      id: `PM-${Date.now().toString().slice(-4)}`,
      ...methodForm,
      isDefault: false,
      badgeColor: methodForm.type === 'Vodafone Cash' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-purple-50 text-purple-600 border-purple-200',
    };
    setMethods([...methods, newM]);
    setIsModalOpen(false);
    triggerToast('New payment method added! 💳');
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-gray-700 animate-bounce">
          <Sparkles size={16} className="text-[#C89A3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900">Payment Methods</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your saved mobile wallets and InstaPay handles</p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={15} className="text-[#C89A3D]" />
          <span>Add Payment Method</span>
        </button>
      </div>

      {/* Methods Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {methods.map((m) => (
          <div
            key={m.id}
            className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
              m.isDefault
                ? 'border-[#C89A3D] shadow-sm bg-[#FAF6EC]/30'
                : 'border-gray-100 shadow-2xs hover:shadow-md'
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${m.badgeColor}`}>
                  {m.type}
                </span>

                {m.isDefault ? (
                  <span className="px-2 py-0.5 bg-[#C89A3D] text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                    Default
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(m.id)}
                    className="text-[11px] font-bold text-gray-400 hover:text-[#C89A3D]"
                  >
                    Set Default
                  </button>
                )}
              </div>

              <div className="flex flex-col text-xs text-gray-600 gap-1 border-t border-gray-100 pt-3">
                <p className="font-bold text-gray-900 text-sm">{m.title}</p>
                <p className="font-mono font-bold text-[#C89A3D] text-xs">{m.details}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              {!m.isDefault && (
                <button
                  type="button"
                  onClick={() => handleDelete(m.id, m.title)}
                  className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Method"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={18} className="text-[#C89A3D]" />
                <span>Add New Payment Method</span>
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Payment Type</label>
                <select
                  value={methodForm.type}
                  onChange={(e) => setMethodForm({ ...methodForm, type: e.target.value, title: `${e.target.value} Account` })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D] cursor-pointer"
                >
                  <option value="Vodafone Cash">Vodafone Cash Wallet</option>
                  <option value="InstaPay">InstaPay Handle</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Wallet Phone or InstaPay Handle</label>
                <input
                  type="text"
                  required
                  placeholder="010... or user@instapay"
                  value={methodForm.details}
                  onChange={(e) => setMethodForm({ ...methodForm, details: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-mono font-bold focus:outline-none focus:border-[#C89A3D]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl shadow-xs"
                >
                  Save Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
