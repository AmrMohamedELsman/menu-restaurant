'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoryFilter({ onCategoryChange, onSubcategoryChange }) {
  const { t, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [categoriesWithSubs, setCategoriesWithSubs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الفئات من قاعدة البيانات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategoriesWithSubs(data);
          setError(null);
        } else {
          console.error('فشل في جلب الفئات');
          setError('فشل في جلب الفئات من الخادم');
          // لا نستخدم فئات افتراضية - نترك الكائن فارغاً
          setCategoriesWithSubs({});
        }
      } catch (error) {
        console.error('خطأ في جلب الفئات:', error);
        setError('خطأ في الاتصال بالخادم');
        // لا نستخدم فئات افتراضية - نترك الكائن فارغاً
        setCategoriesWithSubs({});
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all');
    onCategoryChange(category);
    onSubcategoryChange('all');
  };
  
  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    onSubcategoryChange(subcategory);
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="px-4 py-2 bg-gray-200 rounded-full animate-pulse">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  // إذا كان هناك خطأ أو لا توجد فئات
  if (error || Object.keys(categoriesWithSubs).length === 0) {
    return (
      <div className="mb-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {error ? (
            <p>{error}</p>
          ) : (
            <p>لا توجد فئات متاحة. يرجى إضافة منتجات أولاً لإنشاء الفئات.</p>
          )}
        </div>
        {/* عرض زر "الكل" فقط */}
        <div className="flex gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className="px-4 py-2 rounded-full bg-green-500 text-white"
          >
            {t.all || 'الكل'}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      {/* الفئات الرئيسية */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-full transition-colors duration-300 ${
            selectedCategory === 'all'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t.all || 'الكل'}
        </button>
        {Object.keys(categoriesWithSubs).map(category => (
          // في عرض الفئات الرئيسية
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              selectedCategory === category
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {getCategoryTranslation(category)}
          </button>
        ))}
      </div>
      
      {/* الفئات الفرعية */}
      {selectedCategory !== 'all' && categoriesWithSubs[selectedCategory] && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSubcategoryChange('all')}
            className={`px-3 py-1 text-sm rounded-full transition-colors duration-300 ${
              selectedSubcategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.all || 'الكل'}
          </button>
          {categoriesWithSubs[selectedCategory].map(subcategory => (
            <button
              key={subcategory}
              onClick={() => handleSubcategoryChange(subcategory)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-300 ${
                selectedSubcategory === subcategory
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getSubcategoryTranslation(selectedCategory, subcategory)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}