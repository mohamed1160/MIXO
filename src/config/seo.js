// ─── Centralized SEO Configuration ───
// All SEO metadata for every route, plus site-wide defaults.

export const SITE_URL = 'https://mixo-one.vercel.app/';
export const SITE_NAME = 'MIXO 3D';
export const DEFAULT_OG_IMAGE = '/favicon.png';

export const ORGANIZATION = {
  name: 'MIXO 3D',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  description: 'Premium 3D printing and custom design studio in Egypt.',
  email: 'support@mixo3d.com',
  phone: '+201012345678',
  address: {
    country: 'EG',
    region: 'Egypt',
  },
  sameAs: [
    'https://instagram.com',
    'https://facebook.com',
    'https://tiktok.com',
  ],
};

/**
 * Per-route SEO metadata.
 * `noindex: true` means the page should NOT be indexed by search engines.
 */
export const PAGE_SEO = {
  '/': {
    en: {
      title: 'MIXO 3D — Custom 3D Printing & Design Studio in Egypt',
      description: 'MIXO 3D is a premier 3D printing and custom design studio in Egypt. Shop high-quality 3D printed figurines, masks, home decor, custom models, and request custom 3D prints.',
    },
    ar: {
      title: 'MIXO 3D — طباعة ثلاثية الأبعاد وتصميم مخصص في مصر',
      description: 'MIXO 3D هو استوديو طباعة ثلاثية الأبعاد وتصميم مخصص في مصر. تسوق مجسمات 3D عالية الجودة، أقنعة، ديكور منزلي، واطلب تصميمك المخصص.',
    },
  },
  '/shop': {
    en: {
      title: 'Shop 3D Printed Products — MIXO 3D',
      description: 'Browse our collection of premium 3D printed products. Figurines, masks, home decor, phone stands, keychains, and more. Fast shipping across Egypt.',
    },
    ar: {
      title: 'تسوق منتجات الطباعة ثلاثية الأبعاد — MIXO 3D',
      description: 'تصفح مجموعتنا من المنتجات المطبوعة ثلاثية الأبعاد. مجسمات، أقنعة، ديكور منزلي، حوامل هواتف، ميداليات والمزيد. شحن سريع لجميع المحافظات.',
    },
  },
  '/categories': {
    en: {
      title: 'Browse All Categories — MIXO 3D',
      description: 'Explore all product categories at MIXO 3D. Figures, masks, home decor, phone stands, tools, vases, gaming accessories, keychains, and custom models.',
    },
    ar: {
      title: 'جميع الأقسام — MIXO 3D',
      description: 'استكشف جميع أقسام المنتجات في MIXO 3D. مجسمات، أقنعة، ديكور منزلي، حوامل هواتف، أدوات، فازات، إكسسوارات ألعاب، وميداليات.',
    },
  },
  '/collections': {
    en: {
      title: 'Collections — MIXO 3D',
      description: 'Discover curated collections of 3D printed products at MIXO 3D. Find the perfect piece from our themed collections.',
    },
    ar: {
      title: 'المجموعات — MIXO 3D',
      description: 'اكتشف مجموعات منتقاة من المنتجات المطبوعة ثلاثية الأبعاد في MIXO 3D. اعثر على القطعة المثالية من مجموعاتنا المميزة.',
    },
  },
  '/new-arrivals': {
    en: {
      title: 'New Arrivals — MIXO 3D',
      description: 'Check out the latest 3D printed products and new additions to our store. Fresh designs and models available now.',
    },
    ar: {
      title: 'وصل حديثاً — MIXO 3D',
      description: 'اطلع على أحدث المنتجات المطبوعة ثلاثية الأبعاد والإضافات الجديدة لمتجرنا. تصاميم وموديلات جديدة متاحة الآن.',
    },
  },
  '/best-sellers': {
    en: {
      title: 'Best Sellers — MIXO 3D',
      description: 'Shop our most popular and best-selling 3D printed products. Top-rated items loved by our customers across Egypt.',
    },
    ar: {
      title: 'الأكثر مبيعاً — MIXO 3D',
      description: 'تسوق أكثر منتجاتنا شعبية ومبيعاً من المطبوعات ثلاثية الأبعاد. منتجات مميزة يحبها عملاؤنا في جميع أنحاء مصر.',
    },
  },
  '/custom-order': {
    en: {
      title: 'Custom 3D Printing Order — MIXO 3D',
      description: 'Request a custom 3D print at MIXO 3D. Upload your STL/CAD file or describe your idea and we will bring it to life with precision 3D printing.',
    },
    ar: {
      title: 'طلب طباعة ثلاثية الأبعاد مخصص — MIXO 3D',
      description: 'اطلب طباعة 3D مخصصة من MIXO 3D. ارفع ملف STL/CAD أو اوصف فكرتك وسنحولها إلى واقع بدقة عالية.',
    },
  },
  '/our-story': {
    en: {
      title: 'Our Story — MIXO 3D',
      description: 'Learn about MIXO 3D, Egypt\'s premier 3D printing studio. Our mission, vision, and commitment to quality custom 3D printing.',
    },
    ar: {
      title: 'قصتنا — MIXO 3D',
      description: 'تعرف على MIXO 3D، استوديو الطباعة ثلاثية الأبعاد الرائد في مصر. رسالتنا ورؤيتنا والتزامنا بجودة الطباعة المخصصة.',
    },
  },
  '/contact': {
    en: {
      title: 'Contact Us — MIXO 3D',
      description: 'Get in touch with MIXO 3D. Have questions about 3D printing, custom orders, or need support? Reach us via phone, email, or our contact form.',
    },
    ar: {
      title: 'تواصل معنا — MIXO 3D',
      description: 'تواصل مع MIXO 3D. لديك استفسارات حول الطباعة ثلاثية الأبعاد أو الطلبات المخصصة؟ تواصل معنا عبر الهاتف أو البريد الإلكتروني.',
    },
  },
  '/journal': {
    en: {
      title: 'Journal & Blog — MIXO 3D',
      description: 'Read the latest articles, tips, and news about 3D printing technology, design inspiration, and product updates from MIXO 3D.',
    },
    ar: {
      title: 'المدونة — MIXO 3D',
      description: 'اقرأ أحدث المقالات والنصائح والأخبار حول تقنية الطباعة ثلاثية الأبعاد وإلهام التصميم وتحديثات المنتجات من MIXO 3D.',
    },
  },
  '/faqs': {
    en: {
      title: 'Frequently Asked Questions — MIXO 3D',
      description: 'Find answers to common questions about 3D printing, materials, shipping, custom orders, file formats, and more at MIXO 3D.',
    },
    ar: {
      title: 'الأسئلة الشائعة — MIXO 3D',
      description: 'اعثر على إجابات للأسئلة الشائعة حول الطباعة ثلاثية الأبعاد والخامات والشحن والطلبات المخصصة وصيغ الملفات والمزيد.',
    },
  },
  '/shipping-delivery': {
    en: {
      title: 'Shipping & Delivery — MIXO 3D',
      description: 'Learn about MIXO 3D shipping policies, delivery times, and rates across all Egyptian governorates. Fast and secure delivery.',
    },
    ar: {
      title: 'الشحن والتوصيل — MIXO 3D',
      description: 'تعرف على سياسات الشحن ومواعيد التوصيل وأسعار الشحن لجميع المحافظات المصرية. توصيل سريع وآمن.',
    },
  },
  '/returns-exchanges': {
    en: {
      title: 'Returns & Exchanges — MIXO 3D',
      description: 'Read about MIXO 3D return and exchange policy. Learn how to request a return or exchange for your 3D printed products.',
    },
    ar: {
      title: 'الاستبدال والاسترجاع — MIXO 3D',
      description: 'اقرأ سياسة الاستبدال والاسترجاع في MIXO 3D. تعرف على كيفية طلب استرجاع أو استبدال لمنتجاتك المطبوعة.',
    },
  },
  '/size-guide': {
    en: {
      title: 'Size Guide — MIXO 3D',
      description: 'MIXO 3D size guide for 3D printed products. Find the right dimensions and scale for figurines, masks, decor, and custom prints.',
    },
    ar: {
      title: 'دليل المقاسات — MIXO 3D',
      description: 'دليل مقاسات MIXO 3D للمنتجات المطبوعة ثلاثية الأبعاد. اعرف الأبعاد والمقاسات المناسبة للمجسمات والأقنعة والديكور.',
    },
  },
  '/privacy-policy': {
    en: {
      title: 'Privacy Policy — MIXO 3D',
      description: 'MIXO 3D privacy policy. Learn how we collect, use, and protect your personal data and information.',
    },
    ar: {
      title: 'سياسة الخصوصية — MIXO 3D',
      description: 'سياسة الخصوصية في MIXO 3D. تعرف على كيفية جمع واستخدام وحماية بياناتك الشخصية.',
    },
  },
  '/terms-conditions': {
    en: {
      title: 'Terms & Conditions — MIXO 3D',
      description: 'Read the terms and conditions for using MIXO 3D services, placing orders, and purchasing 3D printed products.',
    },
    ar: {
      title: 'الشروط والأحكام — MIXO 3D',
      description: 'اقرأ الشروط والأحكام لاستخدام خدمات MIXO 3D وتقديم الطلبات وشراء المنتجات المطبوعة ثلاثية الأبعاد.',
    },
  },
  '/careers': {
    en: {
      title: 'Careers — MIXO 3D',
      description: 'Join the MIXO 3D team. Explore career opportunities in 3D printing, design, and e-commerce in Egypt.',
    },
    ar: {
      title: 'وظائف — MIXO 3D',
      description: 'انضم لفريق MIXO 3D. استكشف فرص العمل في الطباعة ثلاثية الأبعاد والتصميم والتجارة الإلكترونية في مصر.',
    },
  },
  // ── noindex pages ──
  '/cart': {
    noindex: true,
    en: {
      title: 'Your Cart — MIXO 3D',
      description: 'Review your shopping cart at MIXO 3D.',
    },
    ar: {
      title: 'سلة التسوق — MIXO 3D',
      description: 'راجع سلة التسوق الخاصة بك في MIXO 3D.',
    },
  },
  '/checkout': {
    noindex: true,
    en: {
      title: 'Checkout — MIXO 3D',
      description: 'Complete your purchase at MIXO 3D.',
    },
    ar: {
      title: 'إتمام الطلب — MIXO 3D',
      description: 'أكمل عملية الشراء في MIXO 3D.',
    },
  },
  '/track-order': {
    noindex: true,
    en: {
      title: 'Track Your Order — MIXO 3D',
      description: 'Track your MIXO 3D order status.',
    },
    ar: {
      title: 'تتبع طلبك — MIXO 3D',
      description: 'تتبع حالة طلبك من MIXO 3D.',
    },
  },
  '/wishlist': {
    noindex: true,
    en: {
      title: 'Your Wishlist — MIXO 3D',
      description: 'View your saved items at MIXO 3D.',
    },
    ar: {
      title: 'المفضلة — MIXO 3D',
      description: 'عرض العناصر المحفوظة في MIXO 3D.',
    },
  },
  '/login': {
    noindex: true,
    en: { title: 'Sign In — MIXO 3D', description: 'Sign in to your MIXO 3D account.' },
    ar: { title: 'تسجيل الدخول — MIXO 3D', description: 'سجل الدخول إلى حسابك في MIXO 3D.' },
  },
  '/register': {
    noindex: true,
    en: { title: 'Create Account — MIXO 3D', description: 'Create a new MIXO 3D account.' },
    ar: { title: 'إنشاء حساب — MIXO 3D', description: 'أنشئ حساباً جديداً في MIXO 3D.' },
  },
  '/forgot-password': {
    noindex: true,
    en: { title: 'Reset Password — MIXO 3D', description: 'Reset your MIXO 3D password.' },
    ar: { title: 'استعادة كلمة المرور — MIXO 3D', description: 'استعد كلمة المرور الخاصة بك في MIXO 3D.' },
  },
  '/account': {
    noindex: true,
    en: { title: 'My Account — MIXO 3D', description: 'Manage your MIXO 3D account.' },
    ar: { title: 'حسابي — MIXO 3D', description: 'إدارة حسابك في MIXO 3D.' },
  },
  '/admin': {
    noindex: true,
    en: { title: 'Admin Dashboard — MIXO 3D', description: 'MIXO 3D admin dashboard.' },
    ar: { title: 'لوحة التحكم — MIXO 3D', description: 'لوحة تحكم MIXO 3D.' },
  },
};
