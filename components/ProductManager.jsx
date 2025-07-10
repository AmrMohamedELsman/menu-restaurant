'use client';

import { useState, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

export default function ProductManager({ initialProducts = [], onProductsChange }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // إضافة state للفئات الجديدة
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // نظام الفئات والفئات الفرعية
  const [categoriesWithSubs, setCategoriesWithSubs] = useState({
    'مقبلات': ['سلطات', 'شوربات', 'مقبلات باردة', 'مقبلات ساخنة'],
    'أطباق رئيسية': ['لحوم', 'دجاج', 'أسماك', 'نباتي', 'معكرونة', 'أرز'],
    'حلويات': ['حلويات شرقية', 'حلويات غربية', 'آيس كريم', 'كيك'],
    'مشروبات': ['عصائر طبيعية', 'مشروبات ساخنة', 'مشروبات باردة', 'عصائر مخلوطة']
  });
  
  const defaultProduct = {
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'أطباق رئيسية',
    subcategory: '',
    calories: 0,
    ingredients: [],
    isPopular: false,
    customizationOptions: []
  };
  
  // دالة إضافة فئة جديدة
  const handleAddCategory = () => {
    if (newCategory.trim() && !categoriesWithSubs[newCategory]) {
      setCategoriesWithSubs({
        ...categoriesWithSubs,
        [newCategory]: []
      });
      setEditingProduct({
        ...editingProduct,
        category: newCategory,
        subcategory: ''
      });
      setNewCategory('');
      setShowAddCategory(false);
    } else if (categoriesWithSubs[newCategory]) {
      alert('هذه الفئة موجودة بالفعل');
    }
  };
  
  // دالة إضافة فئة فرعية جديدة
  const handleAddSubcategory = () => {
    if (newSubcategory.trim() && editingProduct.category) {
      const currentSubs = categoriesWithSubs[editingProduct.category] || [];
      if (!currentSubs.includes(newSubcategory)) {
        setCategoriesWithSubs({
          ...categoriesWithSubs,
          [editingProduct.category]: [...currentSubs, newSubcategory]
        });
        setEditingProduct({
          ...editingProduct,
          subcategory: newSubcategory
        });
        setNewSubcategory('');
        setShowAddSubcategory(false);
      } else {
        alert('هذه الفئة الفرعية موجودة بالفعل');
      }
    }
  };
  
  const handleAddNew = () => {
    setEditingProduct({ ...defaultProduct, id: Date.now().toString() });
    setIsAdding(true);
    setImagePreview(null);
  };
  
  const handleEdit = (product) => {
    setEditingProduct({ ...product });
    setIsAdding(false);
    setImagePreview(product.image);
  };
  
  
  
  const handleSave = async () => {
    try {
      setErrorMessage(''); // مسح رسائل الخطأ السابقة
      
      // التحقق من البيانات المطلوبة
      if (!editingProduct.name.trim()) {
        setErrorMessage('اسم المنتج مطلوب');
        return;
      }
      
      if (!editingProduct.price || editingProduct.price <= 0) {
        setErrorMessage('سعر المنتج مطلوب ويجب أن يكون أكبر من صفر');
        return;
      }
      
      if (!editingProduct.category) {
        setErrorMessage('فئة المنتج مطلوبة');
        return;
      }
      
      const url = isAdding ? '/api/products' : `/api/products/${editingProduct._id}`;
      const method = isAdding ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });
      
      // التحقق من نوع المحتوى
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('الخادم لا يعيد JSON صالح. تحقق من حالة الخادم.');
      }
      
      if (response.ok) {
        const result = await response.json();
        
        if (isAdding) {
          setProducts([...products, result]);
        } else {
          setProducts(products.map(p => p._id === result._id ? result : p));
        }
        
        if (onProductsChange) {
          onProductsChange();
        }
        
        setEditingProduct(null);
        setImagePreview(null);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(`فشل في ${isAdding ? 'إضافة' : 'تحديث'} المنتج: ${errorData.details || errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.message.includes('JSON')) {
        setErrorMessage('خطأ في الاتصال بالخادم. تأكد من أن الخادم يعمل بشكل صحيح.');
      } else {
        setErrorMessage('حدث خطأ أثناء حفظ المنتج. تحقق من الاتصال بالإنترنت.');
      }
    }
  };
  
  const handleDelete = async (productId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p._id !== productId));
          // إعلام المكون الأب بالتغيير
          if (onProductsChange) {
            onProductsChange();
          }
        } else {
          alert('فشل في حذف المنتج');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('حدث خطأ أثناء حذف المنتج');
      }
    }
  };
  
  const handleCancel = () => {
    setEditingProduct(null);
    setImagePreview(null);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // إذا تم تغيير الفئة الرئيسية، قم بتحديث الفئة الفرعية للأولى في القائمة
    if (name === 'category') {
      const firstSubcategory = categoriesWithSubs[value][0];
      setEditingProduct({
        ...editingProduct,
        [name]: newValue,
        subcategory: firstSubcategory
      });
      return;
    }
    
    setEditingProduct({
      ...editingProduct,
      [name]: newValue
    });
  };
  
  const handleIngredientsChange = (e) => {
    const ingredients = e.target.value.split(',').map(item => item.trim());
    setEditingProduct({
      ...editingProduct,
      ingredients
    });
  };
  
  // معالجة رفع الصور
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح');
        return;
      }
      
      // التحقق من حجم الملف (5MB كحد أقصى)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setImagePreview(imageDataUrl);
        setEditingProduct({
          ...editingProduct,
          image: imageDataUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
        <button
          onClick={handleAddNew}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" />
          إضافة منتج جديد
        </button>
      </div>
      
      {/* رسالة الخطأ */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      {editingProduct ? (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-xl font-bold mb-4">{isAdding ? 'إضافة منتج جديد' : 'تعديل المنتج'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج *</label>
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="أدخل اسم المنتج"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر *</label>
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="أدخل السعر"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الفئة الرئيسية *</label>
              <div className="flex gap-2">
                <select
                  name="category"
                  value={editingProduct.category}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-md"
                >
                  {Object.keys(categoriesWithSubs).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                  title="إضافة فئة جديدة"
                >
                  +
                </button>
              </div>
              
              {showAddCategory && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="اسم الفئة الجديدة"
                    className="flex-1 p-2 border rounded-md text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
                  >
                    إضافة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الفئة الفرعية</label>
              <div className="flex gap-2">
                <select
                  name="subcategory"
                  value={editingProduct.subcategory}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-md"
                >
                  <option value="">اختر الفئة الفرعية (اختياري)</option>
                  {(categoriesWithSubs[editingProduct.category] || []).map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddSubcategory(!showAddSubcategory)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                  disabled={!editingProduct.category}
                  title="إضافة فئة فرعية جديدة"
                >
                  +
                </button>
              </div>
              
              {showAddSubcategory && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="اسم الفئة الفرعية الجديدة"
                    className="flex-1 p-2 border rounded-md text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
                  >
                    إضافة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubcategory(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعرات الحرارية</label>
              <input
                type="number"
                name="calories"
                value={editingProduct.calories}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">صورة المنتج (اختياري)</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaUpload className="mr-2" />
                  اختر صورة
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                {imagePreview && (
                  <div className="w-16 h-16 relative">
                    <Image
                      src={imagePreview}
                      alt="معاينة الصورة"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (اختياري)</label>
              <textarea
                name="description"
                value={editingProduct.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows="3"
                placeholder="اكتب وصف المنتج (اختياري)"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">المكونات (مفصولة بفواصل)</label>
              <textarea
                value={editingProduct.ingredients.join(', ')}
                onChange={handleIngredientsChange}
                className="w-full p-2 border rounded-md"
                rows="2"
              ></textarea>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={editingProduct.isPopular}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">الأكثر طلباً</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md flex items-center"
            >
              <FaTimes className="mr-2" />
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaSave className="mr-2" />
              حفظ
            </button>
          </div>
        </div>
      ) : null}
      
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-right">المنتج</th>
              <th className="py-3 px-6 text-right">الفئة</th>
              <th className="py-3 px-6 text-right">الفئة الفرعية</th>
              <th className="py-3 px-6 text-right">السعر</th>
              <th className="py-3 px-6 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id || product._id || index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center">
                      <div className="w-10 h-10 relative mr-3">
                        <Image 
                          src={product.image || 'https://via.placeholder.com/40x40'} 
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      </div>
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-right">{product.category}</td>
                  <td className="py-3 px-6 text-right">{product.subcategory}</td>
                  <td className="py-3 px-6 text-right">{product.price} ج.م</td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex item-center justify-end">
                      <button
                        onClick={() => handleEdit(product)}
                        className="transform hover:text-blue-500 hover:scale-110 transition-all duration-300 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="transform hover:text-red-500 hover:scale-110 transition-all duration-300"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                لا توجد منتجات متاحة
              </div>
            )}
          </tbody>
        </table>
      </div>
      
      {/* تخطيط البطاقات للهواتف المحمولة - حجم أصغر */}
      <div className="md:hidden space-y-3">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={product.id || product._id || index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* الصورة في الأعلى - تملأ المساحة كاملة */}
              // في قسم عرض المنتجات للموبايل:
              <div className="h-40 bg-gray-100 relative flex items-center justify-center overflow-hidden rounded-t-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-3xl mb-1">🍽️</div>
                    <div className="text-xs">لا توجد صورة</div>
                  </div>
                )}
              </div>
              
              {/* معلومات المنتج */}
              <div className="p-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 truncate">{product.name}</h3>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">الفئة:</span> {product.category}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">الفئة الفرعية:</span> {product.subcategory}
                    </p>
                    <p className="text-lg font-bold text-green-600">{product.price} ج.م</p>
                  </div>
                </div>
                
                {/* أزرار الإجراءات - أصغر حجماً */}
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-xs flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-xs flex items-center"
                  >
                    <FaTrash className="mr-1" />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            لا توجد منتجات متاحة
          </div>
        )}
      </div>
    </div>
  ); // 
}
  // إضافة هذا القوس المفقود