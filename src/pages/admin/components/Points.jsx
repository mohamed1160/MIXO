import { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Crown,
  Search,
  Plus,
  Minus,
  CheckCircle,
  Gift,
  Settings,
  Sparkles,
  Users,
  ShoppingBag,
  TrendingUp,
  History,
  X,
  Check,
  RefreshCw,
} from 'lucide-react';

const INITIAL_CUSTOMER_POINTS = [];

export default function Points() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All Tiers');
  const [toastMessage, setToastMessage] = useState(null);

  // Global Points Rule Configuration State
  const [pointsRule, setPointsRule] = useState({
    pointsPerItem: 0,
    signupBonus: 0,
    redemptionRate: 0,
    minRedeemPoints: 0,
  });

  // Modal for Manual Points Adjustment
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(10);
  const [adjustType, setAdjustType] = useState('add'); // 'add' | 'deduct'
  const [adjustReason, setAdjustReason] = useState('Manual Loyalty Adjustment');

  // Load from localStorage
  useEffect(() => {
    try {
      const storedCust = JSON.parse(localStorage.getItem('MIXO_admin_customer_points') || '[]');
      if (storedCust.length > 0) {
        setCustomers(storedCust);
      } else {
        setCustomers(INITIAL_CUSTOMER_POINTS);
      }

      const storedRule = JSON.parse(localStorage.getItem('MIXO_admin_points_rule') || 'null');
      if (storedRule) {
        setPointsRule(storedRule);
      }
    } catch {
      setCustomers(INITIAL_CUSTOMER_POINTS);
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveRule = (e) => {
    e.preventDefault();
    localStorage.setItem('MIXO_admin_points_rule', JSON.stringify(pointsRule));
    triggerToast(`Loyalty Points rule saved: ${pointsRule.pointsPerItem} points per ordered item! 👑`);
  };

  const handleAdjustPoints = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !adjustAmount) return;

    const qty = parseInt(adjustAmount, 10);
    const updated = customers.map((c) => {
      if (c.id === selectedCustomer.id) {
        const change = adjustType === 'add' ? qty : -qty;
        const newAvailable = Math.max(0, c.availablePoints + change);
        const newEarned = adjustType === 'add' ? c.pointsEarned + qty : c.pointsEarned;
        return {
          ...c,
          availablePoints: newAvailable,
          pointsEarned: newEarned,
          lastActivity: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        };
      }
      return c;
    });

    setCustomers(updated);
    localStorage.setItem('MIXO_admin_customer_points', JSON.stringify(updated));

    // Sync points to user profile in localStorage
    try {
      const target = updated.find((c) => c.id === selectedCustomer.id);
      if (target && target.email) {
        const regUsers = JSON.parse(localStorage.getItem('MIXO_registered_users') || '[]');
        const updatedUsers = regUsers.map((u) =>
          u.email?.toLowerCase() === target.email.toLowerCase()
            ? { ...u, availablePoints: target.availablePoints }
            : u
        );
        localStorage.setItem('MIXO_registered_users', JSON.stringify(updatedUsers));

        const currentUser = JSON.parse(localStorage.getItem('MIXO_current_user') || 'null');
        if (currentUser && currentUser.email?.toLowerCase() === target.email.toLowerCase()) {
          localStorage.setItem(
            'MIXO_current_user',
            JSON.stringify({ ...currentUser, availablePoints: target.availablePoints })
          );
        }
      }
    } catch (e) {
      console.error(e);
    }

    triggerToast(
      `${adjustType === 'add' ? 'Added' : 'Deducted'} ${qty} points for ${selectedCustomer.name}! ✨`
    );
    setSelectedCustomer(null);
  };

  // Stats calculation
  const totalPointsAwarded = useMemo(() => customers.reduce((sum, c) => sum + c.pointsEarned, 0), [customers]);
  const totalActivePoints = useMemo(() => customers.reduce((sum, c) => sum + c.availablePoints, 0), [customers]);
  const totalRedeemed = useMemo(() => customers.reduce((sum, c) => sum + c.pointsRedeemed, 0), [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchesTier = tierFilter === 'All Tiers' || c.tier === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [customers, searchQuery, tierFilter]);

  return (
    <div className="flex flex-col gap-6 font-sans text-gray-800 relative">
      {/* Toast */}
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
            Dashboard &gt; <span className="text-gray-700 font-semibold">Loyalty Points</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Points & Rewards</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure automated order points (e.g. 5 points per item) and manage customer loyalty balances
          </p>
        </div>
      </div>

      {/* ── 4 KPI Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-gray-500">Total Points Awarded</span>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalPointsAwarded.toLocaleString()} Pts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-gray-500">Active Customer Balance</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalActivePoints.toLocaleString()} Pts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Crown size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-gray-500">Points Redeemed</span>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">{totalRedeemed.toLocaleString()} Pts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Gift size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-gray-500">Active Rule</span>
            <p className="text-lg font-extrabold text-gray-900 mt-1">{pointsRule.pointsPerItem} Pts / Item</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Settings size={20} />
          </div>
        </div>
      </div>

      {/* ── Points Earning Rule Configuration Card ── */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-[#C89A3D]" />
            <h3 className="font-bold text-gray-900 text-sm">Automated Order Points Rule</h3>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">Applied automatically on checkout</span>
        </div>

        <form onSubmit={handleSaveRule} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Points Earned Per Item Ordered</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                required
                value={pointsRule.pointsPerItem}
                onChange={(e) => setPointsRule({ ...pointsRule, pointsPerItem: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D]"
              />
              <span className="text-gray-500 font-semibold shrink-0">Points / Piece</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Sign-up Welcome Bonus</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                required
                value={pointsRule.signupBonus}
                onChange={(e) => setPointsRule({ ...pointsRule, signupBonus: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D]"
              />
              <span className="text-gray-500 font-semibold shrink-0">Points</span>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#C89A3D] hover:bg-[#b58832] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check size={15} />
              <span>Save Points Rules</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#C89A3D] text-gray-700 placeholder-gray-400 bg-gray-50/50"
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#C89A3D] cursor-pointer"
        >
          <option value="All Tiers">All Tiers</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Pharaoh">Pharaoh</option>
        </select>
      </div>

      {/* ── Customer Points Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Tier</th>
                <th className="py-3.5 px-4">Items Purchased</th>
                <th className="py-3.5 px-4">Total Earned</th>
                <th className="py-3.5 px-4">Redeemed</th>
                <th className="py-3.5 px-4">Available Points</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-xs">
                    No customers found matching search filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C89A3D]/20 text-[#C89A3D] flex items-center justify-center font-bold text-xs shrink-0">
                          {c.name?.[0] || 'U'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-xs">{c.name}</span>
                          <span className="text-[11px] text-gray-400 font-mono">{c.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${c.tierColor}`}>
                        👑 {c.tier}
                      </span>
                    </td>

                    {/* Items Purchased */}
                    <td className="py-3.5 px-4 font-bold text-gray-800">{c.totalItemsPurchased} items</td>

                    {/* Total Earned */}
                    <td className="py-3.5 px-4 font-bold text-amber-600">{c.pointsEarned} Pts</td>

                    {/* Redeemed */}
                    <td className="py-3.5 px-4 text-gray-500 font-medium">{c.pointsRedeemed} Pts</td>

                    {/* Available Balance */}
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        {c.availablePoints} Pts
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                      >
                        Adjust Points
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Adjust Points Modal ── */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Award size={18} className="text-[#C89A3D]" />
                <span>Adjust Points for {selectedCustomer.name}</span>
              </h3>
              <button type="button" onClick={() => setSelectedCustomer(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustPoints} className="flex flex-col gap-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                <span className="font-bold text-amber-900">Current Balance:</span>
                <span className="font-extrabold text-amber-950 text-sm">{selectedCustomer.availablePoints} Points</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Action Type</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D] cursor-pointer"
                  >
                    <option value="add">➕ Add Points</option>
                    <option value="deduct">➖ Deduct Points</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">Points Amount</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 font-bold focus:outline-none focus:border-[#C89A3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Reason / Note</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 font-medium focus:outline-none focus:border-[#C89A3D]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#C89A3D] hover:bg-[#b58832] rounded-xl shadow-xs"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

