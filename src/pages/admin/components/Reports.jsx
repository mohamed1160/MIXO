import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  Users,
  ShoppingCart,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  Info,
  ArrowRight,
  Sparkles,
  Package,
  RotateCcw as RefundIcon,
  Percent,
  X,
  Globe,
  Share2,
  Tag,
  CheckCircle,
  BarChart3,
  Layers,
  ArrowUpRight,
  UserCheck,
  UserPlus,
  Repeat,
} from 'lucide-react';
import { getAdminData, getRealSalesChartData, getRealSalesByCategory } from '../../../services/adminMockData';

// ── Data Generators ──
const generateDailyRevenueData = () => [];
const generateDailyOrdersData = () => [];
const SALES_CHANNELS = [];
const SALES_BY_CATEGORY = [];
const TOP_PRODUCTS = [];

export default function Reports() {
  const adminData = getAdminData();

  // Filters & Interactivity
  const [dateRange, setDateRange] = useState('May 1, 2024 - May 31, 2024');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [revenueGrain, setRevenueGrain] = useState('Daily');
  const [ordersGrain, setOrdersGrain] = useState('Daily');

  // Modals state for "View full..." links
  const [activeModal, setActiveModal] = useState(null); // 'traffic' | 'categories' | 'products' | 'customers'

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportReport = () => {
    triggerToast('Report exported successfully! 📊 (CSV/PDF)');
  };

  const revenueData = useMemo(() => getRealSalesChartData(revenueGrain === 'Weekly' ? '14d' : revenueGrain === 'Monthly' ? '30d' : '7d'), [revenueGrain]);
  const ordersData = useMemo(() => getRealSalesChartData(ordersGrain === 'Weekly' ? '14d' : ordersGrain === 'Monthly' ? '30d' : '7d'), [ordersGrain]);
  const salesByCategory = useMemo(() => getRealSalesByCategory(), []);

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800 relative">
      {/* Toast Banner */}
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
            Dashboard &gt; <span className="text-gray-700 font-semibold">Reports</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Overview of your store performance
          </p>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Date Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              <Calendar size={14} className="text-gray-400" />
              <span>{dateRange}</span>
            </button>

            {showDatePicker && (
              <div className="absolute top-11 right-0 z-40 bg-white border border-gray-200 p-4 rounded-2xl shadow-xl flex flex-col gap-3 min-w-[260px]">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-800">Select Date Range</span>
                  <button type="button" onClick={() => setShowDatePicker(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setDateRange('May 1, 2024 - May 31, 2024');
                      setShowDatePicker(false);
                      triggerToast('Filtered for May 2024');
                    }}
                    className="p-2 text-left hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
                  >
                    May 2024 (Current Month)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDateRange('Apr 1, 2024 - Apr 30, 2024');
                      setShowDatePicker(false);
                      triggerToast('Filtered for April 2024');
                    }}
                    className="p-2 text-left hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
                  >
                    April 2024 (Last Month)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDateRange('Jan 1, 2024 - May 31, 2024');
                      setShowDatePicker(false);
                      triggerToast('Filtered for Year to Date');
                    }}
                    className="p-2 text-left hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
                  >
                    Year to Date (YTD)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          {/* Filters Button */}
          <button
            type="button"
            onClick={() => triggerToast('Filters applied for May 2024 performance')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs transition-all cursor-pointer"
          >
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* ── 5 Stat KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-gray-400">Total Revenue</span>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">EGP {adminData.stats.totalSales.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Real-time total sales</p>
          </div>
          <div className="mt-2">
            <svg className="w-full h-6 text-purple-500 stroke-current fill-none" viewBox="0 0 100 25">
              <path d="M0,20 Q20,5 40,15 T80,5 T100,10" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-gray-400">Total Orders</span>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{adminData.stats.ordersCount.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Real orders placed</p>
          </div>
          <div className="mt-2">
            <svg className="w-full h-6 text-emerald-500 stroke-current fill-none" viewBox="0 0 100 25">
              <path d="M0,22 Q25,8 50,16 T85,4 T100,12" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Total Customers */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Users size={16} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-gray-400">Total Customers</span>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{adminData.stats.customersCount.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Registered users</p>
          </div>
          <div className="mt-2">
            <svg className="w-full h-6 text-amber-500 stroke-current fill-none" viewBox="0 0 100 25">
              <path d="M0,15 Q30,22 55,8 T80,14 T100,5" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Average Order Value */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart size={16} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-gray-400">Average Order Value</span>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">
              EGP {adminData.stats.ordersCount > 0 ? Math.round(adminData.stats.totalSales / adminData.stats.ordersCount).toLocaleString() : '0'}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Avg basket total</p>
          </div>
          <div className="mt-2">
            <svg className="w-full h-6 text-blue-500 stroke-current fill-none" viewBox="0 0 100 25">
              <path d="M0,18 Q20,8 45,14 T80,4 T100,10" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: Total Profit */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-gray-400">Total Profit</span>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">EGP {adminData.stats.totalProfit.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">Net profit margin</p>
          </div>
          <div className="mt-2">
            <svg className="w-full h-6 text-rose-500 stroke-current fill-none" viewBox="0 0 100 25">
              <path d="M0,20 Q25,6 50,15 T80,3 T100,12" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Top Charts Row (3 Columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Revenue Overview */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <span>Revenue Overview</span>
              <Info size={13} className="text-gray-400 cursor-pointer" />
            </div>
            <select
              value={revenueGrain}
              onChange={(e) => {
                setRevenueGrain(e.target.value);
                triggerToast(`Revenue chart updated to ${e.target.value} view`);
              }}
              className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-pointer"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-extrabold text-gray-900">EGP {adminData.stats.totalSales.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live Sales
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Revenue (EGP)</span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={(v) => `${v / 1000}K`}
                />
                <Tooltip
                  contentStyle={{ background: '#111827', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }}
                  formatter={(v) => [`EGP ${v.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#D97706" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Orders Overview */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <span>Orders Overview</span>
              <Info size={13} className="text-gray-400 cursor-pointer" />
            </div>
            <select
              value={ordersGrain}
              onChange={(e) => {
                setOrdersGrain(e.target.value);
                triggerToast(`Orders chart updated to ${e.target.value} view`);
              }}
              className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-pointer"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-extrabold text-gray-900">{adminData.stats.ordersCount.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live Orders
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <span>Orders</span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }}
                  formatter={(v) => [v, 'Orders']}
                />
                <Bar dataKey="orders" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Sales Channels */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="border-b border-gray-100 pb-3 mb-2">
            <h3 className="text-xs font-bold text-gray-900">Top Sales Channels</h3>
          </div>

          <div className="relative h-[160px] w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SALES_CHANNELS} dataKey="value" nameKey="name" innerRadius={48} outerRadius={68} paddingAngle={3}>
                  {SALES_CHANNELS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-400 font-medium">Total</span>
              <span className="text-sm font-extrabold text-gray-900">100%</span>
            </div>
          </div>

          {/* Legend Table */}
          <div className="flex flex-col gap-1.5 text-xs border-t border-gray-100 pt-3">
            {SALES_CHANNELS.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>

          {/* Interactive Link Button */}
          <button
            type="button"
            onClick={() => setActiveModal('traffic')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-800 hover:text-[#C89A3D] mt-3 pt-2 border-t border-gray-100 transition-colors cursor-pointer"
          >
            <span>View full traffic report</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Middle Summary Grid (3 Columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sales by Category */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 border-b border-gray-100 pb-3 mb-3">
              <span>Sales by Category</span>
              <Info size={13} className="text-gray-400 cursor-pointer" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 font-medium text-[10px] border-b border-gray-100">
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Revenue</th>
                    <th className="pb-2 font-medium">Orders</th>
                    <th className="pb-2 font-medium text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SALES_BY_CATEGORY.map((cat) => (
                    <tr key={cat.category} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 font-bold text-gray-900">{cat.category}</td>
                      <td className="py-2.5 text-gray-700 font-medium">EGP {cat.revenue.toLocaleString()}</td>
                      <td className="py-2.5 text-gray-600">{cat.orders}</td>
                      <td className="py-2.5 text-right w-[100px]">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-semibold text-gray-800">{cat.percentage}%</span>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#D97706] rounded-full" style={{ width: `${cat.percentage * 3}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('categories')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-800 hover:text-[#C89A3D] mt-4 pt-2 border-t border-gray-100 transition-colors cursor-pointer"
          >
            <span>View full category report</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 border-b border-gray-100 pb-3 mb-3">
              <span>Top Products</span>
              <Info size={13} className="text-gray-400 cursor-pointer" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 font-medium text-[10px] border-b border-gray-100">
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium">Revenue</th>
                    <th className="pb-2 font-medium text-right">Units Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {TOP_PRODUCTS.map((prod) => (
                    <tr key={prod.name} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <img src={prod.image} alt={prod.name} className="w-7 h-7 rounded-lg object-cover border border-gray-100" />
                          <span className="font-bold text-gray-900 truncate max-w-[150px]">{prod.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-gray-700 font-semibold">EGP {prod.revenue.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-bold text-gray-900">{prod.unitsSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('products')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-800 hover:text-[#C89A3D] mt-4 pt-2 border-t border-gray-100 transition-colors cursor-pointer"
          >
            <span>View all products report</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Customer Overview */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 border-b border-gray-100 pb-3 mb-3">
              <span>Customer Overview</span>
              <Info size={13} className="text-gray-400 cursor-pointer" />
            </div>

            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs text-gray-600 font-medium">New Customers</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-gray-900">342</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+22.5%</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs text-gray-600 font-medium">Returning Customers</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-gray-900">514</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+15.3%</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs text-gray-600 font-medium">Customer Retention Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-gray-900">62.7%</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+8.6%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1">
                <span className="text-xs text-gray-600 font-medium">Total Customers</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-gray-900">856</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+21.3%</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('customers')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-800 hover:text-[#C89A3D] mt-4 pt-2 border-t border-gray-100 transition-colors cursor-pointer"
          >
            <span>View full customer report</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Bottom Section: Monthly Summary ── */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-1.5 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span>Monthly Summary</span>
              <Info size={13} className="text-gray-400 cursor-pointer" />
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Overview of key metrics for the selected period</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Tile 1 */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={14} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-medium block">Total Revenue</span>
              <span className="text-sm font-extrabold text-gray-900">EGP 286,450</span>
            </div>
          </div>

          {/* Tile 2 */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={14} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-medium block">Total Orders</span>
              <span className="text-sm font-extrabold text-gray-900">1,248</span>
            </div>
          </div>

          {/* Tile 3 */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users size={14} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-medium block">Total Customers</span>
              <span className="text-sm font-extrabold text-gray-900">856</span>
            </div>
          </div>

          {/* Tile 4 */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package size={14} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-medium block">Products Sold</span>
              <span className="text-sm font-extrabold text-gray-900">891</span>
            </div>
          </div>

          {/* Tile 5 */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
              <RefundIcon size={14} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-medium block">Refunds</span>
              <span className="text-sm font-extrabold text-gray-900">EGP 8,420</span>
            </div>
          </div>

          {/* Tile 6 */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Percent size={14} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-medium block">Conversion Rate</span>
              <span className="text-sm font-extrabold text-gray-900">2.34%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: Full Traffic & Sales Channels Report ── */}
      {activeModal === 'traffic' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-[#C89A3D]" />
                <h3 className="text-base font-bold text-gray-900">Full Traffic & Sales Channels Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <th className="py-2.5 px-3">Channel Name</th>
                    <th className="py-2.5 px-3">Visitors</th>
                    <th className="py-2.5 px-3">Revenue (EGP)</th>
                    <th className="py-2.5 px-3">Share (%)</th>
                    <th className="py-2.5 px-3 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SALES_CHANNELS.map((ch) => (
                    <tr key={ch.name} className="hover:bg-gray-50/60">
                      <td className="py-3 px-3 font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }}></span>
                        {ch.name}
                      </td>
                      <td className="py-3 px-3 text-gray-600 font-medium">{ch.visitors}</td>
                      <td className="py-3 px-3 font-semibold text-gray-800">EGP {ch.revenue.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">{ch.value}%</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">{ch.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Full Sales by Category Report ── */}
      {activeModal === 'categories' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-[#C89A3D]" />
                <h3 className="text-base font-bold text-gray-900">Full Sales by Category Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Revenue (EGP)</th>
                    <th className="py-2.5 px-3">Total Orders</th>
                    <th className="py-2.5 px-3">Units Sold</th>
                    <th className="py-2.5 px-3">Revenue Share</th>
                    <th className="py-2.5 px-3 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SALES_BY_CATEGORY.map((c) => (
                    <tr key={c.category} className="hover:bg-gray-50/60">
                      <td className="py-3 px-3 font-bold text-gray-900">{c.category}</td>
                      <td className="py-3 px-3 font-semibold text-gray-800">EGP {c.revenue.toLocaleString()}</td>
                      <td className="py-3 px-3 text-gray-600">{c.orders}</td>
                      <td className="py-3 px-3 font-medium text-gray-700">{c.unitsSold}</td>
                      <td className="py-3 px-3 font-bold text-purple-700">{c.percentage}%</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">{c.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Full Top Products Report ── */}
      {activeModal === 'products' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#C89A3D]" />
                <h3 className="text-base font-bold text-gray-900">All Top Selling Products Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Unit Price</th>
                    <th className="py-2.5 px-3">Units Sold</th>
                    <th className="py-2.5 px-3 text-right">Revenue (EGP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {TOP_PRODUCTS.map((p) => (
                    <tr key={p.sku} className="hover:bg-gray-50/60">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border" />
                          <span className="font-bold text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">{p.sku}</td>
                      <td className="py-3 px-3 text-gray-600">{p.category}</td>
                      <td className="py-3 px-3 font-medium text-gray-700">EGP {p.price}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">{p.unitsSold}</td>
                      <td className="py-3 px-3 text-right font-extrabold text-emerald-600">EGP {p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: Full Customer Report ── */}
      {activeModal === 'customers' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#C89A3D]" />
                <h3 className="text-base font-bold text-gray-900">Full Customer Analytics Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 text-purple-700 font-bold mb-1">
                  <UserPlus size={15} />
                  <span>New Customers</span>
                </div>
                <p className="text-xl font-extrabold text-gray-900">342</p>
                <span className="text-[10px] font-bold text-emerald-600">+22.5% vs last month</span>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-700 font-bold mb-1">
                  <UserCheck size={15} />
                  <span>Returning Customers</span>
                </div>
                <p className="text-xl font-extrabold text-gray-900">514</p>
                <span className="text-[10px] font-bold text-emerald-600">+15.3% vs last month</span>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                  <Repeat size={15} />
                  <span>Retention Rate</span>
                </div>
                <p className="text-xl font-extrabold text-gray-900">62.7%</p>
                <span className="text-[10px] font-bold text-emerald-600">+8.6% vs last month</span>
              </div>

              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 text-amber-700 font-bold mb-1">
                  <DollarSign size={15} />
                  <span>Avg Customer LTV</span>
                </div>
                <p className="text-xl font-extrabold text-gray-900">EGP 3,450</p>
                <span className="text-[10px] font-bold text-emerald-600">+12.4% vs last month</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
