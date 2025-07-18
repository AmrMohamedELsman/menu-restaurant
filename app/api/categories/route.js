import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/mongodb';

// GET - جلب جميع الفئات والفئات الفرعية الفريدة
export async function GET() {
  try {
    await connectDB();
    
    // جلب جميع الفئات الفريدة
    const categories = await Product.distinct('category');
    
    // جلب الفئات الفرعية لكل فئة
    const categoriesWithSubs = {};
    
    for (const category of categories) {
      const subcategories = await Product.distinct('subcategory', { category });
      categoriesWithSubs[category] = subcategories.filter(sub => sub && sub.trim() !== '');
    }
    
    // إرجاع الفئات الموجودة فقط (حتى لو كانت فارغة)
    return NextResponse.json(categoriesWithSubs);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الفئات', details: error.message },
      { status: 500 }
    );
  }
}