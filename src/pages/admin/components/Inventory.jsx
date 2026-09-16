import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  Download,
  Eye,
  TrendingUp,
  Package,
  PackageCheck,
  PackageX,
  Boxes,
  DollarSign,
  ArrowUpDown,
  X,
  Check,
  Sparkles,
  Plus,
  Minus,
  RefreshCw,
} from 'lucide-react';
import { getAdminData } from '../../../services/adminMockData';

// Fallback rich inventory dataset if products array doesn't have reserved/detailed fields
const INITIAL_INVENTORY = [
  {
    id: 'PRD-1001',
    name: 'MIXO Pharaoh T-Shirt',
    sku: 'AUR-TS-001',
    category: 'T-Shirts',
    price: 450,
    stock: 45,
    reserved: 8,
    status: 'Active',
    lastUpdated: 'May 31, 2024, 10:30 AM',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-1002',
    name: 'MIXO Ankh Polo',
    sku: 'AUR-PL-002',
    category: 'Polos',
    price: 650,
    stock: 12,
    reserved: 3,
    status: 'Active',
    lastUpdated: 'May 31, 2024, 09:15 AM',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-1003',
    name: 'MIXO Scarab Hoodie',
    sku: 'AUR-HD-003',
    category: 'Hoodies',
    price: 950,
    stock: 0,
    reserved: 0,
    status: 'Active',
    lastUpdated: 'May 30, 2024, 08:45 PM',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-1004',
    name: 'MIXO Horus Cap',
    sku: 'AUR-CP-004',
    category: 'Accessories',
    price: 250,
    stock: 37,
    reserved: 5,
    status: 'Active',
    lastUpdated: 'May 30, 2024, 07:20 PM',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-1005',
    name: 'MIXO Premium Jacket',
    sku: 'AUR-JK-005',
    category: 'Jackets',
    price: 1800,
    stock: 6,
    reserved: 2,
    status: 'Active',
    lastUpdated: 'May 30, 2024, 04:10 PM',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-1006',
    name: 'MIXO Bastet Sweatshirt',
    sku: 'AUR-SW-006',
    category: 'Sweatshirts',
    price: 750,
    stock: 28,
    reserved: 4,
    status: 'Active',
    lastUpdated: 'May 29, 2024, 02:30 PM',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-1007',
    name: 'MIXO Sneaker Pro',
    sku: 'AUR-SN-007',
    category: 'Footwear',
    price: 1400,
    stock: 2,
    reserved: 1,
    status: 'Active',
    lastUpdated: 'May 29, 2024, 01:05 PM',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-1008',
    name: 'MIXO Tote Bag',
    sku: 'AUR-BG-008',
    category: 'Bags',
    price: 350,
    stock: 19,
    reserved: 0,
    status: 'Active',
    lastUpdated: 'May 29, 2024, 11:50 AM',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-1009',
    name: 'MIXO Minimalist Polo',
    sku: 'AUR-PL-009',
    category: 'Polos',
    price: 600,
    stock: 15,
    reserved: 2,
    status: 'Active',
    lastUpdated: 'May 28, 2024, 03:20 PM',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-1010',
    name: 'MIXO Urban Joggers',
    sku: 'AUR-JG-010',
    category: 'Pants',
    price: 700,
    stock: 4,
    reserved: 1,
    status: 'Active',
    lastUpdated: 'May 27, 2024, 10:15 AM',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=100&auto=format&fit=crop&q=80',
  },
];

