'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaInfoCircle } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { t, language } = useLanguage();
  
  // إزالة الترجمة الفورية لتسريع التحميل
  // يمكن إضافة الترجمة لاحقاً كميزة اختيارية
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 relative flex items-center justify-center">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              loading="lazy" // تحميل كسول للصور
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-sm">لا توجد صورة</p>
            </div>
          )}
        </div>
        
        {product.isPopular && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {t.popular}
          </div>
        )}
        
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 left-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        
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
            <span className="bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
            {product.subcategory && (
              <span className="bg-gray-100 px-2 py-1 rounded ml-1">
                {product.subcategory}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-green-600 hover:text-green-700 transition-colors"
          >
            <FaInfoCircle />
          </button>
        </div>
        
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-200"
          >
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-2">
                <h4 className="font-semibold text-sm mb-1">{t.ingredients}:</h4>
                <p className="text-xs text-gray-600">
                  {Array.isArray(product.ingredients) 
                    ? product.ingredients.join(', ') 
                    : product.ingredients}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}