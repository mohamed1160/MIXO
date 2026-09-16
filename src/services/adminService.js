/* ═══════════════════════════════════════════════════════════════
   MIXO Admin — Service Layer
   Wraps mock data with async interface, ready for real API swap.
   ═══════════════════════════════════════════════════════════════ */

import api from '../api/axios';
import { getAdminData } from './adminMockData';

/** Simulates API delay */
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

/* ── Dashboard ── */
export const dashboardService = {
  async getStats() {
    try {
      const res = await api.get('/admin/dashboard-stats');
      if (res.data?.stats) {
        return res.data.stats;
      } else if (res.data) {
        return res.data;
      }
    } catch (e) {
      console.log('Strapi admin stats fallback:', e.message);
    }
    await delay(200);
    const { stats } = getAdminData();
    return stats;
  },
  async getSalesLast7Days() {
    await delay(150);
    return getAdminData().salesLast7Days;
  },
  async getSalesLastMonth() {
    await delay(150);
    return getAdminData().salesLastMonth;
  },
  async getTopSellingProducts() {
    await delay(150);
    return getAdminData().topSellingProducts;
  },
  async getTopCustomers() {
    await delay(150);
    return getAdminData().topCustomers;
  },
  async getRecentOrders(limit = 10) {
    await delay(200);
    const { orders } = getAdminData();
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
  },
  async getRecentCustomers(limit = 5) {
    await delay(200);
    const { customers } = getAdminData();
    return [...customers].sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)).slice(0, limit);
  },
};

/* ── Customers ── */
export const customerService = {
  async getAll(params = {}) {
    await delay();
    let { customers } = getAdminData();
    if (params.search) {
      const q = params.search.toLowerCase();
      customers = customers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'all') {
      customers = customers.filter((c) => c.status === params.status);
    }
    const total = customers.length;
    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const paginated = customers.slice((page - 1) * perPage, page * perPage);
    return { data: paginated, total, pages: Math.ceil(total / perPage) };
  },
  async getById(id) {
    await delay();
    return getAdminData().customers.find((c) => c.id === id);
  },
  async update(id, data) {
    await delay();
    const { customers } = getAdminData();
    const idx = customers.findIndex((c) => c.id === id);
    if (idx >= 0) customers[idx] = { ...customers[idx], ...data };
    return customers[idx];
  },
  async block(id) {
    return this.update(id, { status: 'Blocked' });
  },
  async unblock(id) {
    return this.update(id, { status: 'Active' });
  },
  async resetPassword(id) {
    await delay(500);
    return { success: true, message: 'Password reset link sent to customer email.' };
  },
  async delete(id) {
    await delay();
    const data = getAdminData();
    data.customers = data.customers.filter((c) => c.id !== id);
    return { success: true };
  },
};

/* ── Orders ── */
export const orderService = {
  async getAll(params = {}) {
    await delay();
    let { orders } = getAdminData();
    if (params.search) {
      const q = params.search.toLowerCase();
      orders = orders.filter(
        (o) => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q)
      );
    }
    if (params.paymentStatus && params.paymentStatus !== 'all') {
      orders = orders.filter((o) => o.paymentStatus === params.paymentStatus);
    }
    if (params.shippingStatus && params.shippingStatus !== 'all') {
      orders = orders.filter((o) => o.shippingStatus === params.shippingStatus);
    }
    orders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = orders.length;
    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const paginated = orders.slice((page - 1) * perPage, page * perPage);
    return { data: paginated, total, pages: Math.ceil(total / perPage) };
  },
  async getById(id) {
    await delay();
    return getAdminData().orders.find((o) => o.id === id);
  },
  async updateStatus(id, updates) {
    await delay();
    const { orders } = getAdminData();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx >= 0) orders[idx] = { ...orders[idx], ...updates };
    return orders[idx];
  },
};

/* ── Payment Verification ── */
export const paymentService = {
  async getPending() {
    await delay();
    const { orders } = getAdminData();
    return orders.filter((o) => o.paymentStatus === 'Pending');
  },
  async approve(orderId) {
    await delay(500);
    const { orders } = getAdminData();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx >= 0) {
      orders[idx].paymentStatus = 'Paid';
      orders[idx].orderStatus = 'Processing';
      orders[idx].shippingStatus = 'Preparing';
    }
    return orders[idx];
  },
  async reject(orderId, reason) {
    await delay(500);
    const { orders } = getAdminData();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx >= 0) {
      orders[idx].paymentStatus = 'Failed';
      orders[idx].rejectionReason = reason;
    }
    return orders[idx];
  },
};

/* ── Products ── */
export const productService = {
  async getAll(params = {}) {
    await delay();
    let { products } = getAdminData();
    if (params.search) {
      const q = params.search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }
    if (params.category && params.category !== 'all') {
      products = products.filter((p) => p.category === params.category);
    }
    if (params.stockStatus === 'out') {
      products = products.filter((p) => p.stock === 0);
    } else if (params.stockStatus === 'low') {
      products = products.filter((p) => p.stock > 0 && p.stock < 5);
    }
    const total = products.length;
    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const paginated = products.slice((page - 1) * perPage, page * perPage);
    return { data: paginated, total, pages: Math.ceil(total / perPage) };
  },
  async create(data) {
    await delay(500);
    const { products } = getAdminData();
    const newProduct = {
      id: `PRD-${String(products.length + 1).padStart(4, '0')}`,
      ...data,
      createdAt: new Date().toISOString(),
      soldCount: 0,
    };
    products.push(newProduct);
    return newProduct;
  },
  async update(id, data) {
    await delay();
    const { products } = getAdminData();
    const idx = products.findIndex((p) => p.id === id);
    if (idx >= 0) products[idx] = { ...products[idx], ...data };
    return products[idx];
  },
  async delete(id) {
    await delay();
    const data = getAdminData();
    data.products = data.products.filter((p) => p.id !== id);
    return { success: true };
  },
  async toggleVisibility(id) {
    await delay();
    const { products } = getAdminData();
    const p = products.find((p) => p.id === id);
    if (p) p.visible = !p.visible;
    return p;
  },
};

