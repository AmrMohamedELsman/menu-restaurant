'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';

// ترجمات التطبيق المحدثة والمكتملة
const translations = {
  ar: {
    // الترجمات العامة
    direction: 'rtl',
    language: 'العربية',
    switchLanguage: 'English',
    currency: 'ج.م',
    popular: 'الأكثر طلباً',
    
    // ترجمات شريط التنقل
    home: 'الرئيسية',
    menu: 'القائمة',
    about: 'من نحن',
    contact: 'اتصل بنا',
    settings: 'الإعدادات',
    
    // ترجمات الصفحة الرئيسية
    welcome: 'مرحباً بكم في مطعمنا',
    enjoyFood: 'استمتع بأشهى المأكولات مع تجربة طعام فريدة',
    viewMenu: 'استعرض القائمة',
    whyChooseUs: 'لماذا تختارنا؟',
    freshIngredients: 'مكونات طازجة',
    freshIngredientsDesc: 'نستخدم فقط أفضل المكونات الطازجة لضمان جودة أطباقنا',
    fastService: 'خدمة سريعة',
    fastServiceDesc: 'نقدم خدمة سريعة وفعالة لضمان رضا عملائنا',
    uniqueExperience: 'تجربة فريدة',
    uniqueExperienceDesc: 'نقدم تجربة طعام فريدة من نوعها لا تنسى',
     bestSellers: 'الأكثر مبيعًا',
    writeReview: 'اكتب تعليق',
    // ترجمات صفحة القائمة
    menuTitle: 'قائمة الطعام',
    searchDish: 'ابحث عن طبق...',
    all: 'الكل',
    appetizers: 'مقبلات',
    mainDishes: 'أطباق رئيسية',
    desserts: 'حلويات',
    drinks: 'مشروبات',
    mostPopular: 'الأكثر طلباً',
    calories: 'سعرة حرارية',
    details: 'التفاصيل',
    ingredients: 'المكونات',
    customizationOptions: 'خيارات التخصيص',
    noProductsFound: 'لم يتم العثور على منتجات',
    loading: 'جاري التحميل...',
    
    // ترجمات صفحة الإعدادات
    adminPanel: 'لوحة إدارة المطعم',
    logout: 'تسجيل الخروج',
    adminLogin: 'تسجيل دخول المدير',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    enterUsername: 'أدخل اسم المستخدم',
    enterPassword: 'أدخل كلمة المرور',
    
    // ترجمات إدارة المنتجات
    productManagement: 'إدارة المنتجات',
    addNewProduct: 'إضافة منتج جديد',
    editProduct: 'تعديل المنتج',
    productName: 'اسم المنتج',
    price: 'السعر',
    category: 'الفئة',
    subcategory: 'الفئة الفرعية',
    description: 'الوصف',
    imageUrl: 'رابط الصورة',
    ingredientsSeparated: 'المكونات (مفصولة بفواصل)',
    isPopular: 'الأكثر طلباً',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    actions: 'الإجراءات',
    noProductsAvailable: 'لا توجد منتجات متاحة',
    confirmDelete: 'هل أنت متأكد من حذف هذا المنتج؟',
    
    // ترجمات تذييل الصفحة
    allRightsReserved: 'جميع الحقوق محفوظة',
    followUs: 'تابعنا',
    quickLinks: 'روابط سريعة',
    contactUs: 'اتصل بنا',
    address: 'العنوان: شارع المطاعم، المدينة',
    phone: 'الهاتف: +123 456 7890',
    email: 'البريد الإلكتروني: info@restaurant.com',
    
    // ترجمات التعليقات
    customerReviews: 'آراء العملاء',
    shareExperience: 'شارك تجربتك معنا',
    noReviewsYet: 'لا توجد تعليقات بعد',
    name: 'الاسم',
    phoneNumber: 'رقم الهاتف',
    rating: 'التقييم',
    yourComment: 'تعليقك',
    commentPlaceholder: 'شارك تجربتك معنا...',
    submitReview: 'إرسال التعليق',
    submitting: 'جاري الإرسال...',
    reviewNote: 'سيتم مراجعة تعليقك قبل النشر',
    reviewSubmitted: 'تم إرسال التعليق بنجاح! سيتم مراجعته قبل النشر',
    reviewError: 'خطأ في إرسال التعليق',
    manageReviews: 'إدارة التعليقات',
    noReviews: 'لا توجد تعليقات',
    status: 'الحالة',
    pending: 'في الانتظار',
    approve: 'اعتماد',
    reject: 'رفض',
    reviewApproved: 'تم اعتماد التعليق',
    reviewRejected: 'تم رفض التعليق',
    reviewDeleted: 'تم حذف التعليق',
    error: 'حدث خطأ',
    
    // ترجمات الفئات
    categories: {
      'مقبلات': 'مقبلات',
      'أطباق رئيسية': 'أطباق رئيسية',
      'حلويات': 'حلويات',
      'مشروبات': 'مشروبات',
      'سلطات': 'سلطات',
      'شوربات': 'شوربات'
    },
    subcategories: {
      'سلطات': 'سلطات',
      'شوربات': 'شوربات',
      'مقبلات باردة': 'مقبلات باردة',
      'مقبلات ساخنة': 'مقبلات ساخنة',
      'لحوم': 'لحوم',
      'دجاج': 'دجاج',
      'أسماك': 'أسماك',
      'نباتي': 'نباتي',
      'معكرونة': 'معكرونة',
      'أرز': 'أرز'
    }
  },
  en: {
    // General translations
    direction: 'ltr',
    language: 'English',
    switchLanguage: 'العربية',
    currency: 'EGP',
    popular: 'Popular',
    
    // Navbar translations
    home: 'Home',
    menu: 'Menu',
    about: 'About Us',
    contact: 'Contact Us',
    settings: 'Settings',
    
    // Home page translations
    welcome: 'Welcome to Our Restaurant',
    enjoyFood: 'Enjoy the most delicious food with a unique dining experience',
    viewMenu: 'View Menu',
    whyChooseUs: 'Why Choose Us?',
    freshIngredients: 'Fresh Ingredients',
    freshIngredientsDesc: 'We use only the best fresh ingredients to ensure the quality of our dishes',
    fastService: 'Fast Service',
    fastServiceDesc: 'We provide fast and efficient service to ensure customer satisfaction',
    uniqueExperience: 'Unique Experience',
    uniqueExperienceDesc: 'We offer a unique dining experience that you will never forget',
    bestSellers: 'Best Sellers',
    writeReview: 'Write a Review',
    // Menu page translations
    menuTitle: 'Food Menu',
    searchDish: 'Search for a dish...',
    all: 'All',
    appetizers: 'Appetizers',
    mainDishes: 'Main Dishes',
    desserts: 'Desserts',
    drinks: 'Drinks',
    mostPopular: 'Most Popular',
    calories: 'calories',
    details: 'Details',
    ingredients: 'Ingredients',
    customizationOptions: 'Customization Options',
    noProductsFound: 'No products found',
    loading: 'Loading...',
    
    // Admin settings translations
    adminPanel: 'Restaurant Admin Panel',
    logout: 'Logout',
    adminLogin: 'Admin Login',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    invalidCredentials: 'Invalid username or password',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    
    // Product management translations
    productManagement: 'Product Management',
    addNewProduct: 'Add New Product',
    editProduct: 'Edit Product',
    productName: 'Product Name',
    price: 'Price',
    category: 'Category',
    subcategory: 'Subcategory',
    description: 'Description',
    imageUrl: 'Image URL',
    ingredientsSeparated: 'Ingredients (separated by commas)',
    isPopular: 'Most Popular',
    save: 'Save',
    cancel: 'Cancel',
    actions: 'Actions',
    noProductsAvailable: 'No products available',
    confirmDelete: 'Are you sure you want to delete this product?',
    
    // Footer translations
    allRightsReserved: 'All Rights Reserved',
    followUs: 'Follow Us',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    address: 'Address: Restaurant Street, City',
    phone: 'Phone: +123 456 7890',
    email: 'Email: info@restaurant.com',
    // Reviews translations
    customerReviews: 'Customer Reviews',
    shareExperience: 'Share Your Experience',
    noReviewsYet: 'No reviews yet',
    name: 'Name',
    phoneNumber: 'Phone Number',
    rating: 'Rating',
    yourComment: 'Your Comment',
    commentPlaceholder: 'Share your experience with us...',
    submitReview: 'Submit Review',
    submitting: 'Submitting...',
    reviewNote: 'Your review will be reviewed before publishing',
    reviewSubmitted: 'Review submitted successfully! It will be reviewed before publishing',
    reviewError: 'Error submitting review',
    manageReviews: 'Manage Reviews',
    noReviews: 'No reviews',
    status: 'Status',
    pending: 'Pending',
    approve: 'Approve',
    reject: 'Reject',
    reviewApproved: 'Review approved',
    reviewRejected: 'Review rejected',
    reviewDeleted: 'Review deleted',
    error: 'An error occurred',
    
    // Category translations
    categories: {
      'مقبلات': 'Appetizers',
      'أطباق رئيسية': 'Main Dishes',
      'حلويات': 'Desserts',
      'مشروبات': 'Drinks',
      'سلطات': 'Salads',
      'شوربات': 'Soups'
    },
    subcategories: {
      'سلطات': 'Salads',
      'شوربات': 'Soups',
      'مقبلات باردة': 'Cold Appetizers',
      'مقبلات ساخنة': 'Hot Appetizers',
      'لحوم': 'Meat',
      'دجاج': 'Chicken',
      'أسماك': 'Fish',
      'نباتي': 'Vegetarian',
      'معكرونة': 'Pasta',
      'أرز': 'Rice'
    }
  }
};

