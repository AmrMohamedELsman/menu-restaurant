'use client';

import { useState } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // يمكنك تغيير اسم المستخدم وكلمة المرور هنا
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin(true);
      setError('');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">تسجيل دخول المدير</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            اسم المستخدم
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pr-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            كلمة المرور
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}