/* ── Promo Codes ── */
export const promoService = {
  async getAll() {
    await delay();
    return getAdminData().promoCodes;
  },
  async create(data) {
    await delay(500);
    const { promoCodes } = getAdminData();
    const newPromo = { id: `promo-${promoCodes.length + 1}`, usedCount: 0, ...data };
    promoCodes.push(newPromo);
    return newPromo;
  },
  async update(id, data) {
    await delay();
    const { promoCodes } = getAdminData();
    const idx = promoCodes.findIndex((p) => p.id === id);
    if (idx >= 0) promoCodes[idx] = { ...promoCodes[idx], ...data };
    return promoCodes[idx];
  },
  async delete(id) {
    await delay();
    const data = getAdminData();
    data.promoCodes = data.promoCodes.filter((p) => p.id !== id);
    return { success: true };
  },
  async toggleActive(id) {
    await delay();
    const { promoCodes } = getAdminData();
    const p = promoCodes.find((p) => p.id === id);
    if (p) p.active = !p.active;
    return p;
  },
};

/* ── Reviews ── */
export const reviewService = {
  async getAll(params = {}) {
    await delay();
    let { reviews } = getAdminData();
    if (params.status && params.status !== 'all') {
      reviews = reviews.filter((r) => r.status === params.status);
    }
    const total = reviews.length;
    const page = params.page || 1;
    const perPage = params.perPage || 10;
    const paginated = reviews.slice((page - 1) * perPage, page * perPage);
    return { data: paginated, total, pages: Math.ceil(total / perPage) };
  },
  async approve(id) {
    await delay();
    const { reviews } = getAdminData();
    const r = reviews.find((r) => r.id === id);
    if (r) r.status = 'Approved';
    return r;
  },
  async reject(id) {
    await delay();
    const { reviews } = getAdminData();
    const r = reviews.find((r) => r.id === id);
    if (r) r.status = 'Rejected';
    return r;
  },
  async delete(id) {
    await delay();
    const data = getAdminData();
    data.reviews = data.reviews.filter((r) => r.id !== id);
    return { success: true };
  },
};

/* ── Categories ── */
export const categoryService = {
  async getAll() {
    await delay();
    return getAdminData().categories;
  },
  async create(data) {
    await delay(500);
    const { categories } = getAdminData();
    const newCat = {
      id: `cat-${categories.length + 1}`,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      productsCount: 0,
      status: 'active',
      ...data,
    };
    categories.push(newCat);
    return newCat;
  },
  async update(id, data) {
    await delay();
    const { categories } = getAdminData();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx >= 0) categories[idx] = { ...categories[idx], ...data };
    return categories[idx];
  },
  async delete(id) {
    await delay();
    const data = getAdminData();
    data.categories = data.categories.filter((c) => c.id !== id);
    return { success: true };
  },
};

/* ── Banners ── */
export const bannerService = {
  async getAll() {
    await delay();
    return getAdminData().banners;
  },
  async create(data) {
    await delay(500);
    const { banners } = getAdminData();
    const newBanner = { id: `ban-${banners.length + 1}`, order: banners.length + 1, ...data };
    banners.push(newBanner);
    return newBanner;
  },
  async update(id, data) {
    await delay();
    const { banners } = getAdminData();
    const idx = banners.findIndex((b) => b.id === id);
    if (idx >= 0) banners[idx] = { ...banners[idx], ...data };
    return banners[idx];
  },
  async delete(id) {
    await delay();
    const data = getAdminData();
    data.banners = data.banners.filter((b) => b.id !== id);
    return { success: true };
  },
  async reorder(orderedIds) {
    await delay();
    const { banners } = getAdminData();
    orderedIds.forEach((id, index) => {
      const b = banners.find((b) => b.id === id);
      if (b) b.order = index + 1;
    });
    return banners.sort((a, b) => a.order - b.order);
  },
};

/* ── Inventory ── */
export const inventoryService = {
  async getLowStock(threshold = 5) {
    await delay();
    const { products } = getAdminData();
    return products.filter((p) => p.stock < threshold);
  },
  async updateStock(productId, newStock) {
    await delay();
    const { products } = getAdminData();
    const p = products.find((p) => p.id === productId);
    if (p) p.stock = newStock;
    return p;
  },
};

/* ── Settings ── */
export const settingsService = {
  async get() {
    await delay();
    return getAdminData().settings;
  },
  async update(section, data) {
    await delay(500);
    const { settings } = getAdminData();
    settings[section] = { ...settings[section], ...data };
    return settings;
  },
  async updateGovernorate(name, shippingCost) {
    await delay();
    const { settings } = getAdminData();
    const gov = settings.shipping.governorates.find((g) => g.name === name);
    if (gov) gov.shippingCost = shippingCost;
    return settings.shipping.governorates;
  },
};

