'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import ReviewsSection from '@/components/ReviewsSection';
import AddReviewForm from '@/components/AddReviewForm';

export default function HomePage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* قسم الترحيب */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative h-full flex items-center justify-center z-20 text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t.welcome}</h1>
            <p className="text-xl text-white mb-8">{t.enjoyFood}</p>
            <Link href="/menu" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-300 inline-block">
              {t.viewMenu}
            </Link>
          </div>
        </div>
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