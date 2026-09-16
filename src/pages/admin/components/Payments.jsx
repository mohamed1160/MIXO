import React, { useState, useMemo, useRef, useEffect } from 'react';
import { getAdminData } from '../../../services/adminMockData';
import {
  Search,
  CreditCard,
  Banknote,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  Check,
  X,
  Filter,
  RotateCcw,
  Calendar as CalendarIcon,
  QrCode,
  Pencil,
} from 'lucide-react';

const GOLD = '#d99a3f';

/* ─────────────────────── Avatar ─────────────────────── */
function Avatar({ name = 'U', size = 32 }) {
  const safeName = name || 'U';
  const hue = (safeName.charCodeAt(0) * 47) % 360;
  const initials = safeName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `hsl(${hue} 60% 92%)`,
        color: `hsl(${hue} 55% 38%)`,
      }}
      className="rounded-full flex items-center justify-center font-semibold shrink-0"
    >
      {initials}
    </div>
  );
}

/* ─────────────────────── Status badge ─────────────────────── */
const STATUS_STYLES = {
  Pending: { bg: 'var(--admin-yellow-bg)', color: 'var(--admin-yellow)', sub: 'Awaiting verification' },
  Verified: { bg: 'var(--admin-green-bg)', color: 'var(--admin-green)', sub: 'Payment approved' },
  Rejected: { bg: 'var(--admin-red-bg)', color: 'var(--admin-red)', sub: 'Invalid transfer' },
};

function StatusCell({ status, onClick }) {
  if (status === 'COD') {
    return (
      <div className="leading-tight cursor-pointer hover:opacity-80" onClick={onClick} title="Click to set a payment status">
        <p className="text-xs" style={{ color: 'var(--admin-text-secondary)' }}>—</p>
        <p className="text-[10px]" style={{ color: 'var(--admin-text-secondary)' }}>COD Order</p>
      </div>
    );
  }
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <div className="leading-tight cursor-pointer hover:opacity-80" onClick={onClick} title="Click to edit payment status">
      <span
        className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
        style={{ background: s.bg, color: s.color }}
      >
        {status}
      </span>
      <p className="text-[10px] mt-1 pl-0.5" style={{ color: 'var(--admin-text-secondary)' }}>{s.sub}</p>
    </div>
  );
}

/* ─────────────────────── Method icon + cell ─────────────────────── */
function MethodIcon({ method }) {
  if (method === 'Instapay') return <RefreshCw size={13} style={{ color: '#7c6ef2' }} />;
  if (method === 'Vodafone Cash') return <CreditCard size={13} style={{ color: '#e2352e' }} />;
  return <Banknote size={13} style={{ color: '#2fbf82' }} />;
}

function MethodCell({ method }) {
  const isCOD = method === 'Cash on Delivery';
  return (
    <div className="flex flex-col gap-1 leading-tight">
      <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--admin-text)' }}>
        <MethodIcon method={method} />
        <span>{method}</span>
      </div>
      {isCOD ? (
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] w-max"
          style={{ background: 'var(--admin-bg)', color: 'var(--admin-text-secondary)', border: '1px solid var(--admin-border)' }}
        >
          COD
        </span>
      ) : (
        <>
          <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: '#7c6ef2' }}>
            {method === 'Instapay' ? 'INSTAPAY' : 'VODAFONE CASH'}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--admin-text-secondary)' }}>0100 123 4567</span>
        </>
      )}
    </div>
  );
}

/* ─────────────────────── Receipt thumbnail (mock transfer screenshot) ─────────────────────── */
function ReceiptThumbnail({ method, amount, onClick }) {
  if (method === 'Cash on Delivery') {
    return <span className="text-xs" style={{ color: 'var(--admin-text-secondary)' }}>—</span>;
  }
  const brand = method === 'Instapay' ? { label: 'INSTAPAY', color: '#7c6ef2', bg: '#f6f5ff', border: '#ece9fb' } : { label: 'VODAFONE CASH', color: '#e2352e', bg: '#fff5f5', border: '#fbdada' };

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-[150px] rounded-[10px] p-2.5 flex flex-col gap-1.5 text-left hover:opacity-90 transition-opacity"
      style={{ background: brand.bg, border: `1px solid ${brand.border}` }}
      title="View transfer screenshot"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black italic tracking-tight" style={{ color: brand.color }}>{brand.label}</span>
        <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: '#1f9a68' }}>
          <Check size={10} className="text-white" strokeWidth={3} />
        </span>
      </div>
      <div className="h-1.5 w-16 rounded-full" style={{ background: `${brand.color}22` }} />
      <div className="h-1.5 w-10 rounded-full" style={{ background: `${brand.color}22` }} />
      <span className="text-sm font-bold" style={{ color: brand.color }}>
        {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EGP
      </span>
    </button>
  );
}