export default function Inventory() {
  const [products, setProducts] = useState([]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [stockStatusFilter, setStockStatusFilter] = useState('All Stock Status');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustModalProduct, setAdjustModalProduct] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);

  // Toast message
  const [toastMessage, setToastMessage] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Initialize data
  useEffect(() => {
    const adminData = getAdminData();
    if (adminData.products && adminData.products.length > 0) {
      const merged = adminData.products.map((p, idx) => {
        const fallback = INITIAL_INVENTORY[idx % INITIAL_INVENTORY.length];
        return {
          id: p.id || fallback.id,
          name: p.name || fallback.name,
          sku: p.sku || fallback.sku,
          category: p.category || fallback.category,
          price: p.price || p.finalPrice || fallback.price,
          stock: typeof p.stock === 'number' ? p.stock : fallback.stock,
          reserved: fallback.reserved || Math.floor((p.stock || 10) * 0.15),
          status: p.visible !== false ? 'Active' : 'Inactive',
          lastUpdated: fallback.lastUpdated,
          image: p.image || p.images?.[0] || fallback.image,
        };
      });
      setProducts(merged);
    } else {
      setProducts(INITIAL_INVENTORY);
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper for stock status text
  const getStockStatus = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  // Stats Calculations
  const totalProductsCount = products.length;
  const inStockCount = useMemo(() => products.filter((p) => p.stock >= 10).length, [products]);
  const lowStockCount = useMemo(() => products.filter((p) => p.stock > 0 && p.stock < 10).length, [products]);
  const outOfStockCount = useMemo(() => products.filter((p) => p.stock === 0).length, [products]);

  const totalStockValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0);
  }, [products]);

  const inStockPercentage = totalProductsCount ? ((inStockCount / totalProductsCount) * 100).toFixed(1) : '0';
  const lowStockPercentage = totalProductsCount ? ((lowStockCount / totalProductsCount) * 100).toFixed(1) : '0';
  const outOfStockPercentage = totalProductsCount ? ((outOfStockCount / totalProductsCount) * 100).toFixed(1) : '0';

  // Category list for filter
  const categoriesList = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All Categories', ...Array.from(set)];
  }, [products]);

  // Category Badge Colors
  const getCategoryBadgeStyle = (cat) => {
    switch (cat) {
      case 'T-Shirts':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Polos':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Hoodies':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Accessories':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Jackets':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Sweatshirts':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Footwear':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Bags':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === 'All Categories' || p.category === categoryFilter;

      const stockStatus = getStockStatus(p.stock);
      const matchesStockStatus = stockStatusFilter === 'All Stock Status' || stockStatus === stockStatusFilter;

      const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStockStatus && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, stockStatusFilter, statusFilter]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Reserved', 'Available', 'Status', 'Stock Status', 'Last Updated'];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.name}"`,
      p.sku,
      p.category,
      p.price,
      p.stock,
      p.reserved || 0,
      Math.max(0, (p.stock || 0) - (p.reserved || 0)),
      p.status,
      getStockStatus(p.stock),
      `"${p.lastUpdated || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MIXO_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Inventory report exported to CSV! 📥');
  };

  // Adjust Stock Submit
  const handleSaveStockAdjustment = (e) => {
    e.preventDefault();
    if (!adjustModalProduct) return;

    const newStock = Math.max(0, adjustModalProduct.stock + stockAdjustment);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === adjustModalProduct.id
          ? {
              ...p,
              stock: newStock,
              lastUpdated: new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : p
      )
    );

    triggerToast(`Stock updated for ${adjustModalProduct.name}! New Stock: ${newStock} 📦`);
    setAdjustModalProduct(null);
    setStockAdjustment(0);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800 relative">
      {/* Floating Toast Notification */}
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
            Dashboard &gt; <span className="text-gray-700 font-semibold">Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor and manage your stock levels
          </p>
        </div>
      </div>

      {/* ── KPI Stat Cards (5 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Products */}
        <div
          onClick={() => {
            setStockStatusFilter('All Stock Status');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            stockStatusFilter === 'All Stock Status' ? 'border-[#C89A3D] shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Total Products</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Boxes size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{totalProductsCount}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">All products</p>
            </div>
            <svg className="w-14 h-7 text-purple-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,15 Q10,5 20,12 T40,4 T50,10" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: In Stock */}
        <div
          onClick={() => {
            setStockStatusFilter('In Stock');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            stockStatusFilter === 'In Stock' ? 'border-emerald-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">In Stock</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PackageCheck size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{inStockCount}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{inStockPercentage}% of products</p>
            </div>
            <svg className="w-14 h-7 text-emerald-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,18 Q12,10 25,14 T45,3 T50,7" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Low Stock */}
        <div
          onClick={() => {
            setStockStatusFilter('Low Stock');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            stockStatusFilter === 'Low Stock' ? 'border-amber-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Low Stock</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{lowStockCount}</p>
              <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{lowStockPercentage}% of products</p>
            </div>
            <svg className="w-14 h-7 text-amber-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,12 Q15,18 28,8 T42,14 T50,4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div
          onClick={() => {
            setStockStatusFilter('Out of Stock');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
            stockStatusFilter === 'Out of Stock' ? 'border-rose-500 shadow-xs' : 'border-gray-100 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Out of Stock</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <PackageX size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{outOfStockCount}</p>
              <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{outOfStockPercentage}% of products</p>
            </div>
            <svg className="w-14 h-7 text-rose-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,8 Q15,4 30,16 T45,12 T50,18" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: Total Stock Value */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-500">Total Stock Value</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-xl font-extrabold text-gray-900">EGP {totalStockValue.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Total inventory value</p>
            </div>
            <svg className="w-14 h-7 text-blue-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M0,16 Q10,6 22,12 T40,2 T50,8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Low Stock Alert Banner ── */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">Low Stock Alert</h4>
              <p className="text-[11px] text-amber-700 mt-0.5">
                You have <span className="font-bold">{lowStockCount} products</span> with low stock. Please restock them to avoid losing sales.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setStockStatusFilter('Low Stock');
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-xs font-bold text-amber-900 bg-[#C89A3D] hover:bg-[#b58832] hover:text-white rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            View Low Stock
          </button>
        </div>
      )}

      {/* ── Search & Filter Controls Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89A3D] text-gray-700 placeholder-gray-400 bg-gray-50/50"
            />
          </div>

          {/* Categories Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Stock Status Dropdown */}
          <select
            value={stockStatusFilter}
            onChange={(e) => {
              setStockStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
          >
            <option value="All Stock Status">All Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

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
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ── Inventory Data Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Product</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>SKU</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Category</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Stock</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Reserved</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Available</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Status</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Stock Status</span>
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400 text-xs">
                    No products found matching your inventory filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const stockStatus = getStockStatus(p.stock);
                  const availableCount = Math.max(0, (p.stock || 0) - (p.reserved || 0));

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{p.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: #{p.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-gray-700">{p.sku}</td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${getCategoryBadgeStyle(p.category)}`}>
                          {p.category}
                        </span>
                      </td>

                      {/* Stock Count */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 text-xs">{p.stock}</td>

                      {/* Reserved Count */}
                      <td className="py-3.5 px-4 text-gray-500 font-medium">{p.reserved || 0}</td>

                      {/* Available Count */}
                      <td className="py-3.5 px-4 font-bold text-xs">
                        <span
                          className={
                            availableCount >= 10
                              ? 'text-emerald-600'
                              : availableCount > 0
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }
                        >
                          {availableCount}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {p.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Stock Status Badge */}
                      <td className="py-3.5 px-4">
                        {stockStatus === 'In Stock' && (
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600">
                            In Stock
                          </span>
                        )}
                        {stockStatus === 'Low Stock' && (
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600">
                            Low Stock
                          </span>
                        )}
                        {stockStatus === 'Out of Stock' && (
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-500">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Last Updated */}
                      <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                        {p.lastUpdated || 'May 31, 2024'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setSelectedProduct(p)}
                            title="View Product"
                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Quick Adjust Stock */}
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustModalProduct(p);
                              setStockAdjustment(0);
                            }}
                            title="Adjust Stock"
                            className="p-1.5 text-gray-400 hover:text-[#C89A3D] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <RefreshCw size={15} />
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
            Showing <span className="font-semibold text-gray-700">{paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-700">{filteredProducts.length}</span> products
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

      {/* ── Product View Modal ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Product Stock Details</h3>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{selectedProduct.name}</h4>
                <p className="text-xs text-gray-400 font-mono">SKU: {selectedProduct.sku}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded border ${getCategoryBadgeStyle(selectedProduct.category)}`}>
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-center text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Total Stock</span>
                <span className="text-base font-bold text-gray-900">{selectedProduct.stock}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Reserved</span>
                <span className="text-base font-bold text-amber-600">{selectedProduct.reserved || 0}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Available</span>
                <span className="text-base font-bold text-emerald-600">
                  {Math.max(0, selectedProduct.stock - (selectedProduct.reserved || 0))}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#C89A3D] rounded-xl hover:bg-[#b58832]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Adjust Stock Modal ── */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <RefreshCw size={16} className="text-[#C89A3D]" />
                Adjust Stock Quantity
              </h3>
              <button
                type="button"
                onClick={() => setAdjustModalProduct(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <img
                src={adjustModalProduct.image}
                alt={adjustModalProduct.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-xs">{adjustModalProduct.name}</h4>
                <p className="text-[11px] text-gray-500">Current Stock: <span className="font-bold text-gray-900">{adjustModalProduct.stock}</span></p>
              </div>
            </div>

            <form onSubmit={handleSaveStockAdjustment} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Adjust Stock (+ or -)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStockAdjustment((prev) => prev - 1)}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={stockAdjustment}
                    onChange={(e) => setStockAdjustment(Number(e.target.value))}
                    className="flex-1 text-center font-bold text-base py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89A3D]"
                  />
                  <button
                    type="button"
                    onClick={() => setStockAdjustment((prev) => prev + 1)}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-800">
                New calculated stock will be: <span className="font-bold">{Math.max(0, adjustModalProduct.stock + stockAdjustment)}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl shadow-xs"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

