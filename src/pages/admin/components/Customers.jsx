import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Trash2, Users, Mail, Phone, UserCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_CUSTOMERS = [
  {
    id: 'usr-1',
    name: 'محمد أحمد (الأدمن الرئيسي)',
    email: 'admin@gmail.com',
    phone: '01000000000',
    role: 'admin',
    joinedDate: '2026-08-15',
    ordersCount: 14,
    totalSpent: 6450
  },
  {
    id: 'usr-2',
    name: 'سارة علي',
    email: 'sara.ali@example.com',
    phone: '01123456789',
    role: 'customer',
    joinedDate: '2026-09-02',
    ordersCount: 3,
    totalSpent: 1250
  },
  {
    id: 'usr-3',
    name: 'عمر خالد',
    email: 'omar.khalid@example.com',
    phone: '01298765432',
    role: 'customer',
    joinedDate: '2026-09-08',
    ordersCount: 5,
    totalSpent: 2800
  },
  {
    id: 'usr-4',
    name: 'ياسمين ممدوح',
    email: 'yasmin.m@example.com',
    phone: '01511223344',
    role: 'customer',
    joinedDate: '2026-09-12',
    ordersCount: 2,
    totalSpent: 900
  }
];

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loaded = localStorage.getItem('MIXO_users');
    if (loaded) {
      try {
        setCustomers(JSON.parse(loaded));
      } catch (e) {
        setCustomers(INITIAL_CUSTOMERS);
        localStorage.setItem('MIXO_users', JSON.stringify(INITIAL_CUSTOMERS));
      }
    } else {
      setCustomers(INITIAL_CUSTOMERS);
      localStorage.setItem('MIXO_users', JSON.stringify(INITIAL_CUSTOMERS));
    }
  }, []);

  const saveCustomers = (updated) => {
    setCustomers(updated);
    localStorage.setItem('MIXO_users', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const toggleAdminRole = (userId) => {
    const updated = customers.map(u => {
      if (u.id === userId) {
        const newRole = u.role === 'admin' ? 'customer' : 'admin';
        toast.success(`تم تغيير صلاحيات المستخدم إلى (${newRole})`);
        return { ...u, role: newRole };
      }
      return u;
    });
    saveCustomers(updated);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('هل أنت متاكد من حذف هذا الحساب نهائياً؟')) {
      const updated = customers.filter(u => u.id !== userId);
      saveCustomers(updated);
      toast.success('تم حذف المستخدم بنجاح');
    }
  };

  const filteredCustomers = customers.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  return (
    <div className="p-4 md:p-6 space-y-6 text-gray-900 dark:text-white min-h-screen dir-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-[#FF1F3D]" />
            إدارة العملاء والمستخدمين
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            عرض قائمة الحسابات المسجلة وصلاحيات لوحة التحكم
          </p>
        </div>

        <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-xl text-left shadow-xs">
          <div className="text-xs text-gray-500 dark:text-gray-400">إجمالي الحسابات المسجلة</div>
          <div className="text-lg font-extrabold text-[#FF1F3D]">{customers.length} عميل</div>
        </div>
      </div>

      {/* Control & Search */}
      <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث بالاسم، البريد الإلكتروني أو الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF1F3D]"></span>
            مدير أدمن: {customers.filter(c => c.role === 'admin').length}
          </span>
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            عملاء: {customers.filter(c => c.role === 'customer').length}
          </span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-[#1A2332] text-gray-700 dark:text-gray-300 text-xs border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-semibold">المستخدم</th>
                <th className="p-4 font-semibold">بيانات التواصل</th>
                <th className="p-4 font-semibold">الصلاحية</th>
                <th className="p-4 font-semibold">تاريخ الانضمام</th>
                <th className="p-4 font-semibold">عدد الطلبات</th>
                <th className="p-4 font-semibold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    لا يوجد مستخدمين مطابقين للبحث
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => {
                  const isAdmin = customer.role === 'admin';
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-[#16202E] transition-colors">
                      {/* Name & Avatar */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                            isAdmin ? 'bg-[#FF1F3D] text-white' : 'bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          }`}>
                            {(customer.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white text-sm">{customer.name}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-[11px] font-mono">{customer.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="p-4">
                        <div className="text-gray-700 dark:text-gray-200 flex items-center gap-1.5 font-medium">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {customer.email || 'غير مدخل'}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-[11px] flex items-center gap-1.5 mt-1 font-mono" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-[#FF1F3D]" />
                          {customer.phone || 'غير مسجل'}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF1F3D]/15 text-[#FF1F3D] border border-[#FF1F3D]/30 rounded-full text-[11px] font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            مدير (Admin)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-[11px] font-medium border border-gray-200 dark:border-gray-700">
                            <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                            عميل متجر
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">
                        {customer.joinedDate || '2026-09-01'}
                      </td>

                      {/* Orders & Spent */}
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white">{customer.ordersCount || 0} طلبات</div>
                        <div className="text-[#FF1F3D] text-[11px] font-bold">
                          {(customer.totalSpent || 0).toLocaleString()} ج.م
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleAdminRole(customer.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isAdmin
                                ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                : 'bg-[#FF1F3D]/15 hover:bg-[#FF1F3D] text-[#FF1F3D] hover:text-white'
                            }`}
                          >
                            {isAdmin ? 'إلغاء الأدمن' : 'ترقية لأدمن'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(customer.id)}
                            className="p-2 bg-gray-100 dark:bg-[#1A2332] hover:bg-red-600 text-gray-600 dark:text-gray-400 hover:text-white rounded-lg transition-all cursor-pointer"
                            title="حذف الحساب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}