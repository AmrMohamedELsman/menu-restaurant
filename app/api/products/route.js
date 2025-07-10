import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/mongodb';

// GET - جلب جميع المنتجات
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المنتجات', details: error.message },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج جديد
export async function POST(request) {
  try {
    await connectDB();
    const productData = await request.json();
    
    // التحقق من البيانات المطلوبة
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { 
          error: 'بيانات ناقصة', 
          details: 'الاسم والسعر والفئة مطلوبة'
        },
        { status: 400 }
      );
    }
    
    const product = new Product(productData);
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          error: 'خطأ في التحقق من البيانات', 
          details: validationErrors.join(', ')
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'فشل في إنشاء المنتج', details: error.message },
      { status: 500 }
    );
  }
}