import React, { useState, useEffect } from 'react';
import { getSupabaseProducts, saveSupabaseProduct, deleteSupabaseProduct, upload3DFileToSupabase, subscribeToRealtimeProducts } from '../../../services/db.service';
import { MOCK_PRODUCTS, getAllCategories, saveCustomCategory } from '../../../services/products';
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
  Printer,
  UploadCloud
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Dynamic Categories state
  const [availableCategories, setAvailableCategories] = useState(() => getAllCategories());
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('برجاء كتابة اسم التصنيف الجديد');
      return;
    }
    const added = saveCustomCategory(newCategoryName.trim());
    if (added) {
      toast.success(`تم إضافة تصنيف "${added.defaultName}" بنجاح! 🎉`);
      setAvailableCategories(getAllCategories());
      setFormData((prev) => ({ ...prev, category: added.defaultName }));
      setNewCategoryName('');
      setShowAddCategoryInput(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Figures & Collectibles',
    material: 'PLA Plus',
    image: '',
    description: '',
    inStock: true
  });

  const loadProducts = async () => {
    try {
      const supaData = await getSupabaseProducts();
      if (supaData && supaData.length > 0) {
        setProducts(supaData);
      } else {
        const saved = localStorage.getItem('MIXO_products');
        if (saved) {
          const localList = JSON.parse(saved);
          setProducts(localList);
        } else {
          setProducts([]);
        }
      }
    } catch (e) {
      console.error(e);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();

    const handleStorageChange = () => {
      loadProducts();
      setAvailableCategories(getAllCategories());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mixo_products_updated', handleStorageChange);
    window.addEventListener('mixo_categories_updated', handleStorageChange);

    // Subscribe to realtime changes from Supabase
    const unsubscribe = subscribeToRealtimeProducts(() => {
      loadProducts();
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mixo_products_updated', handleStorageChange);
      window.removeEventListener('mixo_categories_updated', handleStorageChange);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setShowAddCategoryInput(false);
    setNewCategoryName('');
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: availableCategories[0]?.defaultName || 'Figures & Collectibles',
      material: 'PLA Plus',
      image: '',
      description: '',
      inStock: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setShowAddCategoryInput(false);
    setNewCategoryName('');
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category || 'Figures & Collectibles',
      material: product.material || 'PLA Plus',
      image: product.image || '',
      description: product.description || '',
      inStock: product.inStock !== false
    });
    setIsModalOpen(true);
  };

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("برجاء اختيار صورة صحيحة (JPG, PNG, WEBP)");
      return;
    }

    try {
      const supaUrl = await upload3DFileToSupabase(file);
      if (supaUrl) {
        setFormData((prev) => ({ ...prev, image: supaUrl }));
        toast.success("تم رفع صورة المنتج بنجاح إلى السحابة! 📷");
      } else {
        const compressed = await compressImage(file);
        if (compressed) {
          setFormData((prev) => ({ ...prev, image: compressed }));
          toast.success("تم اختيار الصورة بنجاح! 📷");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('برجاء إدخال اسم المنتج والسعر');
      return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80';
    const prodObj = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name,
      title: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      category: formData.category || 'Figures & Collectibles',
      material: formData.material || 'PLA Plus',
      image: formData.image || defaultImg,
      images: [formData.image || defaultImg],
      description: formData.description || '',
      inStock: formData.inStock !== false,
      stock: formData.inStock !== false ? 10 : 0
    };

    const res = await saveSupabaseProduct(prodObj);
    window.dispatchEvent(new CustomEvent('mixo_products_updated'));
    if (res?.supaSuccess) {
      toast.success(editingProduct ? 'تم تعديل المنتج بنجاح وحفظه في السحابة لجميع الأجهزة 🎉' : 'تم إضافة المنتج الجديد وحفظه في السحابة لجميع الأجهزة 🎉');
    } else {
      toast.success(editingProduct ? 'تم تعديل المنتج بنجاح 🎉' : 'تم إضافة المنتج الجديد بنجاح 🎉');
    }

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

  const toggleStock = async (productId) => {
    const target = products.find(p => p.id === productId);
    if (target) {
      const updated = { ...target, inStock: !target.inStock };
      await saveSupabaseProduct(updated);
      loadProducts();
      toast.success('تم تحديث حالة التوفر بالمخزن');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          (p.material || '').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (categoryFilter === 'All') return true;
    return p.category === categoryFilter;
  });

  const categories = ['All', ...availableCategories.map(c => c.defaultName)];

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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">التصنيف</label>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryInput((prev) => !prev)}
                      className="text-[11px] font-bold text-[#FF1F3D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إضافة تصنيف
                    </button>
                  </div>

                  {showAddCategoryInput && (
                    <div className="bg-gray-100 dark:bg-[#1A2332] p-2 rounded-xl border border-gray-300 dark:border-gray-700/80 flex items-center gap-1.5 mb-2">
                      <input
                        type="text"
                        placeholder="اسم التصنيف..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 bg-white dark:bg-[#121923] border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-2.5 py-1 bg-[#FF1F3D] hover:bg-[#D91832] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0"
                      >
                        حفظ
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCategoryInput(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF1F3D]"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat.id} value={cat.defaultName}>{cat.defaultName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">نوع الخامة (PLA)</label>
                  <input
                    type="text"
                    placeholder="PLA, PLA Plus"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  صورة المنتج (رفع صورة من جهازك) *
                </label>
                
                <div className="flex flex-col gap-2">
                  <label className="border-2 border-dashed border-[#FF1F3D]/40 hover:border-[#FF1F3D] bg-gray-50 dark:bg-[#1A2332] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 text-[#FF1F3D] mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      اضغط هنا لرفع صورة من جهازك 📷
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      (PNG, JPG, WEBP - رفع مباشر لـ Supabase)
                    </span>
                  </label>

                  {formData.image && (
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#151C24] p-2.5 rounded-xl border border-gray-200 dark:border-gray-800">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-gray-300 dark:border-gray-700"
                      />
                      <div className="flex-1 truncate">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block truncate">
                          {formData.image.startsWith("data:") ? "صورة مرفوعة من الجهاز" : formData.image}
                        </span>
                        <span className="text-[10px] text-emerald-500 font-bold">جاهزة للعرض في المتجر ✓</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        title="حذف الصورة"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      أو ادخل رابط صورة مباشر (URL):
                    </span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-[#1A2332] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F3D]"
                    />
                  </div>
                </div>
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
