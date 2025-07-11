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
    
    // إضافة الفئات الافتراضية إذا لم توجد فئات في قاعدة البيانات
    if (Object.keys(categoriesWithSubs).length === 0) {
      return NextResponse.json({
        'مقبلات': ['سلطات', 'شوربات', 'مقبلات باردة', 'مقبلات ساخنة'],
        'أطباق رئيسية': ['لحوم', 'دجاج', 'أسماك', 'نباتي', 'معكرونة', 'أرز'],
        'حلويات': ['حلويات شرقية', 'حلويات غربية', 'آيس كريم', 'كيك'],
        'مشروبات': ['عصائر طبيعية', 'مشروبات ساخنة', 'مشروبات باردة', 'عصائر مخلوطة']
      });
    }
    
    return NextResponse.json(categoriesWithSubs);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الفئات', details: error.message },
      { status: 500 }
    );
  }
}