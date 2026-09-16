import React, { useState, useEffect } from 'react';
import { getSupabaseProducts, saveSupabaseProduct, deleteSupabaseProduct } from '../../../services/db.service';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Layers,
  CheckCircle,
  XCircle,
  Tag,
  DollarSign,
  X,
  Image as ImageIcon,
  Sparkles,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import heroDragonImg from '../../../assets/images/3dprint/hero_dragon.jpg';
import customVaseImg from '../../../assets/images/3dprint/custom_vase.jpg';
import filamentImg from '../../../assets/images/3dprint/filament_spools.jpg';
import oniMaskImg from '../../../assets/images/3dprint/oni_mask.jpg';

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'تمثال التنين الخرافي 3D Articulated Dragon',
    nameAr: 'تمثال التنين الخرافي 3D',
    nameEn: 'Articulated 3D Dragon Figurine',
    price: 450,
    originalPrice: 550,
    category: '3D Models',
    categoryAr: 'مجسمات ومقتنيات',
    categoryEn: 'Figures & Collectibles',
    material: 'PLA Silk Dual Color',
    image: heroDragonImg,
    images: [heroDragonImg],
    description: 'تمثال تنين مفصلي مطبوع بتقنية 3D دقيقة باستخدام فيلامينت مائي متغير الألوان.',
    inStock: true,
    salesCount: 34
  },
  {
    id: 'prod-2',
    name: 'فازة هندسية مدرجة Spiral Silk Vase',
    nameAr: 'فازة حريرية هندسية 3D',
    nameEn: 'Twisted Spiral Silk Vase 3D',
    price: 280,
    originalPrice: 350,
    category: 'Home Decor',
    categoryAr: 'ديكور منزل',
    categoryEn: 'Home Decor',
    material: 'Matte PLA',
    image: customVaseImg,
    images: [customVaseImg],
    description: 'تحفة ديكور هندسية فائقة الجمال للديكور المودرن.',
    inStock: true,
    salesCount: 19
  },
  {
    id: 'prod-3',
    name: 'بكرة فيلامينت PLA High Toughness 1KG',
    nameAr: 'بكرة فيلامينت PLA قوية 1KG',
    nameEn: 'PLA High Toughness Filament 1KG',
    price: 170,
    originalPrice: 200,
    category: 'Filaments',
    categoryAr: 'خامات وفلامنت',
    categoryEn: 'Filaments',
    material: 'PLA Plus (1.75mm)',
    image: filamentImg,
    images: [filamentImg],
    description: 'خامة فيلامينت عالية الجودة ومقاومة الصدمات للطابعات ثلاثية الأبعاد.',
    inStock: true,
    salesCount: 88
  },
  {
    id: 'prod-4',
    name: 'قناع أوني الساموراي السايبورغ Cyberpunk Oni Mask',
    nameAr: 'قناع أوني الساموراي السايبورغ 3D',
    nameEn: 'Cyberpunk Samurai Oni Mask 3D',
    price: 650,
    originalPrice: 780,
    category: 'Masks & Wearables',
    categoryAr: 'أقنعة وإكسسوارات',
    categoryEn: 'Masks & Wearables',
    material: 'PETG Carbon Fiber',
    image: oniMaskImg,
    images: [oniMaskImg],
    description: 'قناع سايبورغ أوني بدقة طباعة عالية جداً للارتداء أو العرض على القاعدة.',
    inStock: true,
    salesCount: 42
  }
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '3D Models',
    material: 'PLA Plus',
    image: '',
    description: '',
    inStock: true
  });

  const loadProducts = async () => {
    const data = await getSupabaseProducts();
    if (data && data.length > 0) {
      setProducts(data);
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: '3D Models',
      material: 'PLA Plus',
      image: '',
      description: '',
      inStock: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category || '3D Models',
      material: product.material || 'PLA Plus',
      image: product.image || '',
      description: product.description || '',
      inStock: product.inStock !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('برجاء إدخال اسم المنتج والسعر');
      return;
    }

    const prodObj = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null
    };

    await saveSupabaseProduct(prodObj);
    toast.success(editingProduct ? 'تم تعديل المنتج بنجاح بـ Supabase 🎉' : 'تم إضافة المنتج الجديد بنجاح 🎉');

    setIsModalOpen(false);
    loadProducts();
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('هل أنت متاكد من مسح هذا المنتج من الكتالوج؟')) {
      await deleteSupabaseProduct(productId);
      loadProducts();
      toast.success('تم حذف المنتج بنجاح من قواعد البيانات');
    }
  };

  const toggleStock = (productId) => {
    const updated = products.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p);
    saveProducts(updated);
    toast.success('تم تحديث حالة التوفر في المخزن');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          (p.material || '').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (categoryFilter === 'All') return true;
    return p.category === categoryFilter;
  });

  const categories = ['All', '3D Models', 'Filaments', 'Home Decor', 'Accessories'];

  return (
    <div className="p-4 md:p-6 space-y-6 text-gray-900 dark:text-white min-h-screen dir-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Printer className="w-7 h-7 text-[#FF1F3D]" />
            كتالوج المنتجات وموديلات 3D
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            إضافة وتعديل المنتجات، خامات الـ PLA والتسعير في متجر Mixo
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#FF1F3D]/20 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          إضافة منتج 3D جديد
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-[#FF1F3D] text-white font-bold shadow-md'
                  : 'bg-gray-100 dark:bg-[#1A2332] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat === 'All' ? 'جميع التصنيفات' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث عن اسم المنتج أو نوع الخـامة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 hover:border-[#FF1F3D]/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xs"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-video bg-gray-100 dark:bg-[#1A2332] overflow-hidden">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 bg-white/90 dark:bg-[#0F151D]/80 backdrop-blur-md text-[#FF1F3D] font-bold text-[10px] rounded-lg border border-[#FF1F3D]/30 shadow-xs">
                    {product.category || '3D Model'}
                  </span>
                </div>

                <button
                  onClick={() => toggleStock(product.id)}
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md ${
                    product.inStock
                      ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30'
                  }`}
                >
                  {product.inStock ? 'متوفر بالمخزن' : 'نفد من المخزن'}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-[#FF1F3D] transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    الخامة: <span className="text-gray-900 dark:text-white font-semibold">{product.material || 'PLA'}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-base font-extrabold text-[#FF1F3D]">{product.price} ج.م</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 line-through mr-1.5">{product.originalPrice} ج.م</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card Actions */}
            <div className="p-4 pt-0 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenEditModal(product)}
                className="flex-1 py-2 bg-gray-100 dark:bg-[#1A2332] hover:bg-[#FF1F3D] text-gray-700 dark:text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                تعديل
              </button>

              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="p-2 bg-gray-100 dark:bg-[#1A2332] hover:bg-red-600 text-gray-600 dark:text-gray-400 hover:text-white rounded-xl text-xs transition-all cursor-pointer"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121923] border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg p-6 space-y-5 text-gray-900 dark:text-white dir-rtl relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute left-5 top-5 p-2 rounded-full bg-gray-100 dark:bg-[#1A2332] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
              <Package className="w-6 h-6 text-[#FF1F3D]" />
              {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج 3D جديد'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">اسم المنتج أو الموديل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مجسم التنين المفصلي 3D"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">السعر (ج.م) *</label>
                  <input
                    type="number"
                    required
                    placeholder="450"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">السعر قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    placeholder="550"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">التصنيف</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                  >
                    <option value="3D Models">3D Models</option>
                    <option value="Filaments">Filaments</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">نوع الخامة / الفيلـامينت</label>
                  <input
                    type="text"
                    placeholder="PLA+, PETG, Silk"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">رابط صورة المنتج (URL)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">وصف المنتج</label>
                <textarea
                  rows="3"
                  placeholder="اكتب وصفاً مختصراً ودقيقاً عن المنتج والأبعاد ودقة الطباعة..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 accent-[#FF1F3D] rounded cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="text-xs font-bold text-gray-800 dark:text-white cursor-pointer">
                  المنتج متوفر بالمخزن وقابل للطلب الفوري
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF1F3D] hover:bg-[#D91832] text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-[#FF1F3D]/20 cursor-pointer"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج للمتجر'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-[#1A2332] hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
