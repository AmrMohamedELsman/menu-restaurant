'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaInfoCircle } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { translateText } from '@/lib/translator';

export default function ProductCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { t, language } = useLanguage();
  
  // حالات للنصوص المترجمة
  const [translatedName, setTranslatedName] = useState(product.name);
  const [translatedDescription, setTranslatedDescription] = useState(product.description);
  const [translatedCategory, setTranslatedCategory] = useState(product.category);
  const [translatedSubcategory, setTranslatedSubcategory] = useState(product.subcategory);
  const [isTranslating, setIsTranslating] = useState(false);

  // ترجمة النصوص عند تغيير اللغة
  useEffect(() => {
    const translateProductInfo = async () => {
      if (language === 'en') {
        setIsTranslating(true);
        try {
          const [name, description, category, subcategory] = await Promise.all([
            translateText(product.name),
            product.description ? translateText(product.description) : '',
            translateText(product.category),
            product.subcategory ? translateText(product.subcategory) : ''
          ]);
          
          setTranslatedName(name);
          setTranslatedDescription(description);
          setTranslatedCategory(category);
          setTranslatedSubcategory(subcategory);
        } catch (error) {
          console.error('Translation failed:', error);
        } finally {
          setIsTranslating(false);
        }
      } else {
        // إرجاع النصوص الأصلية للعربية
        setTranslatedName(product.name);
        setTranslatedDescription(product.description);
        setTranslatedCategory(product.category);
        setTranslatedSubcategory(product.subcategory);
      }
    };

    translateProductInfo();
  }, [language, product]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 relative flex items-center justify-center">
          {product.image ? (
            <Image 
              src={product.image} 
              alt={translatedName}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">🍽️</div>
              <div className="text-sm">{language === 'ar' ? 'لا توجد صورة' : 'No image'}</div>
            </div>
          )}
        </div>
        
        {product.isPopular && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {t.mostPopular}
          </div>
        )}
        
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-sm" />
          ) : (
            <FaRegHeart className="text-gray-400 text-sm" />
          )}
        </button>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold truncate flex-1 mr-2">
            {isTranslating ? (
              <span className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></span>
            ) : (
              translatedName
            )}
          </h3>
          <span className="text-green-600 font-bold text-sm whitespace-nowrap">
            {product.price} {language === 'ar' ? 'ج.م' : 'EGP'}
          </span>
        </div>
        
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
          {isTranslating ? (
            <span className="animate-pulse bg-gray-200 h-3 w-full rounded"></span>
          ) : (
            translatedDescription || (language === 'ar' ? 'لا يوجد وصف متاح' : 'No description available')
          )}
        </p>
        
        {/* عرض الفئة والفئة الفرعية */}
        <div className="text-xs text-gray-500 mb-2">
          {isTranslating ? (
            <span className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></span>
          ) : (
            <>
              <span>{translatedCategory}</span>
              {translatedSubcategory && (
                <span> - {translatedSubcategory}</span>
              )}
            </>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{product.calories} {t.calories}</span>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-500 flex items-center text-xs"
            >
              <FaInfoCircle className="mr-1 text-xs" />
              {t.details}
            </button>
          </div>
        </div>
        
        {showDetails && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-gray-50 rounded-lg text-xs"
          >
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-2">
                <strong>{t.ingredients}</strong>
                <p className="text-gray-600">{product.ingredients.join(', ')}</p>
              </div>
            )}
            
            {product.customizationOptions && product.customizationOptions.length > 0 && (
              <div>
                <strong>{t.customizationOptions}</strong>
                {product.customizationOptions.map((option, index) => (
                  <div key={index} className="text-gray-600">
                    <span className="font-medium">{option.name}:</span> {option.options.join(', ')}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}