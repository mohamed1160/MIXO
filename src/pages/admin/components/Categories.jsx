import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Edit2,
  Trash2,
  Eye,
  Plus,
  Grid3x3,
  Folder,
  EyeOff,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GripVertical,
  ArrowUpAZ,
  Boxes,
  ListOrdered,
} from 'lucide-react';
import { getAdminData } from '../../../services/adminMockData';
import { saveCustomCategory } from '../../../services/products';

const GOLD = '#d99a3f';

/* ─────────────────────── Sparkline ─────────────────────── */
function Sparkline({ color }) {
  const paths = [
    'M2 18 Q10 6, 18 14 T34 8 T50 2',
    'M2 16 Q10 18, 18 10 T34 12 T50 4',
    'M2 8 Q10 16, 18 10 T34 16 T50 6',
  ];
  const d = paths[Math.abs(color.charCodeAt(1) || 0) % paths.length];
  return (
    <svg className="w-14 h-7 overflow-visible shrink-0" viewBox="0 0 52 22" fill="none">
      <path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ─────────────────────── Toggle switch ─────────────────────── */
function ToggleSwitch({ checked, onChange, title }) {
  return (
    <button
      type="button"
      onClick={onChange}
      title={title}
      className="w-9 h-5 rounded-full flex items-center transition-colors shrink-0"
      style={{ background: checked ? '#22b573' : '#d7dade', padding: 2 }}
    >
      <span
        className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: checked ? 'translateX(16px)' : 'translateX(0px)' }}
      />
    </button>
  );
}

