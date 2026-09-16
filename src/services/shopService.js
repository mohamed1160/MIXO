import api from '../api/axios';
import { MOCK_PRODUCTS } from "./products";
import { applyFilters } from "../utils/filter";
import { applySort } from "../utils/sort";
import { applyPagination } from "../utils/pagination";

export const shopService = {
  getProducts: async ({ filters, sort, page = 1, limit = 12 }) => {
    let allProducts = MOCK_PRODUCTS;

    try {
      const response = await api.get('/products?populate=*');
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        allProducts = response.data.data.map(item => ({
          id: item.id || item.documentId,
          title: item.title || item.attributes?.title,
          slug: item.slug || item.attributes?.slug,
          price: item.price || item.attributes?.price,
          oldPrice: item.oldPrice || item.attributes?.oldPrice,
          description: item.description || item.attributes?.description,
          details: item.details || item.attributes?.details,
          category: item.category?.name || item.attributes?.category?.data?.attributes?.name || item.category || 'General',
          stock: item.stock ?? item.attributes?.stock ?? 10,
          ratings: item.ratings || item.attributes?.ratings || 5,
          numReviews: item.numReviews || item.attributes?.numReviews || 0,
          colors: item.colors || item.attributes?.colors || [],
          sizes: item.sizes || item.attributes?.sizes || [],
          images: item.images?.length ? item.images : (item.attributes?.images || MOCK_PRODUCTS[0].images),
          isNewArrival: item.isNewArrival ?? item.attributes?.isNewArrival ?? false,
          isBestSeller: item.isBestSeller ?? item.attributes?.isBestSeller ?? false,
        }));
      }
    } catch (e) {
      console.log('Strapi products fallback to mock:', e.message);
    }

    // 1. Filter
    const filtered = applyFilters(allProducts, filters);
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
