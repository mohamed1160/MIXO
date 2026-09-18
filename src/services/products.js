import heroDragonImg from "../assets/images/3dprint/hero_dragon.jpg";
import customVaseImg from "../assets/images/3dprint/custom_vase.jpg";
import filamentImg from "../assets/images/3dprint/filament_spools.jpg";

export const CATEGORIES = [
  { id: "figures", nameKey: "figures", icon: "🐉", defaultName: "Figures & Collectibles", arName: "مجسمات ومقتنيات" },
  { id: "masks", nameKey: "masks", icon: "🎭", defaultName: "Masks & Wearables", arName: "ماسكات وأقنعة" },
  { id: "decor", nameKey: "homeDecor", icon: "🪴", defaultName: "Home Decor", arName: "ديكور المنزل" },
  { id: "stands", nameKey: "phoneStands", icon: "📱", defaultName: "Phone Stands", arName: "حوامل الهواتف" },
  { id: "tools", nameKey: "tools", icon: "⚙️", defaultName: "Tools & Functional", arName: "أدوات ومستلزمات" },
  { id: "vases", nameKey: "vases", icon: "🏺", defaultName: "Vases & Art", arName: "فازات وتحف فنية" },
  { id: "gaming", nameKey: "gaming", icon: "🎮", defaultName: "Gaming & Cosplay", arName: "ألعاب وإكسسوارات" },
  { id: "keychains", nameKey: "keychains", icon: "🔑", defaultName: "Keychains & Tags", arName: "ميداليات وإكسسوارات" },
];

export const MOCK_3D_PRODUCTS = [];

export function getCategoryCounts(products = MOCK_3D_PRODUCTS) {
  const counts = {};
  CATEGORIES.forEach((cat) => {
    counts[cat.id] = 0;
  });

  products.forEach((prod) => {
    const catId = (prod.categoryId || "").toLowerCase();
    const catName = (prod.category || "").toLowerCase();

    CATEGORIES.forEach((cat) => {
      const targetId = cat.id.toLowerCase();
      if (
        catId === targetId ||
        catName.includes(targetId) ||
        (targetId === "masks" && (prod.isMask || catName.includes("mask")))
      ) {
        counts[cat.id] = (counts[cat.id] || 0) + 1;
      }
    });
  });

  return counts;
}

export async function getProducts(options = {}) {
  const { sort = "popular", limit = 6, category = null } = options;
  
  let allProducts = [...MOCK_3D_PRODUCTS];
  try {
    const customProds = localStorage.getItem('MIXO_products');
    if (customProds) {
      const parsed = JSON.parse(customProds);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Map stored products to format expected by shop
        const mappedCustom = parsed.map(p => ({
          id: p.id || `prod-${Math.random()}`,
          title: p.name || p.title,
          name: p.name || p.title,
          image: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
          images: [p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80'],
          price: p.price || 0,
          originalPrice: p.originalPrice,
          rating: p.rating || 4.9,
          reviewCount: p.salesCount || p.reviewCount || 12,
          reviewsCount: p.salesCount || p.reviewsCount || 12,
          category: p.category || 'Figures & Collectibles',
          categoryId: (p.category || 'figures').toLowerCase().replace(/\s+/g, ''),
          description: p.description || '',
          material: p.material || 'PLA Plus',
          isPopular: true,
          isBestSeller: true,
          stock: p.inStock !== false ? 10 : 0,
          inStock: p.inStock !== false
        }));
        
        // Put custom products at top
        const customIds = new Set(mappedCustom.map(c => c.id));
        allProducts = [...mappedCustom, ...allProducts.filter(p => !customIds.has(p.id))];
      }
    }
  } catch (e) {
    console.error('Error reading MIXO_products in getProducts:', e);
  }

  let result = [...allProducts];

  if (category && category !== "All") {
    const targetCat = category.toLowerCase();
    result = result.filter(
      (p) =>
        (p.categoryId && p.categoryId.toLowerCase() === targetCat) ||
        (p.category && p.category.toLowerCase().includes(targetCat)) ||
        (targetCat === "masks" && p.isMask)
    );
  }

  if (sort === "popular") {
    result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  } else if (sort === "rating") {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === "price-low") {
    result.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === "price-high") {
    result.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  if (limit) {
    result = result.slice(0, limit);
  }

  return result;
}

export const MOCK_PRODUCTS = MOCK_3D_PRODUCTS;