const emptyForm = { name: '', description: '', icon: '🏷️', status: 'Active' };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('order');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const pageSize = 8;
  const filterMenuRef = useRef(null);

  useEffect(() => {
    const data = getAdminData();
    setCategories([...(data.categories || [])].sort((a, b) => (a.order || 0) - (b.order || 0)));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) setFilterMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Hidden' : 'Active' } : c))
    );
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setConfirmDelete(null);
  };

  /* ── View ── */
  const openViewModal = (cat) => {
    setViewingCategory(cat);
    setShowViewModal(true);
  };

  /* ── Drag & drop reorder (only meaningful on the unfiltered, order-sorted list) ── */
  const canReorder = sortBy === 'order' && statusFilter === 'All' && !searchTerm.trim();
  const handleDragStart = (id) => (e) => {
    if (!canReorder) return;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e) => {
    if (!canReorder) return;
    e.preventDefault();
  };
  const handleDrop = (targetId) => (e) => {
    e.preventDefault();
    if (!canReorder || !draggedId || draggedId === targetId) { setDraggedId(null); return; }
    setCategories((prev) => {
      const list = [...prev].sort((a, b) => (a.order || 0) - (b.order || 0));
      const fromIdx = list.findIndex((c) => c.id === draggedId);
      const toIdx = list.findIndex((c) => c.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return list.map((c, i) => ({ ...c, order: i + 1 }));
    });
    setDraggedId(null);
  };

  /* ── Add / Edit ── */
  const openAddModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setShowFormModal(true);
  };
  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      icon: cat.icon || '🏷️',
      status: cat.status || 'Active',
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingCategory) {
      setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? { ...c, ...form } : c)));
    } else {
      const nextOrder = categories.length ? Math.max(...categories.map((c) => c.order || 0)) + 1 : 1;
      const newCategory = {
        id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        ...form,
        productsCount: 0,
        subcategoriesCount: 0,
        order: nextOrder,
      };
      setCategories((prev) => [...prev, newCategory]);
      saveCustomCategory(form.name, form.icon || '🏷️');
    }
    setShowFormModal(false);
    setForm(emptyForm);
    setEditingCategory(null);
  };

  /* ── Filtering & sorting ── */
  const filteredCategories = useMemo(() => {
    const filtered = categories.filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        (c.name?.toLowerCase() || '').includes(q) ||
        (c.description?.toLowerCase() || '').includes(q) ||
        (c.id?.toLowerCase?.() || '').includes(q);
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered];
    if (sortBy === 'name') sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sortBy === 'products') sorted.sort((a, b) => (b.productsCount || 0) - (a.productsCount || 0));
    else if (sortBy === 'subcategories') sorted.sort((a, b) => (b.subcategoriesCount || 0) - (a.subcategoriesCount || 0));
    else sorted.sort((a, b) => (a.order || 0) - (b.order || 0));
    return sorted;
  }, [categories, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage, '...', totalPages];
  }, [totalPages, currentPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSortBy('order');
  };

  /* ── Stats ── */
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === 'Active').length;
  const hiddenCategories = categories.filter((c) => c.status !== 'Active').length;
  const totalSubcategories = categories.reduce((s, c) => s + (c.subcategoriesCount || 0), 0);

  return (
    <div className="w-full h-full flex flex-col gap-6" style={{ fontFamily: 'var(--admin-font)', color: 'var(--admin-text)' }}>
      {/* ══ Header ══════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--admin-text-secondary)' }}>Manage and organize your product categories</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
          style={{ background: GOLD }}
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* ══ Summary Cards ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Categories', value: totalCategories, icon: Grid3x3, color: '#7c6ef2', bg: '#f1eefd', sub: 'All categories' },
          { title: 'Active Categories', value: activeCategories, icon: Folder, color: '#22b573', bg: '#e3f8ec', sub: 'Visible on store' },
          { title: 'Hidden Categories', value: hiddenCategories, icon: EyeOff, color: '#f0a45c', bg: '#fef3e7', sub: 'Not visible' },
          { title: 'Total Subcategories', value: totalSubcategories, icon: Layers, color: '#5b8def', bg: '#ebf2ff', sub: 'In all categories' },
        ].map((card, i) => (
          <div key={i} className="rounded-[14px] p-5 flex flex-col gap-3" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: card.bg, color: card.color }}>
                <card.icon size={18} />
              </div>
              <Sparkline color={card.color} />
            </div>
            <div>
              <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--admin-text-secondary)' }}>{card.title}</p>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{card.value}</h3>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--admin-text-secondary)' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ══ Filters ═════════════════════════════════════════════════ */}
      <div className="rounded-[14px] p-3.5 flex flex-wrap items-center gap-2.5" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={15} style={{ color: 'var(--admin-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-[10px] text-xs focus:outline-none"
            style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-[10px] text-xs focus:outline-none cursor-pointer"
            style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Hidden">Hidden</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--admin-text-secondary)' }} />
        </div>

        <div className="relative" ref={filterMenuRef}>
          <button
            type="button"
            onClick={() => setFilterMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[10px] transition-colors hover:bg-gray-50"
            style={{
              background: sortBy !== 'order' ? 'rgba(217,154,63,0.1)' : 'var(--admin-bg)',
              border: sortBy !== 'order' ? `1px solid ${GOLD}` : '1px solid var(--admin-border)',
              color: sortBy !== 'order' ? GOLD : 'var(--admin-text)',
            }}
          >
            <Filter size={13} /> Filter{sortBy !== 'order' ? ' •' : ''}
          </button>

          {filterMenuOpen && (
            <div
              className="absolute z-20 mt-1.5 w-52 rounded-[10px] shadow-lg overflow-hidden py-1 right-0"
              style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)' }}
            >
              <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--admin-text-secondary)' }}>Sort by</p>
              {[
                { key: 'order', label: 'Manual order', icon: ListOrdered },
                { key: 'name', label: 'Name (A–Z)', icon: ArrowUpAZ },
                { key: 'products', label: 'Most products', icon: Boxes },
                { key: 'subcategories', label: 'Most subcategories', icon: Layers },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => { setSortBy(opt.key); setFilterMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-black/5 transition-colors"
                  style={{ color: sortBy === opt.key ? GOLD : 'var(--admin-text)', fontWeight: sortBy === opt.key ? 600 : 400 }}
                >
                  <opt.icon size={13} />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[10px] transition-colors hover:bg-gray-50"
          style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* ══ Table ═══════════════════════════════════════════════════ */}
      <div className="flex-1">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-[14px]" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)' }}>
            <Grid3x3 size={48} style={{ color: 'var(--admin-text-secondary)' }} className="mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-1">No categories found</h3>
            <p className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="rounded-[14px] flex flex-col overflow-hidden" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', boxShadow: 'var(--admin-shadow-sm)' }}>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm min-w-[950px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider" style={{ color: 'var(--admin-text-secondary)', borderBottom: '1px solid var(--admin-border)' }}>
                    <th className="p-4 w-8"></th>
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold">Products</th>
                    <th className="p-4 font-semibold">Subcategories</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Order</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((c, idx) => (
                    <tr
                      key={c.id}
                      draggable={canReorder}
                      onDragStart={handleDragStart(c.id)}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop(c.id)}
                      className="hover:bg-black/5 transition-colors"
                      style={{
                        borderTop: idx === 0 ? 'none' : '1px solid var(--admin-border)',
                        opacity: draggedId === c.id ? 0.4 : 1,
                      }}
                    >
                      <td className="p-4">
                        <GripVertical
                          size={14}
                          style={{ color: 'var(--admin-text-secondary)', cursor: canReorder ? 'grab' : 'not-allowed', opacity: canReorder ? 1 : 0.4 }}
                          title={canReorder ? 'Drag to reorder' : 'Clear search/status/sort to reorder'}
                        />
                      </td>

                      <td className="p-4 font-mono text-[11px]" style={{ color: 'var(--admin-text-secondary)' }}>#{c.id}</td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-[10px] bg-black/5 flex items-center justify-center overflow-hidden shrink-0 text-lg">
                            {c.icon || '🏷️'}
                          </div>
                          <p className="font-semibold text-xs">{c.name}</p>
                        </div>
                      </td>

                      <td className="p-4 text-xs max-w-[240px] truncate" style={{ color: 'var(--admin-text-secondary)' }} title={c.description}>
                        {c.description || '—'}
                      </td>

                      <td className="p-4 text-xs font-semibold">{c.productsCount ?? 0}</td>

                      <td className="p-4 text-xs font-semibold">{c.subcategoriesCount ?? 0}</td>

                      <td className="p-4">
                        <ToggleSwitch checked={c.status === 'Active'} onChange={() => toggleStatus(c.id)} title="Toggle status" />
                      </td>

                      <td className="p-4 text-xs font-semibold">{c.order ?? idx + 1}</td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 relative">
                          <button onClick={() => openEditModal(c)} className="p-1.5 rounded-[7px] hover:bg-gray-100 transition-colors" style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }} title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => openViewModal(c)} className="p-1.5 rounded-[7px] hover:bg-gray-100 transition-colors" style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }} title="View">
                            <Eye size={14} />
                          </button>
                          {confirmDelete === c.id ? (
                            <div className="flex items-center gap-1 rounded-[8px] p-1 absolute right-8 z-10 shadow-lg" style={{ background: '#fff', border: '1px solid #fbdada' }}>
                              <span className="text-[10px] px-1.5 font-medium" style={{ color: 'var(--admin-red)' }}>Delete?</span>
                              <button onClick={() => handleDelete(c.id)} className="px-2 py-1 text-white text-[10px] rounded-[4px]" style={{ background: 'var(--admin-red)' }}>Yes</button>
                              <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 text-[10px] rounded-[4px]" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>No</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(c.id)} className="p-1.5 rounded-[7px] hover:bg-rose-100 transition-colors" style={{ border: '1px solid #fbdada', color: '#d13f3b', background: '#feecec' }} title="Delete">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            <div className="p-4 flex items-center justify-between text-xs flex-wrap gap-3" style={{ borderTop: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }}>
              <div>
                Showing <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>
                  {filteredCategories.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </span> to{' '}
                <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>{Math.min(currentPage * pageSize, filteredCategories.length)}</span> of{' '}
                <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>{filteredCategories.length}</span> categories
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
        )}
      </div>

      {/* ══ Modal: Add / Edit Category ══════════════════════════════ */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[16px] p-6 shadow-2xl flex flex-col gap-4" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', fontFamily: 'var(--admin-font)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--admin-border)' }}>
              <h3 className="text-base font-bold">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowFormModal(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-[64px_1fr] gap-3">
                <div>
                  <label className="block mb-1 font-medium">Icon</label>
                  <input
                    type="text" maxLength={2}
                    value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-[8px] text-center text-lg focus:outline-none"
                    style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Category Name *</label>
                  <input
                    type="text" required placeholder="e.g. Ancient"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-[8px] focus:outline-none"
                    style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  rows={3} placeholder="Short description of this category"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-[8px] focus:outline-none resize-none"
                  style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-[8px] focus:outline-none"
                  style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)' }}
                >
                  <option value="Active">Active (visible)</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t" style={{ borderColor: 'var(--admin-border)' }}>
                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-[8px] font-medium" style={{ border: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)' }}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-[8px] font-medium text-white" style={{ background: GOLD }}>
                  {editingCategory ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ Modal: View Category ═══════════════════════════════════ */}
      {showViewModal && viewingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[16px] p-6 shadow-2xl flex flex-col gap-4" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', fontFamily: 'var(--admin-font)' }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--admin-border)' }}>
              <h3 className="text-base font-bold">Category Details</h3>
              <button onClick={() => setShowViewModal(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-[12px] bg-black/5 flex items-center justify-center text-2xl shrink-0">
                {viewingCategory.icon || '🏷️'}
              </div>
              <div>
                <p className="text-base font-bold">{viewingCategory.name}</p>
                <p className="text-[11px] font-mono" style={{ color: 'var(--admin-text-secondary)' }}>#{viewingCategory.id}</p>
              </div>
            </div>

            <div className="text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
              {viewingCategory.description || 'No description provided.'}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-[10px] p-3" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
                <p style={{ color: 'var(--admin-text-secondary)' }} className="mb-1">Products</p>
                <p className="font-bold text-sm">{viewingCategory.productsCount ?? 0}</p>
              </div>
              <div className="rounded-[10px] p-3" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
                <p style={{ color: 'var(--admin-text-secondary)' }} className="mb-1">Subcategories</p>
                <p className="font-bold text-sm">{viewingCategory.subcategoriesCount ?? 0}</p>
              </div>
              <div className="rounded-[10px] p-3" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
                <p style={{ color: 'var(--admin-text-secondary)' }} className="mb-1">Status</p>
                <p className="font-bold text-sm" style={{ color: viewingCategory.status === 'Active' ? 'var(--admin-green)' : 'var(--admin-text-secondary)' }}>{viewingCategory.status}</p>
              </div>
              <div className="rounded-[10px] p-3" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
                <p style={{ color: 'var(--admin-text-secondary)' }} className="mb-1">Order</p>
                <p className="font-bold text-sm">{viewingCategory.order ?? '—'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--admin-border)' }}>
              <button
                onClick={() => { setShowViewModal(false); openEditModal(viewingCategory); }}
                className="px-4 py-2 rounded-[8px] font-medium text-white text-xs"
                style={{ background: GOLD }}
              >
                Edit Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;