// إنشاء سياق اللغة
const LanguageContext = createContext();

// تبديل اللغة مع تحسينات الأداء
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar');
  const [t, setT] = useState(translations.ar);
  const [isLoading, setIsLoading] = useState(false);
  
  // تحميل اللغة المحفوظة عند تحميل الصفحة
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(savedLanguage);
    setT(translations[savedLanguage]);
    
    // تطبيق اتجاه النص فوراً
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;
    
    // إضافة كلاس CSS للغة
    document.body.className = document.body.className.replace(/\blang-\w+\b/g, '');
    document.body.classList.add(`lang-${savedLanguage}`);
  }, []);
  
  const toggleLanguage = useCallback(() => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    
    // تحدية الحالة
    setLanguage(newLanguage);
    setT(translations[newLanguage]);
    
    // حفظ في localStorage
    localStorage.setItem('language', newLanguage);
    
    // تغيير اتجاه الصفحة والخصائص فوراً
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
    
    // تحديث كلاس CSS للغة
    document.body.className = document.body.className.replace(/\blang-\w+\b/g, '');
    document.body.classList.add(`lang-${newLanguage}`);
  }, [language]);
  
  // دالة للحصول على ترجمة الفئة
  const getCategoryTranslation = useCallback((category) => {
    return t.categories?.[category] || category;
  }, [t]);
  
  // دالة للحصول على ترجمة الفئة الفرعية
  const getSubcategoryTranslation = useCallback((subcategory) => {
    // البحث في الترجمات أولاً
    const translation = t.subcategories?.[subcategory];
    if (translation) {
      return translation;
    }
    
    // إذا لم توجد ترجمة، إرجاع النص الأصلي
    return subcategory;
  }, [t]);
  
  const value = {
    language,
    t,
    toggleLanguage,
    isLoading,
    getCategoryTranslation,
    getSubcategoryTranslation
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// دالة مساعدة لاستخدام سياق اللغة
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}