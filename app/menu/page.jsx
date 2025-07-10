'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { useLanguage } from '@/context/LanguageContext';

export default function MenuPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // جلب المنتجات من API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } else {
        console.error('Failed to fetch products');
        // استخدام البيانات الوهمية كبديل
        const dummyProducts = [
          {
            _id: '1',
            name: language === 'ar' ? 'برجر لحم أنجوس' : 'Angus Beef Burger',
            description: language === 'ar' 
              ? 'برجر لحم بقري أنجوس مشوي مع جبنة شيدر وصلصة خاصة'
              : 'Grilled Angus beef burger with cheddar cheese and special sauce',
            price: 65,
            image: '/images/burger.jpg',
            category: language === 'ar' ? 'أطباق رئيسية' : 'Main Dishes',
            subcategory: language === 'ar' ? 'لحوم' : 'Meat',
            calories: 750,
            ingredients: language === 'ar' 
              ? ['لحم أنجوس', 'خبز بريوش', 'جبنة شيدر', 'خس', 'طماطم', 'صلصة خاصة']
              : ['Angus beef', 'Brioche bun', 'Cheddar cheese', 'Lettuce', 'Tomato', 'Special sauce'],
            isPopular: true
          },
          // ... باقي المنتجات الوهمية
        ];
        setProducts(dummyProducts);
        setFilteredProducts(dummyProducts);
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
    let result = [...products];
    
    // تطبيق فلتر الفئة الرئيسية
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // تطبيق فلتر الفئة الفرعية
    if (selectedSubcategory !== 'all') {
      result = result.filter(product => product.subcategory === selectedSubcategory);
    }
    
    // تطبيق فلتر البحث
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, selectedSubcategory, searchQuery, products]);

  // دوال التعامل مع تغيير الفئات
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all'); // إعادة تعيين الفئة الفرعية
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{t.menuTitle}</h1>
      
      <div className="mb-6">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder={t.searchDish} />
      </div>
      
      <div className="mb-8">
        <CategoryFilter 
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">{t.noProductsFound}</p>
          </div>
        )}
      </div>
    </div>
  );
}