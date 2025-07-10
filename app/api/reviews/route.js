import { NextResponse } from 'next/server';
import Review from '@/models/Review';
import connectDB from '@/lib/mongodb';

// GET - جلب التعليقات
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');
    
    let filter = {};
    if (approved === 'true') {
      filter.isApproved = true;
    }
    
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - إضافة تعليق جديد
export async function POST(request) {
  try {
    await connectDB();
    
    const { name, phone, comment, rating } = await request.json();
    
    const review = new Review({
      name,
      phone,
      comment,
      rating,
      isApproved: false
    });
    
    await review.save();
    
    return NextResponse.json(
      { message: 'Review submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}