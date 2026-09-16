// Mixo 3D - FAQ Service (Local Persistence & Admin Sync)

const STORAGE_KEY = 'MIXO_faqs';

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    questionEn: 'How long does custom 3D printing order processing take?',
    questionAr: 'كم يستغرق تجهيز طلبات الطباعة ثلاثية الأبعاد المخصصة؟',
    answerEn: 'Standard custom 3D printing orders usually take 1 to 3 business days for modeling review and precision printing, depending on size and detail complexity.',
    answerAr: 'تستغرق طلبات الطباعة المخصصة عادةً من 1 إلى 3 أيام عمل للمراجعة والطباعة الدقيقة، اعتماداً على حجم المجسم وتفاصيله.',
    category: 'custom-orders',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'faq-2',
    questionEn: 'What materials do you use for 3D printing?',
    questionAr: 'ما هي الخامات والمواد المستخدمة في الطباعة ثلاثية الأبعاد؟',
    answerEn: 'We utilize high-grade PLA+, PETG for durability, Resin for ultra-high resolution models, and TPU for flexible parts.',
    answerAr: 'نستخدم خامات عالية الجودة مثل PLA+، و PETG للمتانة، و الراتنج (Resin) للمجسمات الدقيقة جداً، بالإضافة إلى TPU للأجزاء المرنة.',
    category: 'materials',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'faq-3',
    questionEn: 'How is the custom 3D print quote calculated?',
    questionAr: 'كيف يتم حساب سعر الطلب المخصص للطباعة ثلاثية الأبعاد؟',
    answerEn: 'Pricing is based on estimated print time, material volume (grams), complexity, and any requested post-processing or hand painting.',
    answerAr: 'يتم تحديد السعر بناءً على وقت الطباعة المقدر، ووزن الخامة بالجرام، وتعقيد التفاصيل، وهل يتطلب المنتج معالجة بعد الطباعة أو طلاء يدوي.',
    category: 'custom-orders',
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'faq-4',
    questionEn: 'What are your delivery options and timelines?',
    questionAr: 'ما هي خيارات الشحن ومواعيد التوصيل؟',
    answerEn: 'We provide Standard Express Delivery across all governorates within 2 to 4 business days.',
    answerAr: 'نوفر خدمة الشحن السريع القياسي لجميع المحافظات خلال 2 إلى 4 أيام عمل.',
    category: 'shipping',
    isActive: true,
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'faq-5',
    questionEn: 'What payment methods do you accept?',
    questionAr: 'ما هي طرق الدفع المتاحة؟',
    answerEn: 'We accept Credit/Debit Cards, Instapay, Vodafone Cash, and Cash on Delivery (COD).',
    answerAr: 'نقبل الدفع عبر البطاقات البنكية، تطبيق إنستا باي (InstaPay)، محفظة فودافون كاش، والدفع عند الاستلام.',
    category: 'payments',
    isActive: true,
    order: 5,
    createdAt: new Date().toISOString(),
  },
];

export const faqCategories = [
  { id: 'all', labelEn: 'All Questions', labelAr: 'جميع الأسئلة' },
  { id: 'general', labelEn: 'General Store', labelAr: 'أسئلة عامة' },
  { id: 'materials', labelEn: '3D Printing & Materials', labelAr: 'الخامات والطباعة' },
  { id: 'custom-orders', labelEn: 'Custom 3D Orders', labelAr: 'الطلبات المخصصة والتسعير' },
  { id: 'shipping', labelEn: 'Shipping & Delivery', labelAr: 'الشحن والتوصيل' },
  { id: 'payments', labelEn: 'Payment Methods', labelAr: 'طرق الدفع' },
];

export const getFAQs = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FAQS));
      return DEFAULT_FAQS;
    }
    return JSON.parse(saved);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return DEFAULT_FAQS;
  }
};

export const saveFAQs = (faqs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
  } catch (error) {
    console.error('Error saving FAQs:', error);
  }
};

export const addFAQ = (faqData) => {
  const faqs = getFAQs();
  const newFAQ = {
    id: `faq-${Date.now()}`,
    questionEn: faqData.questionEn || faqData.questionAr || '',
    questionAr: faqData.questionAr || faqData.questionEn || '',
    answerEn: faqData.answerEn || faqData.answerAr || '',
    answerAr: faqData.answerAr || faqData.answerEn || '',
    category: faqData.category || 'general',
    isActive: faqData.isActive !== undefined ? faqData.isActive : true,
    order: faqs.length + 1,
    createdAt: new Date().toISOString(),
  };
  const updated = [newFAQ, ...faqs];
  saveFAQs(updated);
  return newFAQ;
};

export const updateFAQ = (id, faqData) => {
  const faqs = getFAQs();
  const updated = faqs.map((faq) => (faq.id === id ? { ...faq, ...faqData } : faq));
  saveFAQs(updated);
  return updated;
};

export const deleteFAQ = (id) => {
  const faqs = getFAQs();
  const updated = faqs.filter((faq) => faq.id !== id);
  saveFAQs(updated);
  return updated;
};

export const toggleFAQStatus = (id) => {
  const faqs = getFAQs();
  const updated = faqs.map((faq) =>
    faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
  );
  saveFAQs(updated);
  return updated;
};
