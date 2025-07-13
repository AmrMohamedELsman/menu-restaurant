'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoryFilter({ onCategoryChange, onSubcategoryChange }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [categoriesWithSubs, setCategoriesWithSubs] = useState({});
  const [loading, setLoading] = useState(true);

  // جلب الفئات من قاعدة البيانات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategoriesWithSubs(data);
        } else {
          console.error('فشل في جلب الفئات');
          // استخدام الفئات الافتراضية المرتبة في حالة الفشل
          setCategoriesWithSubs({
            'مقبلات': ['سلطات', 'شوربات', 'مقبلات باردة', 'مقبلات ساخنة'],
            'إفطار': ['فطائر', 'بيض', 'خبز وتوست', 'حبوب', 'فواكه'],
            'أطباق رئيسية': ['لحوم', 'دجاج', 'أسماك', 'نباتي', 'معكرونة', 'أرز'],
            'حلويات': ['حلويات شرقية', 'حلويات غربية', 'آيس كريم', 'كيك'],
            'مشروبات': ['مشروبات ساخنة', 'عصائر طبيعية', 'مشروبات باردة', 'عصائر مخلوطة']
          });
        }
      } catch (error) {
        console.error('خطأ في جلب الفئات:', error);
        // استخدام الفئات الافتراضية المرتبة
        setCategoriesWithSubs({
          'مقبلات': ['سلطات', 'شوربات', 'مقبلات باردة', 'مقبلات ساخنة'],
          'إفطار': ['فطائر', 'بيض', 'خبز وتوست', 'حبوب', 'فواكه'],
          'أطباق رئيسية': ['لحوم', 'دجاج', 'أسماك', 'نباتي', 'معكرونة', 'أرز'],
          'حلويات': ['حلويات شرقية', 'حلويات غربية', 'آيس كريم', 'كيك'],
          'مشروبات': ['مشروبات ساخنة', 'عصائر طبيعية', 'مشروبات باردة', 'عصائر مخلوطة']
        });
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
          {t.all}
        </button>
        {Object.keys(categoriesWithSubs).map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              selectedCategory === category
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
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
            الكل
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
              {subcategory}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}