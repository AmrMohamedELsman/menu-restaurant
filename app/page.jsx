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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  
  // جلب صور المنتجات مع تحسين الأداء
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          
          // فلترة المنتجات التي تحتوي على صور
          const productsWithImages = products.filter(product => 
            product.image && product.image.trim() !== ''
          );
          
          // الحصول على المنتجات الأكثر شعبية
          const popular = products.filter(product => product.isPopular).slice(0, 6);
          setPopularProducts(popular);
          
          // تحسين اختيار الصور للخلفية - تقليل العدد لتحسين الأداء
          const subcategoryGroups = {};
          productsWithImages.forEach(product => {
            const subcategory = product.subcategory || product.category || 'أخرى';
            if (!subcategoryGroups[subcategory]) {
              subcategoryGroups[subcategory] = [];
            }
            subcategoryGroups[subcategory].push(product);
          });
          
          // تقليل عدد الصور إلى 5 بدلاً من 10 لتحسين الأداء
          const selectedImages = [];
          const subcategories = Object.keys(subcategoryGroups);
          
          for (let i = 0; i < Math.min(5, subcategories.length); i++) {
            const subcategory = subcategories[i];
            const randomProduct = subcategoryGroups[subcategory][
              Math.floor(Math.random() * subcategoryGroups[subcategory].length)
            ];
            selectedImages.push({
              image: randomProduct.image,
              name: randomProduct.name,
              subcategory: subcategory
            });
          }
          
          setBackgroundImages(selectedImages);
          
          // تحميل الصور مسبقاً
          const imagePromises = selectedImages.map((item, index) => {
            return new Promise((resolve) => {
              const img = new window.Image();
              img.onload = () => resolve();
              img.onerror = () => resolve(); // حتى لو فشل التحميل
              img.src = item.image;
            });
          });
          
          // انتظار تحميل أول صورتين على الأقل
          Promise.all(imagePromises.slice(0, 2)).then(() => {
            setImagesLoaded(true);
          });
        }
      } catch (error) {
        console.error('خطأ في جلب صور المنتجات:', error);
        setImagesLoaded(true); // إظهار المحتوى حتى لو فشل التحميل
      }
    };

    fetchProductImages();
  }, []);

  // تغيير الصورة كل 3 ثوان بدلاً من ثانيتين
  useEffect(() => {
    if (backgroundImages.length > 0 && imagesLoaded) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % backgroundImages.length
        );
      }, 3000); // تغيير كل 3 ثوان

      return () => clearInterval(interval);
    }
  }, [backgroundImages, imagesLoaded]);
  
  return (
    <div className="min-h-screen">
      {/* قسم الترحيب مع الخلفية المتحركة */}
      <section className="relative h-screen overflow-hidden">
        {/* Loading state للخلفية */}
        {!imagesLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">جاري تحميل الصور...</p>
            </div>
          </div>
        )}
        
        {/* الخلفيات المتحركة */}
        {backgroundImages.length > 0 && imagesLoaded && (
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
                  sizes="100vw"
                  quality={75} // تقليل الجودة لتحسين الأداء
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
            ))}
          </div>
        )}
        
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        
        {/* المحتوى */}
        <div className="relative h-full flex items-center justify-center z-20 text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">{t.welcome}</h1>
            <p className="text-xl text-white mb-8 drop-shadow-md">{t.enjoyFood}</p>
            
            {/* مجموعة الأزرار المحسنة */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/menu" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 inline-block shadow-lg hover:shadow-xl hover:scale-105">
                {t.viewMenu}
              </Link>
              
              <Link href="/menu?filter=popular" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 inline-block shadow-lg hover:shadow-xl hover:scale-105">
                🔥 الأكثر مبيعاً
              </Link>
              
              <button 
                onClick={() => {
                  document.getElementById('reviews-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 inline-block shadow-lg hover:shadow-xl hover:scale-105"
              >
                💬 اكتب تعليق
              </button>
            </div>
          </div>
        </div>
        
        {/* مؤشرات الصور */}
        {backgroundImages.length > 1 && imagesLoaded && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* عرض اسم الفئة الفرعية الحالية */}
        {backgroundImages.length > 0 && imagesLoaded && (
          <div className="absolute top-8 right-8 z-30">
            <div className="bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-medium">
                {backgroundImages[currentImageIndex]?.subcategory}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* قسم المنتجات الأكثر شعبية */}
      {popularProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">🔥 الأكثر مبيعاً</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {popularProducts.map((product, index) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 relative">
                    <Image
                      src={product.image || '/placeholder-food.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                    <p className="text-green-600 font-bold text-xl">{product.price} ج.م</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/menu?filter=popular" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                عرض جميع المنتجات الأكثر مبيعاً
              </Link>
            </div>
          </div>
        </section>
      )}

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
      <div id="reviews-section">
        <ReviewsSection />
      </div>
      
      {/* قسم إضافة تعليق */}
      <AddReviewForm />
    </div>
  );
}