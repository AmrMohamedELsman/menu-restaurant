'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

// مكون Loading Skeleton
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}

// مكون منفصل لاستخدام useSearchParams
function MenuContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const showPopularOnly = searchParams.get('popular') === 'true';

  // جلب المنتجات من API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products', {
        // إضافة cache headers لتسريع التحميل
        headers: {
          'Cache-Control': 'max-age=300' // 5 دقائق
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } else {
        console.error('Failed to fetch products');
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // تطبيق الفلاتر
  useEffect(() => {
    let filtered = products;

    // فلترة المنتجات الأكثر مبيعاً
    if (showPopularOnly) {
      filtered = filtered.filter(product => product.isPopular);
    }

    // فلترة حسب الفئة
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // فلترة حسب الفئة الفرعية
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedSubcategory, searchQuery, showPopularOnly]);

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {showPopularOnly 
              ? (language === 'ar' ? 'المنتجات الأكثر مبيعاً' : 'Best Selling Products')
              : (language === 'ar' ? 'قائمة الطعام' : 'Menu')
            }
          </h1>
          {showPopularOnly && (
            <p className="text-gray-600 text-lg">
              {language === 'ar' 
                ? 'اكتشف أشهى أطباقنا المفضلة لدى العملاء' 
                : 'Discover our customers\' favorite dishes'
              }
            </p>
          )}
        </div>

        {/* شريط البحث والفلاتر */}
        <div className="mb-8 space-y-4">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder={language === 'ar' ? 'ابحث عن المنتجات...' : 'Search for products...'}
          />
          
          <CategoryFilter 
            onCategoryChange={setSelectedCategory}
            onSubcategoryChange={setSelectedSubcategory}
          />
        </div>

        {/* عرض المنتجات */}
        {isLoading ? (
          // مؤشر التحميل
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          // عرض المنتجات
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id || product.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // رسالة عدم وجود منتجات
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد منتجات متاحة' : 'No products available'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar' 
                ? 'جرب تغيير معايير البحث أو الفلترة' 
                : 'Try changing your search or filter criteria'
              }
            </p>
          </div>
        )}

        {/* إحصائيات المنتجات */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>
              {language === 'ar' 
                ? `عرض ${filteredProducts.length} من ${products.length} منتج`
                : `Showing ${filteredProducts.length} of ${products.length} products`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// المكون الرئيسي مع Suspense
export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-300 rounded mx-auto w-64 animate-pulse mb-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}