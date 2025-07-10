'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات الاتصال */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t.contactUs}</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-400" />
                <span>{t.address}</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-green-400" />
                <span>{t.phone}</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-green-400" />
                <span>{t.email}</span>
              </li>
            </ul>
          </div>
          
          {/* روابط سريعة */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-green-400 transition-colors duration-300">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-green-400 transition-colors duration-300">
                  {t.menu}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* وسائل التواصل الاجتماعي */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t.followUs}</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-green-400 transition-colors duration-300">
                <FaFacebook />
              </a>
              <a href="#" className="text-2xl hover:text-green-400 transition-colors duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="text-2xl hover:text-green-400 transition-colors duration-300">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {currentYear} {t.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
}