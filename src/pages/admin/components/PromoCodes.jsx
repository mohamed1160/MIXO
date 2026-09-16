import { useState, useMemo } from 'react';
import {
  Tag,
  Plus,
  X,
  Percent,
  Search,
  Calendar,
  Filter,
  RotateCcw,
  Download,
  Info,
  Edit2,
  Copy,
  Trash2,
  Check,
  DollarSign,
  PackageCheck,
  CalendarX,
  Sparkles,
  Truck,
  Layers,
} from 'lucide-react';
import { getAdminData } from '../../../services/adminMockData';

// Format helper for dates
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function PromoCodes() {
  const { promoCodes: initialCodes } = getAdminData();
  const [codes, setCodes] = useState(initialCodes);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');

  // Interactive Filter Menu Popover
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Date Range Filters
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    tag: 'Special Offer',
    type: 'percentage',
    value: '',
    minPurchase: '0',
    usageLimit: '100',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Show Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Derived Statistics
  const totalCount = codes.length;
  const activeCount = useMemo(() => codes.filter((c) => c.active).length, [codes]);
  const expiredCount = useMemo(() => codes.filter((c) => !c.active).length, [codes]);
  const totalUsed = useMemo(() => codes.reduce((sum, c) => sum + (c.usedCount || 0), 0), [codes]);
  const totalDiscountSaved = useMemo(() => {
    return codes.reduce((sum, c) => {
      const perUse = c.type === 'fixed' ? c.value : 50;
      return sum + (c.usedCount || 0) * perUse;
    }, 0);
  }, [codes]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Code', 'Description', 'Tag', 'Type', 'Value', 'Min Order', 'Used', 'Limit', 'Start Date', 'End Date', 'Status'];
    const rows = filteredCodes.map((c) => [
      c.code,
      `"${c.description || ''}"`,
      `"${c.tag || ''}"`,
      c.type,
      c.value,
      c.minPurchase,
      c.usedCount || 0,
      c.usageLimit || 0,
      c.startDate || '',
      c.endDate || '',
      c.active ? 'Active' : 'Expired',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MIXO_PromoCodes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Promo codes exported to CSV successfully! 📥');
  };

  // Handle Copy Code to Clipboard
  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    triggerToast(`Copied code "${code}" to clipboard! 📋`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete Code
  const handleDeleteCode = (id, codeName) => {
    if (window.confirm(`Are you sure you want to delete promo code "${codeName}"?`)) {
      setCodes((prev) => prev.filter((c) => c.id !== id));
      triggerToast(`Promo code "${codeName}" deleted. 🗑️`);
    }
  };

  // Filtered dataset
  const filteredCodes = useMemo(() => {
    return codes.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.tag && c.tag.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'All Status' ||
        (statusFilter === 'Active' && c.active) ||
        (statusFilter === 'Expired' && !c.active);

      const matchesType =
        typeFilter === 'All Types' ||
        (typeFilter === 'Percentage' && c.type === 'percentage') ||
        (typeFilter === 'Fixed Amount' && c.type === 'fixed') ||
        (typeFilter === 'Free Shipping' && c.type === 'freeship');

      let matchesDate = true;
      if (startDateFilter && c.startDate) {
        matchesDate = matchesDate && new Date(c.startDate) >= new Date(startDateFilter);
      }
      if (endDateFilter && c.endDate) {
        matchesDate = matchesDate && new Date(c.endDate) <= new Date(endDateFilter);
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [codes, searchQuery, statusFilter, typeFilter, startDateFilter, endDateFilter]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredCodes.length / itemsPerPage) || 1;
  const paginatedCodes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCodes.slice(start, start + itemsPerPage);
  }, [filteredCodes, currentPage]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setTypeFilter('All Types');
    setStartDateFilter('');
    setEndDateFilter('');
    setShowDatePicker(false);
    setShowFilterMenu(false);
    setCurrentPage(1);
    triggerToast('All filters have been reset. 🔄');
  };

  // Quick Select Discount Type from Filter Menu
  const handleSelectDiscountType = (typeName) => {
    setTypeFilter(typeName);
    setCurrentPage(1);
    triggerToast(`Filtered by ${typeName}! Found ${filteredCodes.length} codes. 🎯`);
  };

  // Create / Edit Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.code) return;

    const formattedCode = formData.code.toUpperCase().trim();

    if (editingCode) {
      setCodes((prev) =>
        prev.map((c) =>
          c.id === editingCode.id
            ? {
                ...c,
                code: formattedCode,
                description: formData.description || 'Promotional Discount',
                tag: formData.tag || 'Special Offer',
                type: formData.type,
                value: Number(formData.value) || 0,
                minPurchase: Number(formData.minPurchase) || 0,
                usageLimit: Number(formData.usageLimit) || 100,
                startDate: formData.startDate,
                endDate: formData.endDate,
              }
            : c
        )
      );
      triggerToast(`Promo code "${formattedCode}" updated successfully! ✨`);
    } else {
      const newEntry = {
        id: `promo-${Date.now()}`,
        code: formattedCode,
        description: formData.description || 'Promotional Discount',
        tag: formData.tag || 'Special Offer',
        type: formData.type,
        value: Number(formData.value) || 0,
        minPurchase: Number(formData.minPurchase) || 0,
        usageLimit: Number(formData.usageLimit) || 100,
        usedCount: 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        active: true,
        badgeColor: formData.type === 'percentage' ? 'purple' : formData.type === 'freeship' ? 'cyan' : 'orange',
      };
      setCodes([newEntry, ...codes]);
      triggerToast(`New promo code "${formattedCode}" created! 🎉`);
    }

    setShowModal(false);
    setEditingCode(null);
    setFormData({
      code: '',
      description: '',
      tag: 'Special Offer',
      type: 'percentage',
      value: '',
      minPurchase: '0',
      usageLimit: '100',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });
  };

  // Open Edit Modal
  const handleOpenEdit = (codeObj) => {
    setEditingCode(codeObj);
    setFormData({
      code: codeObj.code,
      description: codeObj.description || '',
      tag: codeObj.tag || 'Special Offer',
      type: codeObj.type || 'percentage',
      value: codeObj.value || '',
      minPurchase: codeObj.minPurchase || '0',
      usageLimit: codeObj.usageLimit || '100',
      startDate: codeObj.startDate ? codeObj.startDate.split('T')[0] : '',
      endDate: codeObj.endDate ? codeObj.endDate.split('T')[0] : '',
    });
    setShowModal(true);
  };

  // Badge Color Mapper for Code Pill
  const getCodeBadgeStyle = (codeObj) => {
    switch (codeObj.badgeColor || codeObj.type) {
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cyan':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'orange':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'amber':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'red':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'grey':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800 relative">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-gray-700 animate-bounce">
          <Sparkles size={16} className="text-[#C89A3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Breadcrumb & Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-gray-400 mb-1">
            Dashboard &gt; <span className="text-gray-700 font-semibold">Promo Codes</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Promo Codes</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create and manage discount codes and promotions
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Download size={15} />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingCode(null);
              setFormData({
                code: '',
                description: '',
                tag: 'Special Offer',
                type: 'percentage',
                value: '',
                minPurchase: '0',
                usageLimit: '100',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Promo Code</span>
          </button>
        </div>
      </div>

      {/* ── KPI Stat Cards (5 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Promo Codes */}
        <div
          onClick={() => {
            setStatusFilter('All Status');
            setTypeFilter('All Types');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'All Status' && typeFilter === 'All Types' ? 'border-[#C89A3D] shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Total Promo Codes</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Tag size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{totalCount}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">All promo codes</p>
            </div>
            <svg className="w-14 h-7 text-purple-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,15 Q10,5 20,12 T40,4 T50,10" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Active Codes */}
        <div
          onClick={() => {
            setStatusFilter('Active');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'Active' ? 'border-emerald-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Active Codes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{activeCount}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Currently active</p>
            </div>
            <svg className="w-14 h-7 text-emerald-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,18 Q12,10 25,14 T45,3 T50,7" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Used This Month */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Used This Month</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <PackageCheck size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{totalUsed}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Total uses</p>
            </div>
            <svg className="w-14 h-7 text-amber-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,12 Q15,18 28,8 T42,14 T50,4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Total Discount */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Total Discount</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-xl font-extrabold text-gray-900">EGP {totalDiscountSaved.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">This month</p>
            </div>
            <svg className="w-14 h-7 text-blue-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,16 Q10,6 22,12 T40,2 T50,8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: Expired Codes */}
        <div
          onClick={() => {
            setStatusFilter('Expired');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'Expired' ? 'border-rose-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Expired Codes</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <CalendarX size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{expiredCount}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">No longer active</p>
            </div>
            <svg className="w-14 h-7 text-rose-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,8 Q15,4 30,16 T45,12 T50,18" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3 relative">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89A3D] text-gray-700 placeholder-gray-400 bg-gray-50/50"
            />
          </div>

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
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>

          {/* Types Dropdown (Percentage, Fixed Amount, Free Shipping) */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 text-xs font-semibold border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            <option value="All Types">All Types (جميع أنواع الخصم)</option>
            <option value="Percentage">Percentage % (نسبة مئوية)</option>
            <option value="Fixed Amount">Fixed Amount EGP (مبلغ ثابت / فلوس)</option>
            <option value="Free Shipping">Free Shipping 🚚 (شحن مجاني)</option>
          </select>

          {/* Date Picker Button & Interactive Popup */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setShowFilterMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Calendar size={14} className="text-gray-400" />
              <span>
                {startDateFilter || endDateFilter
                  ? `${startDateFilter || 'Start'} to ${endDateFilter || 'End'}`
                  : 'May 1, 2024 - May 31, 2024'}
              </span>
            </button>

            {/* Interactive Date Range Popover */}
            {showDatePicker && (
              <div className="absolute top-11 left-0 z-40 bg-white border border-gray-200 p-4 rounded-2xl shadow-xl flex flex-col gap-3 min-w-[260px]">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-800">Select Date Range</span>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-gray-500 font-medium mb-1">Valid From (After):</label>
                    <input
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => {
                        setStartDateFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 font-medium mb-1">Valid Until (Before):</label>
                    <input
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => {
                        setEndDateFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStartDateFilter('');
                      setEndDateFilter('');
                    }}
                    className="text-gray-500 hover:underline text-[11px]"
                  >
                    Clear Dates
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="px-3 py-1 bg-[#C89A3D] text-white font-bold rounded-lg text-[11px]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reset Action Button */}
        <div className="flex items-center gap-2">
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
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    <span>Usage</span>
                    <Info size={13} className="text-gray-400 cursor-pointer" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Minimum Order</th>
                <th className="py-3.5 px-4">Valid From</th>
                <th className="py-3.5 px-4">Valid Until</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedCodes.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400 text-xs">
                    No promo codes found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedCodes.map((c) => {
                  const pct = c.usageLimit ? Math.min(100, Math.round(((c.usedCount || 0) / c.usageLimit) * 100)) : 0;
                  const isLimitReached = c.usedCount >= c.usageLimit;

                  return (
                    <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Code Badge */}
                      <td className="py-4 px-4 font-mono font-bold">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] border font-bold ${getCodeBadgeStyle(c)}`}>
                          {c.code}
                        </span>
                      </td>

                      {/* Description & Sub-tag */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-900">{c.description || 'Promotional Discount'}</span>
                          {c.tag && (
                            <span className="inline-block self-start text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-normal">
                              {c.tag}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Discount Label */}
                      <td className="py-4 px-4 font-semibold text-emerald-600">
                        {c.type === 'freeship'
                          ? 'Free Shipping'
                          : c.type === 'percentage'
                          ? `${c.value}% OFF`
                          : `EGP ${c.value} OFF`}
                      </td>

                      {/* Type Label */}
                      <td className="py-4 px-4 text-gray-600 capitalize font-medium">
                        {c.type === 'freeship' ? (
                          <span className="text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md font-bold text-[11px]">Free Shipping 🚚</span>
                        ) : c.type === 'percentage' ? (
                          <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-bold text-[11px]">Percentage %</span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold text-[11px]">Fixed Amount EGP</span>
                        )}
                      </td>

                      {/* Usage Progress */}
                      <td className="py-4 px-4 w-[160px]">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[11px] font-medium text-gray-600">
                            <span>
                              {c.usedCount || 0} / {c.usageLimit || '∞'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isLimitReached ? 'bg-purple-600' : 'bg-purple-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Minimum Order */}
                      <td className="py-4 px-4 text-gray-700 font-medium">
                        EGP {c.minPurchase ? c.minPurchase.toLocaleString() : 0}
                      </td>

                      {/* Valid From */}
                      <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                        {formatDate(c.startDate)}
                      </td>

                      {/* Valid Until */}
                      <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                        {formatDate(c.endDate)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {c.active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Expired
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(c)}
                            title="Edit"
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Copy Code */}
                          <button
                            type="button"
                            onClick={() => handleCopyCode(c.code, c.id)}
                            title="Copy Code"
                            className="p-1.5 text-gray-500 hover:text-[#C89A3D] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer relative"
                          >
                            {copiedId === c.id ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCode(c.id, c.code)}
                            title="Delete"
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
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

        {/* ── Table Footer & Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-700">{paginatedCodes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * itemsPerPage, filteredCodes.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-700">{filteredCodes.length}</span> promo codes
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#C89A3D] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

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

      {/* ── Modal Form for Create / Edit ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles size={18} className="text-[#C89A3D]" />
                {editingCode ? 'Edit Promo Code' : 'Create New Promo Code'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-xs">
              {/* Code Name */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Coupon Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER25"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 uppercase font-mono font-bold text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                />
              </div>

              {/* Description & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Description</label>
                  <input
                    type="text"
                    placeholder="10% off on all products"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Sub-tag / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Sale"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (EGP)</option>
                    <option value="freeship">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Discount Value {formData.type === 'percentage' ? '(%)' : '(EGP)'}
                  </label>
                  <input
                    type="number"
                    placeholder="15"
                    disabled={formData.type === 'freeship'}
                    value={formData.type === 'freeship' ? 0 : formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Min Purchase & Usage Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Minimum Order (EGP)</label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Valid From</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Valid Until</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {editingCode ? 'Update Code' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

