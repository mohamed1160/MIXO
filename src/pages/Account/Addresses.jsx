import { useState } from 'react';
import { MapPin, Plus, Edit3, Trash2, Check, Sparkles, X, Building, Phone, User } from 'lucide-react';
import { GOVERNORATE_RATES } from '../../utils/shippingRates';

import { useAuthStore } from '../../store/useAuthStore';

const DEFAULT_FALLBACK_ADDRESSES = [];

export default function Addresses() {
  const { user } = useAuthStore();
  const userEmailKey = user?.email ? user.email.toLowerCase() : 'guest';

  const [addresses, setAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem(`MIXO_user_addresses_${userEmailKey}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const userFullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';

  const [addressForm, setAddressForm] = useState({
    title: 'Home',
    fullName: userFullName || '',
    phone: user?.phone || '',
    street: '',
    city: 'Cairo',
    governorate: 'Cairo',
    isDefault: false,
  });

  const persistAddresses = (newAddresses) => {
    setAddresses(newAddresses);
    try {
      localStorage.setItem(`MIXO_user_addresses_${userEmailKey}`, JSON.stringify(newAddresses));
      localStorage.setItem('MIXO_current_user_addresses', JSON.stringify(newAddresses));
    } catch (e) {
      console.error(e);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    persistAddresses(updated);
    triggerToast('Default shipping address updated! 📌');
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete address "${title}"?`)) {
      const updated = addresses.filter((a) => a.id !== id);
      persistAddresses(updated);
      triggerToast(`Address "${title}" deleted. 🗑️`);
    }
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setAddressForm({
      title: 'Home',
      fullName: userFullName || 'Mohamed Ahmed',
      phone: user?.phone || '+20 012 345 6789',
      street: '',
      city: 'Cairo',
      governorate: 'Cairo',
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      title: addr.title,
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      governorate: addr.governorate,
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    let updated;
    if (editingAddress) {
      updated = addresses.map((a) =>
        a.id === editingAddress.id ? { ...a, ...addressForm } : a
      );
      triggerToast(`Address "${addressForm.title}" updated! 🏡`);
    } else {
      const newAddr = {
        id: `ADDR-${Date.now().toString().slice(-4)}`,
        ...addressForm,
      };
      if (addressForm.isDefault) {
        updated = addresses.map((a) => ({ ...a, isDefault: false }));
        updated.push(newAddr);
      } else {
        updated = [...addresses, newAddr];
      }
      triggerToast(`New shipping address added! 📍`);
    }
    persistAddresses(updated);
    setIsModalOpen(false);
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
          <h2 className="text-xl font-serif font-bold text-gray-900">Saved Addresses</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your shipping and delivery addresses</p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={15} className="text-[#C89A3D]" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
              addr.isDefault
                ? 'border-[#C89A3D] shadow-sm bg-[#FAF6EC]/30'
                : 'border-gray-100 shadow-2xs hover:shadow-md'
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#C89A3D]" />
                  <span className="font-bold text-gray-900 text-sm">{addr.title}</span>
                </div>

                {addr.isDefault ? (
                  <span className="px-2.5 py-0.5 bg-[#C89A3D] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Default
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[11px] font-bold text-gray-400 hover:text-[#C89A3D] transition-colors"
                  >
                    Set as Default
                  </button>
                )}
              </div>

              <div className="flex flex-col text-xs text-gray-600 gap-1 border-t border-gray-100 pt-3">
                <p className="font-bold text-gray-900">{addr.fullName}</p>
                <p className="font-mono text-gray-500">{addr.phone}</p>
                <p className="text-gray-700">{addr.street}</p>
                <p className="font-semibold text-gray-800">{addr.city}, {addr.governorate}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => handleOpenEdit(addr)}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Edit Address"
              >
                <Edit3 size={15} />
              </button>

              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id, addr.title)}
                  className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Address"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-[#C89A3D]" />
                <span>{editingAddress ? 'Edit Address' : 'Add New Shipping Address'}</span>
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Address Label / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home, Work, Summer House"
                  value={addressForm.title}
                  onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-semibold focus:outline-none focus:border-[#C89A3D]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-mono font-semibold focus:outline-none focus:border-[#C89A3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Street Address & Building</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building 12, 90th Street, Apt 4"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-medium focus:outline-none focus:border-[#C89A3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">City / District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Cairo"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-semibold focus:outline-none focus:border-[#C89A3D]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Governorate</label>
                  <select
                    value={addressForm.governorate}
                    onChange={(e) => setAddressForm({ ...addressForm, governorate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D] cursor-pointer"
                  >
                    {Object.keys(GOVERNORATE_RATES).map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Save Address</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

