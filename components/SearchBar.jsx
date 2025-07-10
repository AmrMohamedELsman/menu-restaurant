'use client';

import { FaSearch } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export default function SearchBar({ searchQuery, setSearchQuery, placeholder }) {
  const { t } = useLanguage();
  
  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        placeholder={placeholder || t.searchDish}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}