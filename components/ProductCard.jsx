'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaInfoCircle } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { translateText } from '@/lib/translator';

export default function ProductCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [translatedProduct, setTranslatedProduct] = useState({
    name: product.name,
    description: product.description,
    ingredients: product.ingredients
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const { t, language, getCategoryTranslation, getSubcategoryTranslation } = useLanguage();
  
  // تحسين الترجمة مع التخزين المؤقت
  const translateProductInfo = useCallback(async () => {
    if (language === 'en' && !isTranslating) {
      setIsTranslating(true);
      try {
        // التحقق من التخزين المؤقت أولاً
        const cacheKey = `translation_${product._id || product.id}_en`;
        const cachedTranslation = localStorage.getItem(cacheKey);
        
        if (cachedTranslation) {
          setTranslatedProduct(JSON.parse(cachedTranslation));
          setIsTranslating(false);
          return;
        }
        
        // ترجمة فقط النصوص الموجودة
        const translationPromises = [];
        
        if (product.name) {
          translationPromises.push(translateText(product.name, 'en', 'ar'));
        }
        
        if (product.description) {
          translationPromises.push(translateText(product.description, 'en', 'ar'));
        }
        
        if (product.ingredients) {
          const ingredientsText = Array.isArray(product.ingredients) 
            ? product.ingredients.join(', ') 
            : product.ingredients;
          translationPromises.push(translateText(ingredientsText, 'en', 'ar'));
        }
        
        const results = await Promise.all(translationPromises);
        
        const translated = {
          name: product.name ? results[0] : product.name,
          description: product.description ? results[1] : product.description,
          ingredients: product.ingredients ? results[2] : product.ingredients
        };
        
        // حفظ في التخزين المؤقت
        localStorage.setItem(cacheKey, JSON.stringify(translated));
        
        setTranslatedProduct(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedProduct({
          name: product.name,
          description: product.description,
          ingredients: product.ingredients
        });
      } finally {
        setIsTranslating(false);
      }
    } else if (language === 'ar') {
      setTranslatedProduct({
        name: product.name,
        description: product.description,
        ingredients: product.ingredients
      });
    }
  }, [language, product.name, product.description, product.ingredients, product._id, product.id, isTranslating]);
  
  useEffect(() => {
    translateProductInfo();
  }, [translateProductInfo]);
  
  // تحسين عرض الصورة
  const imageComponent = useMemo(() => {
    if (product.image) {
      return (
        <Image
          src={product.image}
          alt={translatedProduct.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      );
    }
    return (
      <div className="text-gray-400 text-center">
        <div className="text-4xl mb-2">🍽️</div>
        <p className="text-sm">{language === 'ar' ? 'لا توجد صورة' : 'No Image'}</p>
      </div>
    );
  }, [product.image, translatedProduct.name, language]);
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}>
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 relative flex items-center justify-center">
          {imageComponent}
        </div>
        
        {product.isPopular && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {t.popular}
          </div>
        )}
        
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 left-2 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 hover:scale-110"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800 transition-all duration-300">
          {isTranslating && language === 'en' ? (
            <div className="animate-pulse bg-gray-200 h-6 rounded"></div>
          ) : (
            translatedProduct.name
          )}
        </h3>
        
        <div className="text-gray-600 text-sm mb-2 line-clamp-2 transition-all duration-300">
          {isTranslating && language === 'en' ? (
            <div className="animate-pulse bg-gray-200 h-4 rounded mb-1"></div>
          ) : (
            translatedProduct.description
          )}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-600 font-bold text-lg">
            {product.price} {t.currency}
          </span>
          
          {product.calories && (
            <span className="text-gray-500 text-sm">
              {product.calories} {t.calories}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded transition-all duration-300">
              {getCategoryTranslation(product.category)}
            </span>
            {product.subcategory && (
              <span className={`bg-gray-100 px-2 py-1 rounded transition-all duration-300 ${
                language === 'ar' ? 'mr-1' : 'ml-1'
              }`}>
                {getSubcategoryTranslation(product.subcategory)}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
          >
            <FaInfoCircle />
          </button>
        </div>
        
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-gray-200"
          >
            {translatedProduct.ingredients && (
              <div className="mb-2">
                <h4 className="font-semibold text-sm mb-1">{t.ingredients}:</h4>
                <p className="text-xs text-gray-600">
                  {isTranslating && language === 'en' ? (
                    <div className="animate-pulse bg-gray-200 h-3 rounded"></div>
                  ) : (
                    Array.isArray(translatedProduct.ingredients) 
                      ? translatedProduct.ingredients.join(', ') 
                      : translatedProduct.ingredients
                  )}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}