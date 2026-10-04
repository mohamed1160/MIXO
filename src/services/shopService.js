import api from '../api/axios';
import { MOCK_PRODUCTS, mapCategoryToId } from "./products";
import { applyFilters } from "../utils/filter";
import { applySort } from "../utils/sort";
import { applyPagination } from "../utils/pagination";
import { getSupabaseProducts } from './db.service';

export const shopService = {
  getProducts: async ({ filters, sort, page = 1, limit = 12 }) => {
    let allProducts = [];

    try {
      const supaProducts = await getSupabaseProducts();
      if (supaProducts && supaProducts.length > 0) {
        allProducts = supaProducts;
      } else {
        const saved = localStorage.getItem('MIXO_products');
        if (saved) {
          allProducts = JSON.parse(saved);
        }
      }
    } catch (e) {
      console.warn('Supabase getProducts fallback in shopService:', e);
      const saved = localStorage.getItem('MIXO_products');
      if (saved) {
        try {
          allProducts = JSON.parse(saved);
        } catch (err) {}
      }
    }

    const normalizedProducts = allProducts.map((item) => {
      const primaryImg = item.image || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80';
      const imgList = Array.isArray(item.images) && item.images.length > 0 ? item.images : [primaryImg];

      return {
        id: item.id,
        title: item.title || item.name,
        name: item.name || item.title,
        price: Number(item.price) || 0,
        oldPrice: item.oldPrice || item.originalPrice || null,
        originalPrice: item.originalPrice || item.oldPrice || null,
        description: item.description || '',
        category: item.category || 'Figures & Collectibles',
        categoryId: item.categoryId || mapCategoryToId(item.category),
        stock: item.stock ?? (item.inStock !== false ? 10 : 0),
        inStock: item.inStock !== false,
        ratings: item.rating || item.ratings || 0,
        numReviews: item.reviewCount || item.numReviews || 0,
        colors: item.colors || [],
        sizes: item.sizes || [],
        image: primaryImg,
        images: imgList,
        material: item.material || 'PLA Plus',
        isNewArrival: item.isNewArrival ?? false,
        isBestSeller: item.isBestSeller ?? false,
      };
    });

    // 1. Filter
    const filtered = applyFilters(normalizedProducts, filters);
    // 2. Sort
    const sorted = applySort(filtered, sort);
    // 3. Paginate
    const paginated = applyPagination(sorted, page, limit);

    return {
      data: paginated,
      total: sorted.length,
      page,
      totalPages: Math.ceil(sorted.length / limit) || 1,
    };
  },

  getCategories: async () => {
    try {
      const response = await api.get('/categories?populate=*');
      if (response.data?.data) {
        return response.data.data;
      }
    } catch (e) {
      console.log('Categories API error:', e.message);
    }
    return [];
  },

  getBanners: async () => {
    try {
      const response = await api.get('/banners?populate=*');
      if (response.data?.data) {
        return response.data.data;
      }
    } catch (e) {
      console.log('Banners API error:', e.message);
    }
    return [];
  }
};
