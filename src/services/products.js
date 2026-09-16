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

export const MOCK_3D_PRODUCTS = [
  // FIGURES
  {
    id: "3d-prod-1",
    title: "Articulated Dragon Figurine",
    name: "Articulated Dragon Figurine",
    image: heroDragonImg,
    images: [heroDragonImg],
    price: 24.99,
    rating: 4.8,
    reviewCount: 234,
    reviewsCount: 234,
    category: "Figures & Collectibles",
    categoryId: "figures",
    description: "Intricately detailed 3D printed dragon figurine with flexible joints and silk dual-color finish.",
    isPopular: true,
    isBestSeller: true,
    stock: 15,
  },
  {
    id: "3d-prod-10",
    title: "Cyberpunk Mech Warrior",
    name: "Cyberpunk Mech Warrior",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80"],
    price: 29.99,
    rating: 4.9,
    reviewCount: 142,
    reviewsCount: 142,
    category: "Figures & Collectibles",
    categoryId: "figures",
    description: "High-detail futuristic robot mech statue 3D printed with matte black and neon red accents.",
    isPopular: true,
    isBestSeller: false,
    stock: 8,
  },

  // MASKS & WEARABLES
  {
    id: "3d-prod-9",
    title: "Cyberpunk Samurai Oni Mask",
    name: "Cyberpunk Samurai Oni Mask",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"],
    price: 34.99,
    rating: 4.9,
    reviewCount: 188,
    reviewsCount: 188,
    category: "Masks & Wearables",
    categoryId: "masks",
    isMask: true,
    description: "Ergonomic 3D printed Samurai cosplay mask with custom face height and circular width fitting options.",
    isPopular: true,
    isBestSeller: true,
    stock: 12,
  },
  {
    id: "3d-prod-11",
    title: "Anubis Ancient Guardian Mask",
    name: "Anubis Ancient Guardian Mask",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"],
    price: 39.99,
    rating: 5.0,
    reviewCount: 95,
    reviewsCount: 95,
    category: "Masks & Wearables",
    categoryId: "masks",
    isMask: true,
    description: "Egyptian inspired Anubis mask with custom circular dimensions and gold leaf finish.",
    isPopular: true,
    isBestSeller: true,
    stock: 6,
  },

  // HOME DECOR
  {
    id: "3d-prod-4",
    title: "Geometric Low-Poly Planter",
    name: "Geometric Low-Poly Planter",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80"],
    price: 14.99,
    rating: 4.8,
    reviewCount: 152,
    reviewsCount: 152,
    category: "Home Decor",
    categoryId: "decor",
    description: "Geometric low-poly succulent planter pot 3D printed with eco-friendly matte white PLA+.",
    isPopular: true,
    isBestSeller: true,
    stock: 20,
  },
  {
    id: "3d-prod-12",
    title: "Parametric Wave Desk Lamp",
    name: "Parametric Wave Desk Lamp",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"],
    price: 32.99,
    rating: 4.9,
    reviewCount: 88,
    reviewsCount: 88,
    category: "Home Decor",
    categoryId: "decor",
    description: "Ambient LED desk lamp with 3D printed translucent parametric shadow shade.",
    isPopular: false,
    isBestSeller: true,
    stock: 9,
  },

  // PHONE STANDS
  {
    id: "3d-prod-3",
    title: "Foldable Ergonomic Phone Stand",
    name: "Foldable Ergonomic Phone Stand",
    image: "https://images.unsplash.com/photo-1586775548406-f94d93540e1a?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1586775548406-f94d93540e1a?auto=format&fit=crop&w=800&q=80"],
    price: 12.99,
    rating: 4.6,
    reviewCount: 82,
    reviewsCount: 82,
    category: "Phone Stands",
    categoryId: "stands",
    description: "Ergonomic foldable phone & tablet stand printed with non-slip base geometry and multi-angle viewing.",
    isPopular: true,
    isBestSeller: true,
    stock: 25,
  },

  // TOOLS & FUNCTIONAL
  {
    id: "3d-prod-2",
    title: "Modular Desk Organizer",
    name: "Modular Desk Organizer",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"],
    price: 16.99,
    rating: 4.7,
    reviewCount: 98,
    reviewsCount: 98,
    category: "Tools & Functional",
    categoryId: "tools",
    description: "Modern modular desk organizer 3D printed with durable PETG. Perfect for pens, SD cards, tools and cables.",
    isPopular: true,
    isBestSeller: true,
    stock: 14,
  },
  {
    id: "3d-prod-5",
    title: "Planetary Gear Fidget Toy",
    name: "Planetary Gear Fidget Toy",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"],
    price: 9.99,
    rating: 4.9,
    reviewCount: 76,
    reviewsCount: 76,
    category: "Tools & Functional",
    categoryId: "tools",
    description: "Smooth planetary gear fidget toy printed print-in-place with satisfying mechanical spin tactile response.",
    isPopular: true,
    isBestSeller: false,
    stock: 30,
  },

  // VASES & ART
  {
    id: "3d-prod-7",
    title: "Twisted Spiral Silk Vase",
    name: "Twisted Spiral Silk Vase",
    image: customVaseImg,
    images: [customVaseImg],
    price: 21.99,
    rating: 4.9,
    reviewCount: 140,
    reviewsCount: 140,
    category: "Vases & Art",
    categoryId: "vases",
    description: "Seamless spiral vase 3D printed with spiralize outer contour mode for silk reflection finish.",
    isPopular: false,
    isBestSeller: true,
    stock: 10,
  },

  // GAMING
  {
    id: "3d-prod-6",
    title: "Dual Controller & Headset Stand",
    name: "Dual Controller & Headset Stand",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80"],
    price: 17.99,
    rating: 4.7,
    reviewCount: 106,
    reviewsCount: 106,
    category: "Gaming",
    categoryId: "gaming",
    description: "Heavy-duty dual controller & headset desktop stand 3D printed with weighted anti-scratch padding.",
    isPopular: true,
    isBestSeller: true,
    stock: 18,
  },

  // KEYCHAINS & ACCESSORIES
  {
    id: "3d-prod-8",
    title: "Premium PLA Filament Spool",
    name: "Premium PLA Filament Spool",
    image: filamentImg,
    images: [filamentImg],
    price: 22.99,
    rating: 4.9,
    reviewCount: 310,
    reviewsCount: 310,
    category: "Keychains & Tags",
    categoryId: "keychains",
    description: "1.75mm high-precision dimensional accuracy PLA filament spool and 3D printed accessories.",
    isPopular: false,
    isBestSeller: true,
    stock: 40,
  }
];

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