export default function Payments() {
  /* Fetch mock data ONCE — calling getAdminData() on every render created a
     new `orders` array reference each time, which fed into the useEffect
     below and silently reset any Approve/Reject/manual edits right after
     they were made. */
  const [orders] = useState(() => getAdminData()?.orders || []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [datePreset, setDatePreset] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewReceipt, setPreviewReceipt] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const itemsPerPage = 6;
  const datePickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Build verification-ready payment records from orders, then keep as local editable state */
  const initialPayments = useMemo(() => {
    return orders.map((order) => {
      const method = order.paymentMethod || 'Cash on Delivery';
      let verificationStatus = 'COD';
      if (method !== 'Cash on Delivery') {
        if (order.paymentStatus === 'Paid') verificationStatus = 'Verified';
        else if (order.paymentStatus === 'Failed') verificationStatus = 'Rejected';
        else verificationStatus = 'Pending';
      }
      return {
        id: order.id,
        customerName: order.customer?.name || 'Unknown',
        customerPhone: order.customer?.phone || '',
        amount: order.total || 0,
        itemsCount: order.items ? order.items.length : 0,
        paymentMethod: method,
        verificationStatus,
        transferDate: order.createdAt || new Date().toISOString(),
      };
    });
  }, [orders]);

  const [payments, setPayments] = useState(initialPayments);

  /* ── Summary ── */
  const summary = useMemo(() => {
    return payments.reduce(
      (acc, p) => {
        if (p.verificationStatus === 'Pending') {
          acc.pendingCount++;
          acc.pendingAmount += p.amount;
        }
        if (p.verificationStatus === 'Verified') {
          acc.verifiedCount++;
          acc.verifiedAmount += p.amount;
        }
        if (p.verificationStatus === 'Rejected') {
          acc.rejectedCount++;
          acc.rejectedAmount += p.amount;
        }
        acc.totalCount++;
        acc.totalAmount += p.amount;
        return acc;
      },
      { pendingCount: 0, pendingAmount: 0, verifiedCount: 0, verifiedAmount: 0, rejectedCount: 0, rejectedAmount: 0, totalCount: 0, totalAmount: 0 }
    );
  }, [payments]);

  /* ── Filtering ── */
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        p.id.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        (p.customerPhone && p.customerPhone.includes(searchTerm));

      const matchMethod = filterMethod === 'All' || p.paymentMethod === filterMethod;
      const matchStatus = filterStatus === 'All' || p.verificationStatus === filterStatus;

      let matchDate = true;
      if (datePreset !== 'All') {
        const payDate = new Date(p.transferDate);
        const now = new Date();
        if (datePreset === '7d') {
          matchDate = payDate >= new Date(now.setDate(now.getDate() - 7));
        } else if (datePreset === '30d') {
          matchDate = payDate >= new Date(now.setDate(now.getDate() - 30));
        }
      }

      return matchSearch && matchMethod && matchStatus && matchDate;
    });
  }, [payments, searchTerm, filterMethod, filterStatus, datePreset]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
  const currentData = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterMethod('All');
    setFilterStatus('All');
    setDatePreset('All');
    setCurrentPage(1);
  };

  /* ── Approve / Reject ── */
  const handleApprove = (id) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, verificationStatus: 'Verified' } : p)));
  };
  const handleReject = (id) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, verificationStatus: 'Rejected' } : p)));
  };

  /* ── Manual status edit (any status, any row) ── */
  const handleSaveStatusEdit = (id, newStatus, newMethod) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, verificationStatus: newStatus, paymentMethod: newMethod }
          : p
      )
    );
    setEditingPayment(null);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { date: 'N/A', time: '' };
    return {
      date: d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage, '...', totalPages];
  }, [totalPages, currentPage]);

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: 'var(--admin-font)' }}>
      {/* ══ Breadcrumb & Header ══════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--admin-text-secondary)' }}>
          <span>Dashboard</span>
          <span>&gt;</span>
          <span style={{ color: 'var(--admin-text)' }}>Payments Verification</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--admin-text)', letterSpacing: '-0.01em' }}>
          Payment Verification
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--admin-text-secondary)' }}>
          Review and verify customer payments
        </p>
      </div>

      {/* ══ Metric Cards + Instapay Details ═════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-[14px] p-5 flex flex-col gap-3" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: '#ecebfd', color: 'var(--admin-purple, #7c6ef2)' }}>
            <Clock size={18} />
          </div>
          <div>
            <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--admin-text-secondary)' }}>Pending Payments</p>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{summary.pendingCount}</h3>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--admin-text-secondary)' }}>Awaiting verification</p>
        </div>

        <div className="rounded-[14px] p-5 flex flex-col gap-3" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: 'var(--admin-green-bg)', color: 'var(--admin-green)' }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--admin-text-secondary)' }}>Verified Today</p>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{summary.verifiedCount}</h3>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--admin-text-secondary)' }}>Total amount: EGP {summary.verifiedAmount.toLocaleString()}</p>
        </div>

        <div className="rounded-[14px] p-5 flex flex-col gap-3" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: 'var(--admin-red-bg)', color: 'var(--admin-red)' }}>
            <XCircle size={18} />
          </div>
          <div>
            <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--admin-text-secondary)' }}>Rejected Today</p>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{summary.rejectedCount}</h3>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--admin-text-secondary)' }}>Total amount: EGP {summary.rejectedAmount.toLocaleString()}</p>
        </div>

        <div className="rounded-[14px] p-5 flex flex-col gap-3" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: 'var(--admin-blue-bg)', color: 'var(--admin-blue)' }}>
            <Wallet size={18} />
          </div>
          <div>
            <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--admin-text-secondary)' }}>Total This Month</p>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{summary.totalCount}</h3>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--admin-text-secondary)' }}>Total amount: EGP {summary.totalAmount.toLocaleString()}</p>
        </div>

        {/* Instapay Details card */}
        <div className="rounded-[14px] p-4 flex flex-col gap-3" style={{ background: '#fdf7ea', border: '1px solid #f2e3bd' }}>
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-bold" style={{ color: 'var(--admin-text)' }}>Instapay Details</h4>
            <span className="text-[10px] font-black italic px-1.5 py-0.5 rounded" style={{ color: '#7c6ef2', background: '#f0eefd' }}>INSTAPAY</span>
          </div>
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--admin-text-secondary)' }}>Name</span>
              <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>MIXO Store</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--admin-text-secondary)' }}>Phone / ID</span>
              <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>0100 123 4567</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-[8px] hover:bg-white/60 transition-colors"
            style={{ border: '1px solid #f2e3bd', color: 'var(--admin-text)' }}
          >
            <QrCode size={14} />
            <span>View QR Code</span>
          </button>
        </div>
      </div>

      {/* ══ Filter Bar ═══════════════════════════════════════════════ */}
      <div
        className="p-3.5 rounded-[14px] flex flex-wrap items-center gap-2.5"
        style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}
      >
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--admin-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-[10px] focus:outline-none"
            style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 text-xs rounded-[10px] focus:outline-none cursor-pointer"
          style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={filterMethod}
          onChange={(e) => { setFilterMethod(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 text-xs rounded-[10px] focus:outline-none cursor-pointer"
          style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
        >
          <option value="All">All Payment Methods</option>
          <option value="Instapay">Instapay</option>
          <option value="Vodafone Cash">Vodafone Cash</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>

        <div className="relative" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => setShowDatePicker((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-[10px] transition-colors hover:bg-gray-50"
            style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
          >
            <span>{datePreset === '7d' ? 'Last 7 Days' : datePreset === '30d' ? 'Last 30 Days' : 'May 1, 2024 - May 31, 2024'}</span>
            <CalendarIcon size={13} style={{ color: 'var(--admin-text-secondary)' }} />
          </button>

          {showDatePicker && (
            <div
              className="absolute right-0 top-full mt-1.5 z-50 rounded-[12px] p-2 w-48 shadow-xl"
              style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)' }}
            >
              <div className="text-[11px] font-semibold px-3 py-1 text-gray-400">Filter Date Range</div>
              {[
                { label: 'All Time (May 2024)', value: 'All' },
                { label: 'Last 7 Days', value: '7d' },
                { label: 'Last 30 Days', value: '30d' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setDatePreset(opt.value); setShowDatePicker(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-[6px] hover:bg-gray-100 flex items-center justify-between"
                  style={{ color: 'var(--admin-text)' }}
                >
                  <span>{opt.label}</span>
                  {datePreset === opt.value && <Check size={13} className="text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCurrentPage(1)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[10px] transition-colors hover:bg-gray-50"
          style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
        >
          <Filter size={13} />
          <span>Filter</span>
        </button>

        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[10px] transition-colors hover:bg-gray-50"
          style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }}
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      {/* ══ Table ════════════════════════════════════════════════════ */}
      <div
        className="rounded-[14px] flex flex-col overflow-hidden"
        style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}
      >
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1050px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider" style={{ color: 'var(--admin-text-secondary)', borderBottom: '1px solid var(--admin-border)' }}>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Payment Method</th>
                <th className="py-3 px-4 font-semibold">Transfer Screenshot</th>
                <th className="py-3 px-4 font-semibold">Transfer Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((p, i) => {
                const { date, time } = formatDate(p.transferDate);
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors" style={{ borderTop: i === 0 ? 'none' : '1px solid var(--admin-border)' }}>
                    <td className="py-3.5 px-4 text-xs font-bold" style={{ color: 'var(--admin-text)' }}>{p.id}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={p.customerName} size={30} />
                        <div className="leading-tight">
                          <p className="text-xs font-bold" style={{ color: 'var(--admin-text)' }}>{p.customerName}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--admin-text-secondary)' }}>{p.customerPhone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-xs font-bold" style={{ color: 'var(--admin-text)' }}>
                        EGP {p.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--admin-text-secondary)' }}>{p.itemsCount} items</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <MethodCell method={p.paymentMethod} />
                    </td>

                    <td className="py-3.5 px-4">
                      <ReceiptThumbnail method={p.paymentMethod} amount={p.amount} onClick={() => setPreviewReceipt(p)} />
                    </td>

                    <td className="py-3.5 px-4 leading-tight text-xs">
                      <p className="font-semibold" style={{ color: 'var(--admin-text)' }}>{date}</p>
                      <p className="text-[10px]" style={{ color: 'var(--admin-text-secondary)' }}>{time}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusCell status={p.verificationStatus} onClick={() => setEditingPayment({ ...p })} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.verificationStatus === 'COD' ? (
                          <span className="text-xs mr-1" style={{ color: 'var(--admin-text-secondary)' }}>—</span>
                        ) : p.verificationStatus === 'Verified' ? (
                          <button
                            disabled
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-[8px] cursor-default"
                            style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }}
                          >
                            <Check size={12} />
                            Approved
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleApprove(p.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold rounded-[8px] transition-colors hover:bg-green-50"
                              style={{ border: '1px solid #b8e6cd', color: 'var(--admin-green)' }}
                            >
                              <Check size={12} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(p.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold rounded-[8px] transition-colors hover:bg-rose-50"
                              style={{ border: '1px solid #f6c7c5', color: 'var(--admin-red)' }}
                            >
                              <X size={12} />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setEditingPayment({ ...p })}
                          className="p-1.5 rounded-[8px] hover:bg-gray-100 transition-colors"
                          style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }}
                          title="Edit payment status manually"
                        >
                          <Pencil size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
                    No payments found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 flex items-center justify-between text-xs flex-wrap gap-3" style={{ borderTop: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }}>
          <div>
            Showing <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>
              {filteredPayments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span> to{' '}
            <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>
              {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
            </span> of{' '}
            <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>{filteredPayments.length}</span> payments
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-[8px] flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
              style={{ border: '1px solid var(--admin-border)' }}
            >
              <ChevronLeft size={14} />
            </button>

            {pageNumbers.map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === 'number' && setCurrentPage(p)}
                disabled={p === '...'}
                className="w-7 h-7 rounded-[8px] flex items-center justify-center text-xs font-semibold transition-colors"
                style={{
                  background: currentPage === p ? GOLD : 'transparent',
                  color: currentPage === p ? '#ffffff' : 'var(--admin-text)',
                  border: currentPage === p ? 'none' : p === '...' ? 'none' : '1px solid var(--admin-border)',
                  cursor: p === '...' ? 'default' : 'pointer',
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-[8px] flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
              style={{ border: '1px solid var(--admin-border)' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ══ Receipt Preview Modal ═══════════════════════════════════════ */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="w-full max-w-xs rounded-[16px] p-5 shadow-2xl flex flex-col gap-4"
            style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', fontFamily: 'var(--admin-font)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold" style={{ color: 'var(--admin-text)' }}>Transfer Screenshot</h3>
              <button onClick={() => setPreviewReceipt(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>
            <ReceiptThumbnail method={previewReceipt.paymentMethod} amount={previewReceipt.amount} onClick={() => {}} />
            <div className="text-xs flex flex-col gap-1" style={{ color: 'var(--admin-text-secondary)' }}>
              <div className="flex justify-between"><span>Order</span><span className="font-semibold" style={{ color: 'var(--admin-text)' }}>{previewReceipt.id}</span></div>
              <div className="flex justify-between"><span>Customer</span><span className="font-semibold" style={{ color: 'var(--admin-text)' }}>{previewReceipt.customerName}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Edit Payment Status Modal ════════════════════════════════════ */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-sm rounded-[16px] p-5 shadow-xl flex flex-col gap-4"
            style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', fontFamily: 'var(--admin-font)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--admin-border)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--admin-text)' }}>Edit Payment: {editingPayment.id}</h3>
              <button onClick={() => setEditingPayment(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block mb-1 font-medium" style={{ color: 'var(--admin-text-secondary)' }}>Payment Method</label>
                <select
                  value={editingPayment.paymentMethod}
                  onChange={(e) => {
                    const method = e.target.value;
                    setEditingPayment((prev) => ({
                      ...prev,
                      paymentMethod: method,
                      verificationStatus: method === 'Cash on Delivery' ? 'COD' : (prev.verificationStatus === 'COD' ? 'Pending' : prev.verificationStatus),
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-[8px] focus:outline-none"
                  style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                >
                  <option value="Instapay">Instapay</option>
                  <option value="Vodafone Cash">Vodafone Cash</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: 'var(--admin-text-secondary)' }}>Payment Status</label>
                {editingPayment.paymentMethod === 'Cash on Delivery' ? (
                  <div
                    className="w-full px-3 py-2 rounded-[8px] text-xs"
                    style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }}
                  >
                    COD orders don't need verification
                  </div>
                ) : (
                  <select
                    value={editingPayment.verificationStatus}
                    onChange={(e) => setEditingPayment({ ...editingPayment, verificationStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-[8px] focus:outline-none"
                    style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--admin-border)' }}>
                <button
                  onClick={() => setEditingPayment(null)}
                  className="px-3 py-1.5 rounded-[8px]"
                  style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveStatusEdit(editingPayment.id, editingPayment.verificationStatus, editingPayment.paymentMethod)}
                  className="px-4 py-1.5 rounded-[8px] font-semibold text-white"
                  style={{ background: GOLD }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ QR Code Modal ═══════════════════════════════════════════════ */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="w-full max-w-xs rounded-[16px] p-6 shadow-2xl flex flex-col items-center gap-4 text-center"
            style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', fontFamily: 'var(--admin-font)' }}
          >
            <div className="flex items-center justify-between w-full">
              <h3 className="text-sm font-bold" style={{ color: 'var(--admin-text)' }}>Instapay QR Code</h3>
              <button onClick={() => setShowQrModal(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>

            {/* Decorative QR placeholder */}
            <div
              className="w-40 h-40 rounded-[10px] grid grid-cols-8 grid-rows-8 gap-[2px] p-2"
              style={{ background: '#fff', border: '1px solid var(--admin-border)' }}
            >
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} style={{ background: (i * 17 + Math.floor(i / 8) * 5) % 3 === 0 ? '#14131b' : 'transparent' }} />
              ))}
            </div>

            <div className="text-xs">
              <p className="font-semibold" style={{ color: 'var(--admin-text)' }}>MIXO Store</p>
              <p style={{ color: 'var(--admin-text-secondary)' }}>0100 123 4567</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
