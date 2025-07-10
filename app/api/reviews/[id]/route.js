import { NextResponse } from 'next/server';
import Review from '@/models/Review';
import connectDB from '@/lib/mongodb';

// PATCH - تحديث حالة التعليق
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const { isApproved } = await request.json();
    
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - حذف التعليق
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}