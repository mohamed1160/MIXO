import { supabase } from './supabaseClient';
import { useAuthStore } from '../store/useAuthStore';

async function sendPushNotification({ userId, title, body, data = {} }) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-push-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          user_id: userId,
          title,
          body,
          data,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Push notification failed:', result);
      return null;
    }

    console.log('Push notification sent:', result);
    return result;
  } catch (error) {
    console.error('Push notification error:', error);
    return null;
  }
}

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
        user_id: d.user_id,
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
        user_id: newOrder.user_id || null,
        customer: newOrder.customer,
        items: newOrder.items,
        custom_data: newOrder.customData || null,
        status: newOrder.status || 'Processing',
        total: newOrder.total || null,
        date: newOrder.date || new Date().toISOString().split('T')[0]
      }]);

    if (error) throw error;

    await sendPushNotification({
      userId: 'CUS-3848',
      title: 'طلب جديد 🛒',
      body: `تم استلام طلب جديد ${newOrder.id}`,
      data: {
        type: 'new_order',
        order_id: newOrder.id,
      },
    });
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

// Cache memory for fast duplicate requests
let productsCache = null;
let productsCacheTime = 0;
const CACHE_TTL_MS = 15000;

export async function getSupabaseProducts(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && productsCache && (now - productsCacheTime < CACHE_TTL_MS)) {
    return productsCache;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, title, category, price, original_price, image, images, rating, review_count, is_bestseller, description')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (Array.isArray(data)) {
      const formatted = data.map(p => ({
        id: p.id,
        name: p.name,
        title: p.title || p.name,
        category: p.category,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : null,
        image: p.image,
        images: p.images || [p.image],
        rating: p.rating || 0,
        reviewCount: p.review_count || 0,
        isBestSeller: p.is_bestseller || false,
        description: p.description || '',
        material: p.material || 'PLA Plus',
        inStock: true
      }));

      productsCache = formatted;
      productsCacheTime = now;
      localStorage.setItem('MIXO_products', JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase products fetch fallback to LocalStorage:', err);
  }

  const saved = localStorage.getItem('MIXO_products');
  const parsed = saved ? JSON.parse(saved) : [];
  productsCache = parsed;
  productsCacheTime = now;
  return parsed;
}

export async function saveSupabaseProduct(product) {
  let supaSuccess = false;
  try {
    const payload = {
      id: String(product.id || Date.now()),
      name: product.name || product.title,
      title: product.title || product.name,
      category: product.category || 'Figures & Collectibles',
      price: Number(product.price),
      original_price: product.originalPrice ? Number(product.originalPrice) : null,
      image: product.image,
      images: product.images || [product.image],
      rating: product.rating || 0,
      review_count: product.reviewCount || 0,
      is_bestseller: product.isBestSeller || false,
      description: product.description || ''
    };

    const { error } = await supabase
      .from('products')
      .upsert([payload]);

    if (error) {
      console.error('Supabase save product error:', error);
    } else {
      supaSuccess = true;
    }
  } catch (err) {
    console.error('Failed to save product in Supabase API:', err);
  }

  // Update LocalStorage & notify app components
  const saved = localStorage.getItem('MIXO_products');
  const existingList = saved ? JSON.parse(saved) : [];
  const updated = [product, ...existingList.filter(p => String(p.id) !== String(product.id))];
  localStorage.setItem('MIXO_products', JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('mixo_products_updated'));

  return { product, supaSuccess };
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

  const saved = localStorage.getItem('MIXO_products');
  if (saved) {
    const existingList = JSON.parse(saved);
    const updated = existingList.filter(p => String(p.id) !== String(productId));
    localStorage.setItem('MIXO_products', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('mixo_products_updated'));
  }
}

export function subscribeToRealtimeProducts(onUpdate) {
  const subscription = supabase
    .channel('public:products')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
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
    const clean = identifier.trim().toLowerCase();
    const cleanPhone = clean.replace(/[\s\-\+]/g, '');

    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    if (data && data.length > 0) {
      const u = data.find(
        (item) =>
          (item.email && item.email.trim().toLowerCase() === clean) ||
          (item.phone && item.phone.replace(/[\s\-\+]/g, '') === cleanPhone)
      );

      if (u) {
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
    }
  } catch (err) {
    console.warn('Supabase findUser fallback:', err);
  }
  return null;
}

// ==========================================
// 6. CONTACT MESSAGES & 3D QUOTES SERVICE
// ==========================================
export async function getSupabaseMessages() {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      const formatted = data.map(m => ({
        id: m.id,
        name: m.name,
        phone: m.phone,
        email: m.email,
        link: m.makerworld_url,
        subject: m.subject,
        message: m.message,
        type: m.type || (m.makerworld_url ? 'custom_quote' : 'general'),
        status: m.status || 'unread',
        date: new Date(m.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })
      }));
      localStorage.setItem('MIXO_contact_messages', JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase messages fallback to LocalStorage:', err);
  }

  const saved = localStorage.getItem('MIXO_contact_messages');
  return saved ? JSON.parse(saved) : [];
}

