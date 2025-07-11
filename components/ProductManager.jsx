'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // نظام الفئات والفئات الفرعية - سيتم جلبها من قاعدة البيانات
  const [categoriesWithSubs, setCategoriesWithSubs] = useState({});
  
  // جلب الفئات من قاعدة البيانات عند تحميل المكون
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategoriesWithSubs(data);
        } else {
          console.error('فشل في جلب الفئات');
          // استخدام الفئات الافتراضية في حالة الفشل
          setCategoriesWithSubs({
            'مقبلات': ['سلطات', 'شوربات', 'مقبلات باردة', 'مقبلات ساخنة'],
            'أطباق رئيسية': ['لحوم', 'دجاج', 'أسماك', 'نباتي', 'معكرونة', 'أرز'],
            'حلويات': ['حلويات شرقية', 'حلويات غربية', 'آيس كريم', 'كيك'],
            'مشروبات': ['عصائر طبيعية', 'مشروبات ساخنة', 'مشروبات باردة', 'عصائر مخلوطة']
          });
        }
      } catch (error) {
        console.error('خطأ في جلب الفئات:', error);
        // استخدام الفئات الافتراضية
        setCategoriesWithSubs({
          'مقبلات': ['سلطات', 'شوربات', 'مقبلات باردة', 'مقبلات ساخنة'],
          'أطباق رئيسية': ['لحوم', 'دجاج', 'أسماك', 'نباتي', 'معكرونة', 'أرز'],
          'حلويات': ['حلويات شرقية', 'حلويات غربية', 'آيس كريم', 'كيك'],
          'مشروبات': ['عصائر طبيعية', 'مشروبات ساخنة', 'مشروبات باردة', 'عصائر مخلوطة']
        });
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // إضافة مؤشر التحميل للفئات في بداية المكون
  if (categoriesLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل الفئات...</p>
        </div>
      </div>
    );
  }

  const defaultProduct = {
    name: '',
    description: '',
    price: 0,
    image: '',
    category: Object.keys(categoriesWithSubs)[0] || 'أطباق رئيسية',
    subcategory: '',
    calories: 0,
    ingredients: [],
    isPopular: false,
    customizationOptions: []
  };
  
  // دالة إعادة جلب الفئات من قاعدة البيانات
  const refreshCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategoriesWithSubs(data);
      }
    } catch (error) {
      console.error('خطأ في إعادة جلب الفئات:', error);
    }
  };
  
  // دالة إضافة فئة جديدة
  const handleAddCategory = () => {
    if (newCategory.trim() && !categoriesWithSubs[newCategory]) {
      // إضافة الفئة محلياً أولاً
      const updatedCategories = {
        ...categoriesWithSubs,
        [newCategory]: []
      };
      setCategoriesWithSubs(updatedCategories);
      
      setEditingProduct({
        ...editingProduct,
        category: newCategory,
        subcategory: ''
      });
      setNewCategory('');
      setShowAddCategory(false);
      
      // ملاحظة: الفئة ستُحفظ في قاعدة البيانات عند حفظ المنتج
    } else if (categoriesWithSubs[newCategory]) {
      alert('هذه الفئة موجودة بالفعل');
    }
  };
  
  // دالة إضافة فئة فرعية جديدة
  const handleAddSubcategory = () => {
    if (newSubcategory.trim() && editingProduct.category) {
      const currentSubs = categoriesWithSubs[editingProduct.category] || [];
      if (!currentSubs.includes(newSubcategory)) {
        // إضافة الفئة الفرعية محلياً أولاً
        const updatedCategories = {
          ...categoriesWithSubs,
          [editingProduct.category]: [...currentSubs, newSubcategory]
        };
        setCategoriesWithSubs(updatedCategories);
        
        setEditingProduct({
          ...editingProduct,
          subcategory: newSubcategory
        });
        setNewSubcategory('');
        setShowAddSubcategory(false);
        
        // ملاحظة: الفئة الفرعية ستُحفظ في قاعدة البيانات عند حفظ المنتج
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
      setErrorMessage('');
      
      // التحقق من البيانات المطلوبة
      if (!editingProduct.name || !editingProduct.price || !editingProduct.category) {
        setErrorMessage('الاسم والسعر والفئة مطلوبة');
        return;
      }
      
      const url = isAdding ? '/api/products' : `/api/products/${editingProduct._id}`;
      const method = isAdding ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });
      
      if (response.ok) {
        const savedProduct = await response.json();
        
        if (isAdding) {
          const newProducts = [...products, savedProduct];
          setProducts(newProducts);
          onProductsChange?.(newProducts);
        } else {
          const updatedProducts = products.map(p => 
            p._id === savedProduct._id ? savedProduct : p
          );
          setProducts(updatedProducts);
          onProductsChange?.(updatedProducts);
        }
        
        // إعادة جلب الفئات لضمان التحديث
        await refreshCategories();
        
        setEditingProduct(null);
        setIsAdding(false);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setErrorMessage('حدث خطأ أثناء الحفظ');
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


