import { supabase } from './supabaseClient';

// ==========================================
// 1. ORDERS SERVICE (With Supabase & Realtime Sync)
// ==========================================
export async function getSupabaseOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      const formatted = data.map(d => ({
        id: d.id,
        customer: d.customer,
        items: d.items,
        customData: d.custom_data,
        status: d.status,
        total: d.total,
        date: d.date,
        createdAt: d.created_at
      }));
      localStorage.setItem('MIXO_customer_orders', JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase orders fallback to LocalStorage:', err);
  }

  const saved = localStorage.getItem('MIXO_customer_orders');
  return saved ? JSON.parse(saved) : [];
}

export async function saveSupabaseOrder(newOrder) {
  try {
    const { error } = await supabase
      .from('orders')
      .insert([{
        id: newOrder.id,
        customer: newOrder.customer,
        items: newOrder.items,
        custom_data: newOrder.customData || null,
        status: newOrder.status || 'Processing',
        total: newOrder.total || null,
        date: newOrder.date || new Date().toISOString().split('T')[0]
      }]);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to insert order into Supabase, saving locally:', err);
  }

  const existing = await getSupabaseOrders();
  const updated = [newOrder, ...existing.filter(o => o.id !== newOrder.id)];
  localStorage.setItem('MIXO_customer_orders', JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  return newOrder;
}

export async function updateSupabaseOrderStatus(orderId, newStatus, newTotal = null) {
  try {
    const updateObj = { status: newStatus };
    if (newTotal !== null) updateObj.total = newTotal;

    const { error } = await supabase
      .from('orders')
      .update(updateObj)
      .eq('id', orderId);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to update status in Supabase:', err);
  }

  const saved = localStorage.getItem('MIXO_customer_orders');
  if (saved) {
    const list = JSON.parse(saved);
    const updated = list.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          total: newTotal !== null ? newTotal : o.total
        };
      }
      return o;
    });
    localStorage.setItem('MIXO_customer_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  }
}

export async function deleteSupabaseOrder(orderId) {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete order in Supabase:', err);
  }

  const saved = localStorage.getItem('MIXO_customer_orders');
  if (saved) {
    const list = JSON.parse(saved);
    const updated = list.filter(o => o.id !== orderId);
    localStorage.setItem('MIXO_customer_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  }
}

export function subscribeToRealtimeOrders(onUpdate) {
  const subscription = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}

// ==========================================
// 2. PRODUCTS SERVICE (Supabase CRUD)
// ==========================================
export async function getSupabaseProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      const formatted = data.map(p => ({
        id: p.id,
        name: p.name,
        title: p.title || p.name,
        category: p.category,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : null,
        image: p.image,
        images: p.images || [p.image],
        rating: p.rating || 4.8,
        reviewCount: p.review_count || 120,
        isBestSeller: p.is_bestseller || false,
        description: p.description
      }));
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase products fallback:', err);
  }
  return null;
}

export async function saveSupabaseProduct(product) {
  try {
    const payload = {
      id: String(product.id || Date.now()),
      name: product.name || product.title,
      title: product.title || product.name,
      category: product.category || '3D Print',
      price: product.price,
      original_price: product.originalPrice || null,
      image: product.image,
      images: product.images || [product.image],
      rating: product.rating || 4.8,
      review_count: product.reviewCount || 120,
      is_bestseller: product.isBestSeller || false,
      description: product.description || ''
    };

    const { error } = await supabase
      .from('products')
      .upsert([payload]);

    if (error) throw error;
    return payload;
  } catch (err) {
    console.error('Failed to save product in Supabase:', err);
    throw err;
  }
}

export async function deleteSupabaseProduct(productId) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', String(productId));

    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete product in Supabase:', err);
  }
}

// ==========================================
// 3. FAQS SERVICE (Supabase CRUD)
// ==========================================
export async function getSupabaseFaqs() {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(d => ({
        id: d.id,
        questionAr: d.question_ar,
        questionEn: d.question_en,
        answerAr: d.answer_ar,
        answerEn: d.answer_en,
        category: d.category
      }));
    }
  } catch (err) {
    console.warn('Supabase FAQs fallback to LocalStorage:', err);
  }

  const saved = localStorage.getItem('MIXO_faqs');
  return saved ? JSON.parse(saved) : [];
}

export async function saveSupabaseFaq(faqItem) {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .insert([{
        question_ar: faqItem.questionAr || faqItem.question_ar,
        question_en: faqItem.questionEn || faqItem.question_en,
        answer_ar: faqItem.answerAr || faqItem.answer_ar,
        answer_en: faqItem.answerEn || faqItem.answer_en,
        category: faqItem.category || 'general'
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error('Error saving FAQ to Supabase:', err);
  }
}

export async function deleteSupabaseFaq(faqId) {
  try {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', faqId);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete FAQ in Supabase:', err);
  }
}

// ==========================================
// 4. SETTINGS SERVICE (Supabase CRUD)
// ==========================================
export async function getSupabaseSettings() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) throw error;
    if (data && data.length > 0) {
      const obj = {};
      data.forEach(item => {
        obj[item.key] = item.value;
      });
      localStorage.setItem('MIXO_settings', JSON.stringify(obj));
      return obj;
    }
  } catch (err) {
    console.warn('Supabase Settings fallback to LocalStorage:', err);
  }

  const saved = localStorage.getItem('MIXO_settings');
  return saved ? JSON.parse(saved) : {};
}

export async function saveSupabaseSettings(settingsObj) {
  try {
    const entries = Object.entries(settingsObj).map(([key, value]) => ({
      key,
      value
    }));

    const { error } = await supabase
      .from('settings')
      .upsert(entries);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to save settings in Supabase:', err);
  }

  localStorage.setItem('MIXO_settings', JSON.stringify(settingsObj));
  window.dispatchEvent(new Event('storage'));
}

// ==========================================
// 5. USERS SERVICE (Supabase Authentication & Profiles)
// ==========================================
export async function getSupabaseUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    if (data) {
      const formatted = data.map(u => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: u.password,
        role: u.role,
        availablePoints: u.available_points || 0,
        registeredAt: u.created_at
      }));
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase users fetch fallback:', err);
  }
  return null;
}

export async function saveSupabaseUser(userObj) {
  try {
    const payload = {
      id: userObj.id || `CUS-${Date.now().toString().slice(-4)}`,
      first_name: userObj.firstName || '',
      last_name: userObj.lastName || '',
      name: userObj.name || `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim(),
      email: userObj.email,
      phone: userObj.phone,
      password: userObj.password,
      role: userObj.role || 'user',
      available_points: userObj.availablePoints || 0
    };

    const { data, error } = await supabase
      .from('users')
      .upsert([payload])
      .select();

    if (error) throw error;
    return data ? data[0] : payload;
  } catch (err) {
    console.error('Failed to save user in Supabase:', err);
    throw err;
  }
}

export async function findSupabaseUser(identifier) {
  try {
    const clean = identifier.trim();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`phone.eq.${clean},email.eq.${clean}`)
      .limit(1);

    if (error) throw error;
    if (data && data.length > 0) {
      const u = data[0];
      return {
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: u.password,
        role: u.role,
        availablePoints: u.available_points || 0,
        registeredAt: u.created_at
      };
    }
  } catch (err) {
    console.warn('Supabase findUser fallback:', err);
  }
  return null;
}
