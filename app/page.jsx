'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import ReviewsSection from '@/components/ReviewsSection';
import AddReviewForm from '@/components/AddReviewForm';

export default function HomePage() {
  const { t } = useLanguage();
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // جلب صور المنتجات
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          // فلترة المنتجات التي تحتوي على صور
          const imagesWithProducts = products
            .filter(product => product.image && product.image.trim() !== '')
            .map(product => ({
              image: product.image,
              name: product.name
            }));
          setBackgroundImages(imagesWithProducts);
        }
      } catch (error) {
        console.error('خطأ في جلب صور المنتجات:', error);
      }
    };

    fetchProductImages();
  }, []);

  // تغيير الصورة كل ثانيتين
  useEffect(() => {
    if (backgroundImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % backgroundImages.length
        );
      }, 2000); // تغيير كل ثانيتين

      return () => clearInterval(interval);
    }
  }, [backgroundImages]);
  
  return (
    <div className="min-h-screen">
      {/* قسم الترحيب مع الخلفية المتحركة */}
      <section className="relative h-screen overflow-hidden">
        {/* الخلفيات المتحركة */}
        {backgroundImages.length > 0 && (
          <div className="absolute inset-0">
            {backgroundImages.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        
        {/* المحتوى */}
        <div className="relative h-full flex items-center justify-center z-20 text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">{t.welcome}</h1>
            <p className="text-xl text-white mb-8 drop-shadow-md">{t.enjoyFood}</p>
            <Link href="/menu" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-300 inline-block shadow-lg hover:shadow-xl">
              {t.viewMenu}
            </Link>
          </div>
        </div>
        
        {/* مؤشرات الصور (اختياري) */}
        {backgroundImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* قسم المميزات */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.whyChooseUs}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.freshIngredients}</h3>
              <p className="text-gray-600">{t.freshIngredientsDesc}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.fastService}</h3>
              <p className="text-gray-600">{t.fastServiceDesc}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.uniqueExperience}</h3>
              <p className="text-gray-600">{t.uniqueExperienceDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم التعليقات */}
      <ReviewsSection />
      
      {/* قسم إضافة تعليق */}
      <AddReviewForm />
    </div>
  );
}