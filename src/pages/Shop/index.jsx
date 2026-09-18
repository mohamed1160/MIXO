import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useShopStore } from "../../store/useShopStore";
import { shopService } from "../../services/shopService";

import ShopHero from "./components/ShopHero";
import ProductToolbar from "./components/ProductToolbar";
import FilterSidebar from "./components/FilterSidebar";
import FilterDrawer from "./components/FilterDrawer";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Pagination";
import BottomBanner from "./components/BottomBanner";
import CustomDesignModal from "../../components/CustomDesignModal";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useShopStore((state) => state.filters);
  const sort = useShopStore((state) => state.sort);
  const page = useShopStore((state) => state.page);
  const setFilters = useShopStore((state) => state.setFilters);
  const setSort = useShopStore((state) => state.setSort);
  const setPage = useShopStore((state) => state.setPage);

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Custom Order Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Parse initial URL params ONCE
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlPage = searchParams.get("page");
    const urlSort = searchParams.get("sort");
    const urlSearch = searchParams.get("search");

    const updates = {};
    if (urlCategory) updates.category = urlCategory;
    if (urlSearch) updates.searchQuery = urlSearch;

    if (Object.keys(updates).length > 0) {
      setFilters(updates);
    }
    if (urlSort) {
      setSort(urlSort);
    }
    if (urlPage) {
      setPage(Number(urlPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== "All")
      params.set("category", filters.category);
    if (filters.searchQuery)
      params.set("search", filters.searchQuery);
    if (sort !== "Featured") params.set("sort", sort);
    if (page > 1) params.set("page", page.toString());
    setSearchParams(params, { replace: true });
  }, [filters, sort, page, setSearchParams]);

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      const res = await shopService.getProducts({
        filters,
        sort,
        page,
        limit: 12,
      });

      if (isMounted) {
        setProducts(res.data);
        setTotalProducts(res.total);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      }
    };

    fetchData();

    const handleStorageChange = () => {
      fetchData();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mixo_products_updated', handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mixo_products_updated', handleStorageChange);
    };
  }, [filters, sort, page]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B10] text-gray-900 dark:text-[#F5F7FA] font-sans pb-16 transition-colors duration-200">
      
      {/* 1. Shop Hero */}
      <ShopHero />

      {/* 2. Product Toolbar with "Customize Your Design" button */}
      <ProductToolbar
        totalProducts={totalProducts}
        currentPage={page}
        limit={12}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
      />

      {/* 3. Mobile Filter Drawer */}
      <FilterDrawer />

      {/* 4. Main Content Area (Desktop Sidebar + Product Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <FilterSidebar />

          {/* Product Grid */}
          <div className="flex-1 w-full">
            <ProductGrid products={products} isLoading={isLoading} />
            <Pagination totalPages={totalPages} />
          </div>

        </div>
      </div>

      {/* 5. Bottom Promo Banner */}
      <BottomBanner onOpenCustomModal={() => setIsCustomModalOpen(true)} />

      {/* 6. Custom 3D Printing Design Modal */}
      <CustomDesignModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

    </div>
  );
}
