import heroDragonImg from "../assets/images/3dprint/hero_dragon.jpg";
import customVaseImg from "../assets/images/3dprint/custom_vase.jpg";
import filamentImg from "../assets/images/3dprint/filament_spools.jpg";
import { getSupabaseProducts } from './db.service';

export const CATEGORIES = [
  { id: "figures", nameKey: "figures", icon: "🐉", defaultName: "Figures & Collectibles", arName: "مجسمات ومقتنيات" },
  { id: "masks", nameKey: "masks", icon: "🎭", defaultName: "Masks & Wearables", arName: "ماسكات وأقنعة" },
  { id: "decor", nameKey: "homeDecor", icon: "🪴", defaultName: "Home Decor", arName: "ديكور المنزل" },
  { id: "stands", nameKey: "phoneStands", icon: "📱", defaultName: "Phone Stands", arName: "حوامل الهواتف" },
  { id: "tools", nameKey: "tools", icon: "⚙️", defaultName: "Tools & Functional", arName: "أدوات ومستلزمات" },
  { id: "vases", nameKey: "vases", icon: "🏺", defaultName: "Vases & Art", arName: "فازات وتحف فنية" },
  { id: "gaming", nameKey: "gaming", icon: "🎮", defaultName: "Gaming & Cosplay", arName: "ألعاب وإكسسوارات" },
  { id: "keychains", nameKey: "keychains", icon: "🔑", defaultName: "Keychains & Tags", arName: "ميداليات وإكسسوارات" },
  { id: "3d-models", nameKey: "3dModels", icon: "🧊", defaultName: "3D Models", arName: "موديلات 3D" },
];

export function getAllCategories() {
  const saved = localStorage.getItem('MIXO_custom_categories');
  let custom = [];
  if (saved) {
    try {
      custom = JSON.parse(saved);
    } catch (e) {}
  }

  const list = [...CATEGORIES];
  custom.forEach((cat) => {
    if (!list.some((c) => c.id === cat.id || c.defaultName.toLowerCase() === cat.defaultName.toLowerCase())) {
      list.push(cat);
    }
  });
  return list;
}

export function saveCustomCategory(newCategoryName, icon = "📦") {
  if (!newCategoryName || !newCategoryName.trim()) return null;
  const cleanName = newCategoryName.trim();
  const id = cleanName.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;

  const existingCustom = localStorage.getItem('MIXO_custom_categories');
  let custom = existingCustom ? JSON.parse(existingCustom) : [];

  const newCatObj = {
    id,
    nameKey: id,
    icon: icon || "📦",
    defaultName: cleanName,
    arName: cleanName,
    custom: true
  };

  if (!custom.some((c) => c.id === id || c.defaultName.toLowerCase() === cleanName.toLowerCase())) {
    custom.push(newCatObj);
    localStorage.setItem('MIXO_custom_categories', JSON.stringify(custom));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('mixo_categories_updated'));
  }
  return newCatObj;
}

export const MOCK_3D_PRODUCTS = [];

export function mapCategoryToId(catName = "") {
  if (!catName) return "figures";
  const str = String(catName).toLowerCase().trim();

  if (str.includes("figure") || str.includes("مجسمات") || str.includes("مقتنيات")) return "figures";
  if (str.includes("mask") || str.includes("ماسكات") || str.includes("أقنعة")) return "masks";
  if (str.includes("decor") || str.includes("ديكور")) return "decor";
  if (str.includes("stand") || str.includes("phone") || str.includes("حوامل") || str.includes("هواتف")) return "stands";
  if (str.includes("tool") || str.includes("functional") || str.includes("أدوات") || str.includes("مستلزمات")) return "tools";
  if (str.includes("vase") || str.includes("art") || str.includes("فازات") || str.includes("تحف")) return "vases";
  if (str.includes("game") || str.includes("gaming") || str.includes("cosplay") || str.includes("ألعاب") || str.includes("إكسسوارات")) return "gaming";
  if (str.includes("keychain") || str.includes("tag") || str.includes("ميداليات")) return "keychains";
  if (str.includes("3d") || str.includes("model") || str.includes("موديل")) return "3d-models";

  const allCats = getAllCategories();
  const found = allCats.find((c) => c.id === str || c.defaultName.toLowerCase() === str || c.arName.toLowerCase() === str);
  if (found) return found.id;

  return str;
}

export function getCategoryCounts(products = []) {
  const counts = {};
  const allCats = getAllCategories();
  allCats.forEach((cat) => {
    counts[cat.id] = 0;
  });

  if (!products || !Array.isArray(products)) return counts;

  products.forEach((prod) => {
    const rawCat = prod.category || prod.categoryId || "";
    const mappedId = prod.categoryId && allCats.some((c) => c.id === prod.categoryId)
      ? prod.categoryId
      : mapCategoryToId(rawCat);

    if (counts[mappedId] !== undefined) {
      counts[mappedId] += 1;
    } else {
      counts[mappedId] = 1;
    }
  });

  return counts;
}

export async function getProducts(options = {}) {
  const { sort = "popular", limit = 6, category = null } = options;
  
  let rawProducts = [];
  try {
    const supaProds = await getSupabaseProducts();
    if (supaProds && supaProds.length > 0) {
      rawProducts = supaProds;
    } else {
      const customProds = localStorage.getItem('MIXO_products');
      if (customProds) {
        rawProducts = JSON.parse(customProds);
      }
    }
  } catch (e) {
    console.error('Error reading products in getProducts:', e);
    const customProds = localStorage.getItem('MIXO_products');
    if (customProds) {
      try {
        rawProducts = JSON.parse(customProds);
      } catch (err) {}
    }
  }

  const mappedProducts = (rawProducts || []).map(p => ({
    id: p.id || `prod-${Math.random()}`,
    title: p.name || p.title,
    name: p.name || p.title,
    image: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
    images: p.images?.length ? p.images : [p.image || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80'],
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    rating: p.rating || 0,
    reviewCount: p.reviewCount || p.reviewsCount || 0,
    reviewsCount: p.reviewsCount || p.reviewCount || 0,
    category: p.category || 'Figures & Collectibles',
    categoryId: p.categoryId || mapCategoryToId(p.category),
    description: p.description || '',
    material: p.material || 'PLA Plus',
    isPopular: false,
    isBestSeller: p.isBestSeller || false,
    stock: p.inStock !== false ? 10 : 0,
    inStock: p.inStock !== false
  }));

  let result = [...mappedProducts];

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
