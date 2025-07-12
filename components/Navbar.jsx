'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaCog, FaLanguage, FaFire } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, toggleLanguage, isLoading, language } = useLanguage();

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 transition-all duration-300 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* الشعار */}
          <Link href="/" className="text-2xl font-bold text-green-600 transition-all duration-300">
            {language === 'ar' ? 'مطعمنا' : 'Our Restaurant'}
          </Link>

          {/* القائمة للشاشات الكبيرة */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="/" className="text-gray-700 hover:text-green-500 transition-colors duration-300">
              {t.home}
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-green-500 transition-colors duration-300">
              {t.menu}
            </Link>
            <Link 
              href="/menu?popular=true" 
              className="text-gray-700 hover:text-red-500 transition-colors duration-300 flex items-center"
            >
              <FaFire className={`text-red-500 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
              {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}
            </Link>
          </div>

          {/* أيقونات الإعدادات وتبديل اللغة */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              disabled={isLoading}
              className={`text-gray-700 hover:text-green-500 transition-all duration-300 flex items-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaLanguage className={`text-xl ${language === 'ar' ? 'ml-1' : 'mr-1'} ${
                isLoading ? 'animate-spin' : ''
              }`} />
              <span className="text-sm">{t.switchLanguage}</span>
            </button>
            <Link href="/admin" className="text-gray-700 hover:text-green-500 transition-colors duration-300">
              <FaCog className="text-xl" />
            </Link>

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              className="md:hidden text-gray-700 hover:text-green-500 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* القائمة المنسدلة للشاشات الصغيرة */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-4 transition-all duration-300">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-green-500 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.home}
            </Link>
            <Link 
              href="/menu" 
              className="text-gray-700 hover:text-green-500 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.menu}
            </Link>
            <Link 
              href="/menu?popular=true" 
              className="text-gray-700 hover:text-red-500 transition-colors duration-300 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaFire className={`text-red-500 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
              {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}
            </Link>
            <Link 
              href="/admin" 
              className="text-gray-700 hover:text-green-500 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.settings}
            </Link>
            <button
              onClick={() => {
                toggleLanguage();
                setIsMenuOpen(false);
              }}
              disabled={isLoading}
              className={`text-gray-700 hover:text-green-500 transition-colors duration-300 text-${language === 'ar' ? 'right' : 'left'} ${
                isLoading ? 'opacity-50' : ''
              }`}
            >
              {t.switchLanguage}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}