import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  Printer,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
  ShieldCheck,
  Eye,
  Plus,
} from "lucide-react";
import { useLanguage } from "../../../providers/LanguageContext";
import heroDragonImg from "../../../assets/images/3dprint/hero_dragon.jpg";

export default function Overview() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem("MIXO_customer_orders") || "[]");
      const storedUsers = JSON.parse(localStorage.getItem("MIXO_registered_users") || "[]");
      const storedMsgs = JSON.parse(localStorage.getItem("MIXO_contact_messages") || "[]");

      setOrders(storedOrders);
      setUsers(storedUsers);
      setMessages(storedMsgs);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute Live Metrics
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingQuotesCount = orders.filter((o) => o.paymentStatus === "Pending Quote" || (o.total === 0)).length;
  const totalUsersCount = users.length;

  // Chart Mock / Calculated Data
  const chartData = [
    { day: "Mon", sales: Math.round(totalSales * 0.1) || 120 },
    { day: "Tue", sales: Math.round(totalSales * 0.15) || 250 },
    { day: "Wed", sales: Math.round(totalSales * 0.2) || 180 },
    { day: "Thu", sales: Math.round(totalSales * 0.25) || 320 },
    { day: "Fri", sales: Math.round(totalSales * 0.18) || 290 },
    { day: "Sat", sales: Math.round(totalSales * 0.3) || 450 },
    { day: "Sun", sales: Math.round(totalSales * 0.35) || 520 },
  ];

  return (
    <div className="flex flex-col gap-8 font-sans text-gray-900 dark:text-[#F5F7FA]">
      
      {/* ── Top Welcome Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span>{isRTL ? "مرحباً بك في لوحة تحكم ميكسو 3D" : "Welcome to Mixo 3D Dashboard"}</span>
            <Sparkles size={20} className="text-[#FF1F3D]" />
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#7F8A96] mt-1">
            {isRTL
              ? "متابعة المبيعات، الطلبات الحية، وطلبات تسعير الطباعة الـ 3D المخصصة."
              : "Live sales metrics, order fulfillment, and 3D printing quote management."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/custom-order"
            className="px-4 py-2.5 bg-red-500/10 hover:bg-[#FF1F3D] text-[#FF1F3D] hover:text-white rounded-xl text-xs font-bold border border-[#FF1F3D]/20 transition-all flex items-center gap-1.5"
          >
            <Printer size={15} />
            <span>{isRTL ? "طلب 3D مخصص" : "Custom 3D Request"}</span>
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-[#FF1F3D] hover:bg-[#E01833] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-red-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>{isRTL ? "إضافة منتج 3D" : "Add 3D Product"}</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Sales */}
        <div className="bg-white dark:bg-[#0F151D] p-5 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-[#7F8A96] uppercase tracking-wider">
              {isRTL ? "إجمالي المبيعات" : "Total Revenue"}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-[#FF1F3D] flex items-center justify-center font-extrabold text-sm">
              $
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">${totalSales.toFixed(2)}</p>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
              +100% Live Sync
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-[#0F151D] p-5 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-[#7F8A96] uppercase tracking-wider">
              {isRTL ? "إجمالي الطلبات" : "Total Orders"}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-extrabold">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalOrdersCount}</p>
            <Link to="/admin/orders" className="text-[11px] font-semibold text-[#FF1F3D] hover:underline mt-1 inline-block">
              {isRTL ? "عرض قائمة الطلبات" : "Manage all orders"}
            </Link>
          </div>
        </div>

        {/* Pending Quotes */}
        <div className="bg-white dark:bg-[#0F151D] p-5 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-[#7F8A96] uppercase tracking-wider">
              {isRTL ? "طلبات التسعير 3D" : "Pending 3D Quotes"}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-extrabold">
              <Printer size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{pendingQuotesCount}</p>
            <span className="text-[11px] font-semibold text-amber-500 mt-1 inline-block">
              {isRTL ? "تتطلب تحديد السعر والتواصل" : "Requires price quote"}
            </span>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white dark:bg-[#0F151D] p-5 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-[#7F8A96] uppercase tracking-wider">
              {isRTL ? "العملاء المسجلين" : "Registered Users"}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-extrabold">
              <Users size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalUsersCount}</p>
            <Link to="/admin/customers" className="text-[11px] font-semibold text-[#FF1F3D] hover:underline mt-1 inline-block">
              {isRTL ? "عرض دليل العملاء" : "View customer list"}
            </Link>
          </div>
        </div>

      </div>

      {/* ── Sales Analytics & Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Chart Container */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1E2630] pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                {isRTL ? "أداء المبيعات والطلبات" : "Sales Performance Analytics"}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isRTL ? "تحليل مباشر للمبيعات اليومية" : "Live daily revenue breakdown"}
              </p>
            </div>
            <span className="text-xs font-bold text-[#FF1F3D] bg-red-500/10 px-3 py-1 rounded-full border border-[#FF1F3D]/20">
              Live Data
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2630" opacity={0.3} />
                <XAxis dataKey="day" stroke="#7F8A96" fontSize={11} />
                <YAxis stroke="#7F8A96" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F151D",
                    borderColor: "#1E2630",
                    borderRadius: "12px",
                    color: "#F5F7FA",
                  }}
                />
                <Line type="monotone" dataKey="sales" stroke="#FF1F3D" strokeWidth={3} dot={{ r: 4, fill: "#FF1F3D" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live System Status Card */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col justify-between gap-4">
          <div className="border-b border-gray-100 dark:border-[#1E2630] pb-3">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
              {isRTL ? "حالة النظام وتأكيد الخامات" : "System Status & Material Spec"}
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5 flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span>100% High-Quality Eco PLA Filament</span>
              </span>
              <p className="text-[11px] text-gray-500 dark:text-[#AAB4C0]">
                {isRTL ? "خامة متوافقة قياسياً لكافة مجسمات وماسكات الـ 3D." : "Standard active filament spec for all 3D prints."}
              </p>
            </div>

            <div className="p-3.5 bg-red-500/5 rounded-2xl border border-[#FF1F3D]/20">
              <span className="font-bold text-[#FF1F3D] block mb-0.5">
                {isRTL ? "تأكيد الدفع ورقم الواتساب" : "Payment & Support Contact"}
              </span>
              <p className="text-[11px] text-gray-500 dark:text-[#AAB4C0]">
                Vodafone Cash / InstaPay & Direct WhatsApp Contact.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-white dark:bg-[#0F151D] p-6 rounded-3xl border border-gray-100 dark:border-[#1E2630] shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1E2630] pb-3">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
            {isRTL ? "أحدث الطلبيات المسجلة" : "Recent Store Orders"}
          </h3>
          <Link to="/admin/orders" className="text-xs font-bold text-[#FF1F3D] hover:underline flex items-center gap-1">
            <span>{isRTL ? "إدارة جميع الطلبات" : "View All Orders"}</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1E2630] text-gray-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">{isRTL ? "الطلب" : "Order ID"}</th>
                <th className="py-3 px-4">{isRTL ? "العميل ورقم الهاتف" : "Customer Phone"}</th>
                <th className="py-3 px-4">{isRTL ? "التاريخ" : "Date"}</th>
                <th className="py-3 px-4">{isRTL ? "الإجمالي" : "Total"}</th>
                <th className="py-3 px-4">{isRTL ? "الحالة" : "Status"}</th>
                <th className="py-3 px-4 text-right">{isRTL ? "الإجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1E2630]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                    {isRTL ? "لا توجد طلبات سابقة مسجلة حتى الآن." : "No live orders recorded yet."}
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 dark:hover:bg-[#151C24]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                      Order #{ord.id}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 dark:text-[#AAB4C0] font-semibold">
                      <div>
                        <span>{ord.customer?.name || "Customer"}</span>
                        <span className="text-[10px] text-[#FF1F3D] block">📞 {ord.customer?.phone || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-[#7F8A96]">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ord.date || "Recent"}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#FF1F3D]">
                      {ord.total > 0 ? `$${Number(ord.total).toFixed(2)}` : (isRTL ? "قيد التسعير" : "Quote Pending")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold border bg-red-500/10 text-[#FF1F3D] border-[#FF1F3D]/20">
                        {ord.orderStatus || ord.paymentStatus || "Processing"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs font-bold text-white bg-gray-900 dark:bg-[#151C24] hover:bg-black px-3 py-1.5 rounded-xl inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye size={13} className="text-[#FF1F3D]" />
                        <span>{isRTL ? "عرض" : "Manage"}</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}