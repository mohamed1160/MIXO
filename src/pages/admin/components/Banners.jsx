import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Filter,
  RotateCcw,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  XCircle,
  Layers,
  X,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { getAdminData } from '../../../services/adminMockData';

const INITIAL_BANNERS = [];

export default function Banners() {
  const [banners, setBanners] = useState(() => {
    try {
      const stored = localStorage.getItem('MIXO_admin_banners');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Toast message
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    location: 'Home Page',
    type: 'Image',
    status: 'Active',
    startDate: '2024-05-01T00:00',
    endDate: '2024-05-31T23:59',
    link: '',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stats Calculations
  const totalBannersCount = banners.length;
  const activeCount = useMemo(() => banners.filter((b) => b.status === 'Active').length, [banners]);
  const scheduledCount = useMemo(() => banners.filter((b) => b.status === 'Scheduled').length, [banners]);
  const inactiveCount = useMemo(() => banners.filter((b) => b.status === 'Inactive').length, [banners]);
  const totalViewsDisplay = useMemo(() => banners.reduce((sum, b) => sum + (b.views || 0), 0).toLocaleString(), [banners]);

  // Location Badge Styles
  const getLocationBadgeStyle = (loc) => {
    switch (loc) {
      case 'Home Page':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Top Bar':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Checkout Page':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Category Page':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shop Page':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Unique Location List
  const locationList = useMemo(() => {
    const set = new Set(banners.map((b) => b.location));
    return ['All Locations', 'Home Page', 'Top Bar', 'Checkout Page', 'Category Page', 'Shop Page'];
  }, [banners]);

  // Filtered Banners
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q);

      const matchesLocation = locationFilter === 'All Locations' || b.location === locationFilter;
      const matchesType = typeFilter === 'All Types' || b.type === typeFilter;
      const matchesStatus = statusFilter === 'All Status' || b.status === statusFilter;

      return matchesSearch && matchesLocation && matchesType && matchesStatus;
    });
  }, [banners, searchQuery, locationFilter, typeFilter, statusFilter]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage) || 1;
  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBanners.slice(start, start + itemsPerPage);
  }, [filteredBanners, currentPage]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      location: 'Home Page',
      type: 'Image',
      status: 'Active',
      startDate: '2024-06-01T00:00',
      endDate: '2024-06-30T23:59',
      link: '/collection/new',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      location: banner.location,
      type: banner.type,
      status: banner.status,
      startDate: '2024-05-01T00:00',
      endDate: '2024-05-31T23:59',
      link: banner.link,
      image: banner.image,
    });
    setIsAddEditOpen(true);
  };

  const handleDuplicate = (banner) => {
    const duplicated = {
      ...banner,
      id: `BAN-${Date.now().toString().slice(-4)}`,
      title: `${banner.title} (Copy)`,
      views: '0',
      status: 'Inactive',
    };
    setBanners([duplicated, ...banners]);
    triggerToast(`Banner "${banner.title}" duplicated! 📋`);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete banner "${title}"?`)) {
      setBanners(banners.filter((b) => b.id !== id));
      triggerToast(`Banner "${title}" deleted. 🗑️`);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationFilter('All Locations');
    setTypeFilter('All Types');
    setStatusFilter('All Status');
    setCurrentPage(1);
    triggerToast('All banner filters reset. 🔄');
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
                ...b,
                title: formData.title,
                subtitle: formData.subtitle,
                location: formData.location,
                type: formData.type,
                status: formData.status,
                link: formData.link,
                image: formData.image,
              }
            : b
        )
      );
      triggerToast(`Banner "${formData.title}" updated! ✨`);
    } else {
      const newBannerObj = {
        id: `BAN-${Date.now().toString().slice(-4)}`,
        title: formData.title,
        subtitle: formData.subtitle,
        location: formData.location,
        type: formData.type,
        status: formData.status,
        startDate: 'Jun 1, 2024, 12:00 AM',
        endDate: 'Jun 30, 2024, 11:59 PM',
        views: '0',
        link: formData.link,
        image: formData.image,
      };
      setBanners([newBannerObj, ...banners]);
      triggerToast(`New Banner "${formData.title}" created successfully! 🎉`);
    }

    setIsAddEditOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-gray-700 animate-bounce">
          <Sparkles size={16} className="text-[#C89A3D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-gray-400 mb-1">
            Dashboard &gt; <span className="text-gray-700 font-semibold">Banners</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Banners</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your store banners and promotional slides
          </p>
        </div>

        {/* Top Right Primary Action */}
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-900 bg-[#C89A3D] hover:bg-[#b58832] hover:text-white rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* ── 5 Stat KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Banners */}
        <div
          onClick={() => {
            setStatusFilter('All Status');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'All Status' ? 'border-[#C89A3D] shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Total Banners</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ImageIcon size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{totalBannersCount}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">All banners</p>
            </div>
            <svg className="w-14 h-7 text-purple-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,15 Q10,5 20,12 T40,4 T50,10" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Active Banners */}
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
            <span className="text-[11px] font-medium text-gray-500">Active Banners</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{activeCount}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Currently active</p>
            </div>
            <svg className="w-14 h-7 text-emerald-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,18 Q12,10 25,14 T45,3 T50,7" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Scheduled */}
        <div
          onClick={() => {
            setStatusFilter('Scheduled');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'Scheduled' ? 'border-amber-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Scheduled</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{scheduledCount}</p>
              <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Scheduled banners</p>
            </div>
            <svg className="w-14 h-7 text-amber-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,12 Q15,18 28,8 T42,14 T50,4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Inactive */}
        <div
          onClick={() => {
            setStatusFilter('Inactive');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'Inactive' ? 'border-rose-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Inactive</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{inactiveCount}</p>
              <p className="text-[10px] text-rose-500 font-semibold mt-0.5">Not active</p>
            </div>
            <svg className="w-14 h-7 text-rose-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,8 Q15,4 30,16 T45,12 T50,18" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: Total Views */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Total Views</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{totalViewsDisplay}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">This month</p>
            </div>
            <svg className="w-14 h-7 text-blue-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,16 Q10,6 22,12 T40,2 T50,8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search banners by name, type or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89A3D] text-gray-700 placeholder-gray-400 bg-gray-50/50"
            />
          </div>

          {/* Location Select Dropdown */}
          <select
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            {locationList.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Types Select Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="Image">Image</option>
            <option value="Video">Video</option>
            <option value="Slider">Slider</option>
            <option value="Announcement">Announcement</option>
          </select>

          {/* Status Select Dropdown */}
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
            <option value="Scheduled">Scheduled</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Filter & Reset Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => triggerToast('Banner filters applied! 🔍')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gray-900 rounded-xl hover:bg-black transition-colors cursor-pointer"
          >
            <Filter size={14} />
            <span>Filter</span>
          </button>

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

      {/* ── Banners Data Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-3.5 px-4 w-[160px]">Banner</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">End Date</th>
                <th className="py-3.5 px-4">Views</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedBanners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400 text-xs">
                    No banners found matching your search & criteria.
                  </td>
                </tr>
              ) : (
                paginatedBanners.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Banner Thumbnail Preview */}
                    <td className="py-3.5 px-4">
                      <div className="w-28 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-900 shrink-0 relative group">
                        <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={b.link} target="_blank" rel="noreferrer" className="text-white p-1 hover:scale-110">
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Title & Subtitle */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-xs">{b.title}</span>
                        <span className="text-[11px] text-gray-400 font-medium">{b.subtitle}</span>
                      </div>
                    </td>

                    {/* Location Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${getLocationBadgeStyle(b.location)}`}>
                        {b.location}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{b.type}</td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {b.status === 'Active' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      )}
                      {b.status === 'Scheduled' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Scheduled
                        </span>
                      )}
                      {b.status === 'Inactive' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Start Date */}
                    <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">{b.startDate}</td>

                    {/* End Date */}
                    <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">{b.endDate}</td>

                    {/* Views */}
                    <td className="py-3.5 px-4 font-bold text-gray-900 text-xs">{b.views}</td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(b)}
                          title="Edit Banner"
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 size={15} />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(b)}
                          title="Duplicate Banner"
                          className="p-1.5 text-gray-400 hover:text-[#C89A3D] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy size={15} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id, b.title)}
                          title="Delete Banner"
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer & Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-700">{paginatedBanners.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * itemsPerPage, filteredBanners.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-700">18</span> banners
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

            {[1, 2, 3, '...', 4].map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-1.5 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#C89A3D] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}

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

      {/* ── Add / Edit Banner Modal ── */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon size={18} className="text-[#C89A3D]" />
                <span>{editingBanner ? 'Edit Page Hero Banner' : 'Add New Hero Banner'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddEditOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Banner Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Collection 2024"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Subtitle / Campaign</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer / Spring Collection"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Page Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 cursor-pointer font-medium"
                  >
                    <option value="Home Page">Home Page Hero</option>
                    <option value="Shop Page">Shop Page Hero</option>
                    <option value="Category Page">Category Page Hero</option>
                    <option value="Top Bar">Top Bar Announcement</option>
                    <option value="Checkout Page">Checkout Promo</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Banner Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 cursor-pointer font-medium"
                  >
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                    <option value="Slider">Slider</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 cursor-pointer font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Target Link URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /collection/summer-2024"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Banner Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-[#C89A3D] bg-gray-50/50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => triggerToast('Select an image from device or Media Library')}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload size={14} />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Live Thumbnail Preview */}
              {formData.image && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[10px] text-gray-400 font-medium">Banner Preview</span>
                  <div className="w-full h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl shadow-xs cursor-pointer"
                >
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

