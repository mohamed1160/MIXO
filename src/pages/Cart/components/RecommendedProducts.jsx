import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import ProductCard from "../../Shop/components/ProductCard";
import { useLanguage } from "../../../providers/LanguageContext";

import heroDragonImg from "../../../assets/images/3dprint/hero_dragon.jpg";
import customVaseImg from "../../../assets/images/3dprint/custom_vase.jpg";
import filamentImg from "../../../assets/images/3dprint/filament_spools.jpg";
import oniMaskImg from "../../../assets/images/3dprint/oni_mask.jpg";

export const DEFAULT_3D_PRODUCTS = [
  {
    id: "prod-1",
    name: "Articulated 3D Dragon Figurine",
    nameAr: "تمثال التنين الخرافي 3D",
    nameEn: "Articulated 3D Dragon Figurine",
    category: "3D Models",
    categoryAr: "مجسمات ومقتنيات",
    categoryEn: "Figures & Collectibles",
    price: 450,
    originalPrice: 550,
    oldPrice: 550,
    rating: 4.9,
    salesCount: 34,
    images: [heroDragonImg],
    image: heroDragonImg,
    inStock: true,
    stock: 12,
  },
  {
    id: "prod-2",
    name: "Twisted Spiral Silk Vase 3D",
    nameAr: "فازة حريرية هندسية 3D",
    nameEn: "Twisted Spiral Silk Vase 3D",
    category: "Home Decor",
    categoryAr: "ديكور منزل",
    categoryEn: "Home Decor",
    price: 280,
    originalPrice: 350,
    oldPrice: 350,
    rating: 4.8,
    salesCount: 19,
    images: [customVaseImg],
    image: customVaseImg,
    inStock: true,
    stock: 10,
  },
  {
    id: "prod-3",
    name: "PLA High Toughness Filament 1KG",
    nameAr: "بكرة فيلامينت PLA قوية 1KG",
    nameEn: "PLA High Toughness Filament 1KG",
    category: "Filaments",
    categoryAr: "خامات وفلامنت",
    categoryEn: "Filaments",
    price: 170,
    originalPrice: 200,
    oldPrice: 200,
    rating: 5.0,
    salesCount: 88,
    images: [filamentImg],
    image: filamentImg,
    inStock: true,
    stock: 40,
  },
  {
    id: "prod-4",
    name: "Cyberpunk Samurai Oni Mask 3D",
    nameAr: "قناع أوني الساموراي السايبورغ 3D",
    nameEn: "Cyberpunk Samurai Oni Mask 3D",
    category: "Masks & Wearables",
    categoryAr: "أقنعة وإكسسوارات",
    categoryEn: "Masks & Wearables",
    price: 650,
    originalPrice: 780,
    oldPrice: 780,
    rating: 4.9,
    salesCount: 42,
    images: [oniMaskImg],
    image: oniMaskImg,
    inStock: true,
    stock: 8,
  },
];

export default function RecommendedProducts() {
  const { isRTL } = useLanguage();
  const [products, setProducts] = useState([]);

  const loadProducts = () => {
    try {
      const stored = localStorage.getItem("MIXO_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Error loading products from dashboard localStorage:", e);
    }
    // Fallback to default products without overwriting LocalStorage
    setProducts(DEFAULT_3D_PRODUCTS);
  };

  useEffect(() => {
    loadProducts();

    // Listen to localStorage changes (from other tabs or Admin panel)
    window.addEventListener("storage", loadProducts);
    return () => window.removeEventListener("storage", loadProducts);
  }, []);

  // Format product data uniformly for ProductCard
  const formattedProducts = products.slice(0, 4).map((p) => {
    const imagesList = p.images?.length ? p.images : [p.image || heroDragonImg];
    return {
      ...p,
      id: p.id,
      name: p.name,
      nameAr: p.nameAr || p.name,
      nameEn: p.nameEn || p.name,
      price: typeof p.price === 'number' ? p.price : parseFloat(p.price || 0),
      oldPrice: p.oldPrice || p.originalPrice,
      category: p.category,
      categoryAr: p.categoryAr || p.category,
      categoryEn: p.categoryEn || p.category,
      images: imagesList,
      stock: p.stock !== undefined ? p.stock : (p.inStock !== false ? 10 : 0),
      rating: p.rating || 4.9,
      sold: p.salesCount || p.sold || 24,
    };
  });

  return (
    <section className="w-full mt-14 sm:mt-20 mb-12 font-sans">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-3">
        <Sparkles className="w-5 h-5 text-[#FF1F3D]" />
        <h2 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
          {isRTL ? "قد يعجبك أيضاً — مجسمات 3D مميزة" : "You May Also Like — 3D Prints"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {formattedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
