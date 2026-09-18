import { mapCategoryToId } from "../services/products";

export const applyFilters = (products, filters) => {
  if (!products || !Array.isArray(products)) return [];
  if (!filters) return products;

  return products.filter((product) => {
    if (!product) return false;

    const title = (product.title || product.name || "").toLowerCase();
    const categoryName = (product.category || "").toLowerCase();
    const categoryId = (product.categoryId || mapCategoryToId(product.category)).toLowerCase();
    const description = (product.description || "").toLowerCase();
    const collection = (product.collection || "").toLowerCase();

    // 1. Search Query
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const query = filters.searchQuery.trim().toLowerCase();
      const matches =
        title.includes(query) ||
        categoryName.includes(query) ||
        categoryId.includes(query) ||
        description.includes(query) ||
        collection.includes(query);

      if (!matches) return false;
    }

    // 2. Category Filter (Multi-select support)
    const selectedCategories =
      Array.isArray(filters.categories) && filters.categories.length > 0
        ? filters.categories
        : filters.category && filters.category !== "All"
        ? [filters.category]
        : [];

    if (selectedCategories.length > 0) {
      const prodCatId = categoryId || mapCategoryToId(product.category);
      const matchesCategory = selectedCategories.some((cat) => {
        const selectedCat = cat.toLowerCase();
        const mappedSelectedCat = mapCategoryToId(cat);
        return (
          prodCatId === selectedCat ||
          prodCatId === mappedSelectedCat ||
          categoryName === selectedCat ||
          categoryName.includes(selectedCat) ||
          (selectedCat === "masks" && (product.isMask || categoryName.includes("mask")))
        );
      });

      if (!matchesCategory) return false;
    }

    // 3. Price Filter (minPrice & maxPrice)
    const price = Number(product.price) || 0;
    const minP = Number(filters.minPrice);
    const maxP = Number(filters.maxPrice);

    if (!isNaN(minP) && minP > 0 && price < minP) {
      return false;
    }
    if (!isNaN(maxP) && maxP > 0 && price > maxP) {
      return false;
    }

    // 4. Availability Filter
    if (filters.inStock && !filters.outOfStock) {
      const stock = product.stock ?? 10;
      if (stock <= 0) return false;
    }
    if (filters.outOfStock && !filters.inStock) {
      const stock = product.stock ?? 10;
      if (stock > 0) return false;
    }

    // 5. Sizes Filter
    if (filters.sizes && filters.sizes.length > 0) {
      const productSizes = product.sizes || [];
      if (!filters.sizes.some((size) => productSizes.includes(size))) {
        return false;
      }
    }

    // 6. Colors Filter
    if (filters.colors && filters.colors.length > 0) {
      const productColors = product.colors || [];
      if (!filters.colors.some((color) => productColors.includes(color))) {
        return false;
      }
    }

    // 7. Materials Filter
    if (filters.materials && filters.materials.length > 0) {
      const productMaterial = product.material || "PLA";
      if (!filters.materials.includes(productMaterial)) return false;
    }

    // 8. Collections Filter
    if (filters.collections && filters.collections.length > 0) {
      if (!filters.collections.includes(product.collection)) return false;
    }

    // 9. Gender Filter
    if (filters.genders && filters.genders.length > 0) {
      if (!filters.genders.includes(product.gender)) return false;
    }

    // 10. Rating Filter
    if (filters.minRating && Number(filters.minRating) > 0) {
      const rating = Number(product.rating || product.ratings || 0);
      if (rating < Number(filters.minRating)) return false;
    }

    // 11. Discount Only Filter
    if (filters.discountOnly) {
      if (!product.oldPrice || product.oldPrice <= price) return false;
    }

    return true;
  });
};
