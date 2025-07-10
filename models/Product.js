import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال اسم المنتج'],
    trim: true,
    maxlength: [100, 'لا يمكن أن يتجاوز اسم المنتج 100 حرف']
  },
  description: {
    type: String,
    required: false, // جعل الوصف اختياري
    maxlength: [1000, 'لا يمكن أن يتجاوز وصف المنتج 1000 حرف']
  },
  price: {
    type: Number,
    required: [true, 'الرجاء إدخال سعر المنتج'],
    min: [0, 'يجب أن يكون السعر أكبر من 0']
  },
  image: {
    type: String,
    required: false // جعل الصورة اختيارية
  },
  category: {
    type: String,
    required: [true, 'الرجاء اختيار فئة المنتج']
  },
  subcategory: {
    type: String,
    required: false // جعل الفئة الفرعية اختيارية
  },
  calories: {
    type: Number,
    default: 0
  },
  ingredients: [String],
  isPopular: {
    type: Boolean,
    default: false
  },
  customizationOptions: [
    {
      name: String,
      options: [String],
      priceAdjustment: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;