export async function saveSupabaseMessage(msgObj) {
  try {
    const payload = {
      id: msgObj.id || `MSG-${Date.now().toString().slice(-6)}`,
      name: msgObj.name,
      phone: msgObj.phone,
      email: msgObj.email || null,
      makerworld_url: msgObj.makerworldUrl || msgObj.link || null,
      subject: msgObj.subject || '3D Printing Inquiry',
      message: msgObj.message,
      type: msgObj.type || (msgObj.makerworldUrl || msgObj.link ? 'custom_quote' : 'general'),
      status: 'unread'
    };

    const { error } = await supabase
      .from('contact_messages')
      .insert([payload]);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to save message in Supabase:', err);
  }

  const saved = localStorage.getItem('MIXO_contact_messages');
  const list = saved ? JSON.parse(saved) : [];
  const updated = [msgObj, ...list];
  localStorage.setItem('MIXO_contact_messages', JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
  return msgObj;
}

export async function updateSupabaseMessageStatus(msgId, newStatus) {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: newStatus })
      .eq('id', msgId);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to update message status in Supabase:', err);
  }
}

export async function deleteSupabaseMessage(msgId) {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', msgId);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete message in Supabase:', err);
  }
}

// ==========================================
// 7. REVIEWS SERVICE
// ==========================================
export async function getSupabaseReviews(productId = null) {
  try {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (productId) query = query.eq('product_id', String(productId));

    const { data, error } = await query;
    if (error) throw error;
    if (data) {
      return data.map(r => ({
        id: r.id,
        productId: r.product_id,
        userName: r.user_name,
        rating: Number(r.rating),
        comment: r.comment,
        status: r.status,
        date: new Date(r.created_at).toLocaleDateString('ar-EG')
      }));
    }
  } catch (err) {
    console.warn('Supabase reviews fallback:', err);
  }
  return [];
}

export async function saveSupabaseReview(reviewObj) {
  try {
    const payload = {
      id: reviewObj.id || `REV-${Date.now()}`,
      product_id: String(reviewObj.productId),
      user_name: reviewObj.userName || 'مشتري مؤكد',
      rating: Number(reviewObj.rating || 5),
      comment: reviewObj.comment,
      status: reviewObj.status || 'approved'
    };

    const { error } = await supabase
      .from('reviews')
      .insert([payload]);

    if (error) throw error;
    return payload;
  } catch (err) {
    console.error('Failed to save review in Supabase:', err);
    throw err;
  }
}

export async function updateSupabaseReviewStatus(reviewId, status) {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to update review status in Supabase:', err);
  }
}

export async function deleteSupabaseReview(reviewId) {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete review in Supabase:', err);
  }
}

// ==========================================
// 8. PROMO COUPONS SERVICE
// ==========================================
export async function getSupabaseCoupons() {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      const formatted = data.map(c => ({
        code: c.code,
        discountPercent: c.discount_percent ? Number(c.discount_percent) : null,
        discountAmount: c.discount_amount ? Number(c.discount_amount) : null,
        minSpend: c.min_spend ? Number(c.min_spend) : 0,
        isActive: c.is_active,
        expiresAt: c.expires_at
      }));
      localStorage.setItem('MIXO_promo_coupons', JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase coupons fallback:', err);
  }

  const saved = localStorage.getItem('MIXO_promo_coupons');
  return saved ? JSON.parse(saved) : [];
}

export async function saveSupabaseCoupon(couponObj) {
  try {
    const payload = {
      code: couponObj.code.trim().toUpperCase(),
      discount_percent: couponObj.discountPercent || null,
      discount_amount: couponObj.discountAmount || null,
      min_spend: couponObj.minSpend || 0,
      is_active: couponObj.isActive !== undefined ? couponObj.isActive : true,
      expires_at: couponObj.expiresAt || null
    };

    const { error } = await supabase
      .from('coupons')
      .upsert([payload]);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to save coupon in Supabase:', err);
  }

  const saved = localStorage.getItem('MIXO_promo_coupons');
  const list = saved ? JSON.parse(saved) : [];
  const updated = [couponObj, ...list.filter(c => c.code !== couponObj.code)];
  localStorage.setItem('MIXO_promo_coupons', JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
}

export async function deleteSupabaseCoupon(code) {
  try {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('code', code);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete coupon in Supabase:', err);
  }
}

// ==========================================
// 9. NOTIFICATIONS SERVICE
// ==========================================
export async function getSupabaseNotifications(userIdentifier) {
  try {
    const clean = String(userIdentifier).trim();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_identifier.eq.${clean},user_identifier.eq.all`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data) {
      return data.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.is_read,
        date: new Date(n.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })
      }));
    }
  } catch (err) {
    console.warn('Supabase notifications fallback:', err);
  }
  return [];
}

export async function saveSupabaseNotification(userIdentifier, notificationObj) {
  try {
    const payload = {
      id: notificationObj.id || `NOTIF-${Date.now()}`,
      user_identifier: String(userIdentifier).trim(),
      title: notificationObj.title,
      message: notificationObj.message,
      type: notificationObj.type || 'info',
      is_read: false
    };

    const { error } = await supabase
      .from('notifications')
      .insert([payload]);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to save notification in Supabase:', err);
  }
}

// ==========================================
// 10. STORAGE SERVICE (3D Files & Images Bucket)
// ==========================================
export async function upload3DFileToSupabase(file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `custom-uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('3d-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('3d-files')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase storage upload fallback:', err);
    return null;
  }
}

