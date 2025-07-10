'use client';

import { useState, useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import ProductManager from '@/components/ProductManager';
import ReviewManager from '@/components/ReviewManager';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const { t } = useLanguage();

  // قائمة الفئات
  const categories = {
    'all': 'جميع الفئات',
    'مقبلات': 'مقبلات',
    'أطباق رئيسية': 'أطباق رئيسية',
    'حلويات': 'حلويات',
    'مشروبات': 'مشروبات'
  };

  // نظام الفئات والفئات الفرعية
  const categoriesWithSubs = {
    'مقبلات': ['سلطات', 'شوربات', 'مقبلات باردة', 'مقبلات ساخنة'],
    'أطباق رئيسية': ['لحوم', 'دجاج', 'أسماك', 'نباتي', 'معكرونة', 'أرز'],
    'حلويات': ['حلويات شرقية', 'حلويات غربية', 'آيس كريم', 'كيك'],
    'مشروبات': ['عصائر طبيعية', 'مشروبات ساخنة', 'مشروبات باردة', 'عصائر مخلوطة']
  };

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول المخزنة في localStorage
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
    
    // جلب المنتجات من API
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('adminLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
  };

  // فلترة المنتجات حسب الفئة والفئة الفرعية
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const subcategoryMatch = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
    return categoryMatch && subcategoryMatch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{t.adminPanel}</h1>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors duration-300 text-sm md:text-base"
              >
                {t.logout}
              </button>
            )}
          </div>
          
          {isLoggedIn ? (
            <div>
              {/* تبويبات الإدارة */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 border-b">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setSelectedCategory('all');
                      setSelectedSubcategory('all');
                    }}
                    className={`py-2 px-3 md:px-4 font-medium text-sm md:text-base rounded-t-lg sm:rounded-none ${
                      activeTab === 'products' 
                        ? 'border-b-2 border-green-500 text-green-600 bg-green-50' 
                        : 'text-gray-600 hover:text-green-500 hover:bg-gray-50'
                    }`}
                  >
                    إدارة المنتجات
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-2 px-3 md:px-4 font-medium text-sm md:text-base rounded-t-lg sm:rounded-none ${
                      activeTab === 'reviews' 
                        ? 'border-b-2 border-green-500 text-green-600 bg-green-50' 
                        : 'text-gray-600 hover:text-green-500 hover:bg-gray-50'
                    }`}
                  >
                    إدارة التعليقات
                  </button>
                </div>
              </div>
              
              {/* فلتر الفئات المحسن - يظهر فقط في تبويب المنتجات */}
              {activeTab === 'products' && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">فلترة المنتجات:</h3>
                  
                  {/* فلتر الفئات الرئيسية */}
                  <div className="mb-4">
                    <h4 className="text-md font-medium mb-2">الفئة الرئيسية:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedSubcategory('all');
                        }}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                          selectedCategory === 'all'
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-50 hover:border-green-300'
                        }`}
                      >
                        جميع الفئات
                        <span className="ml-1 text-xs opacity-75">({products.length})</span>
                      </button>
                      {Object.entries(categoriesWithSubs).map(([category, subcategories]) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setSelectedSubcategory('all');
                          }}
                          className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                            selectedCategory === category
                              ? 'bg-green-500 text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-50 hover:border-green-300'
                          }`}
                        >
                          {category}
                          <span className="ml-1 text-xs opacity-75">
                            ({products.filter(p => p.category === category).length})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* فلتر الفئات الفرعية */}
                  {selectedCategory !== 'all' && categoriesWithSubs[selectedCategory] && (
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">الفئة الفرعية:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        <button
                          onClick={() => setSelectedSubcategory('all')}
                          className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                            selectedSubcategory === 'all'
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                          }`}
                        >
                          جميع الفئات الفرعية
                          <span className="ml-1 text-xs opacity-75">
                            ({products.filter(p => p.category === selectedCategory).length})
                          </span>
                        </button>
                        {categoriesWithSubs[selectedCategory].map((subcategory) => (
                          <button
                            key={subcategory}
                            onClick={() => setSelectedSubcategory(subcategory)}
                            className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                              selectedSubcategory === subcategory
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                            }`}
                          >
                            {subcategory}
                            <span className="ml-1 text-xs opacity-75">
                              ({products.filter(p => p.category === selectedCategory && p.subcategory === subcategory).length})
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* عرض نتائج الفلترة */}
                  <div className="text-sm text-gray-600 bg-white p-3 rounded-md border">
                    <span className="font-medium">النتائج:</span> عرض {filteredProducts.length} منتج
                    {selectedCategory !== 'all' && (
                      <span> من فئة "{selectedCategory}"</span>
                    )}
                    {selectedSubcategory !== 'all' && (
                      <span> - "{selectedSubcategory}"</span>
                    )}
                  </div>
                </div>
              )}
              
              {/* محتوى التبويبات */}
              {activeTab === 'products' && (
                <ProductManager 
                  initialProducts={filteredProducts} 
                  onProductsChange={fetchProducts}
                  selectedCategory={selectedCategory}
                />
              )}
              {activeTab === 'reviews' && <ReviewManager />}
            </div>
          ) : (
            <AdminLogin onLogin={handleLogin} />
          )}
        </div>
      </div>
    </div>
  );
}