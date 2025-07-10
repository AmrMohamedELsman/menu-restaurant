'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: true }),
      });

      if (response.ok) {
        toast.success(t.reviewApproved);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error(t.error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: false }),
      });

      if (response.ok) {
        toast.success(t.reviewRejected);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error(t.error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (confirm(t.confirmDelete)) {
      try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success(t.reviewDeleted);
          fetchReviews();
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error(t.error);
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-sm ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{t.manageReviews}</h2>
      
      {reviews.length === 0 ? (
        <p className="text-gray-600">{t.noReviews}</p>
      ) : (
        <>
          {/* عرض الجدول للشاشات الكبيرة */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-right">{t.name}</th>
                  <th className="px-4 py-2 text-right">{t.phoneNumber}</th>
                  <th className="px-4 py-2 text-right">{t.rating}</th>
                  <th className="px-4 py-2 text-right">{t.comment}</th>
                  <th className="px-4 py-2 text-right">{t.status}</th>
                  <th className="px-4 py-2 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} className="border-b">
                    <td className="px-4 py-2">{review.name}</td>
                    <td className="px-4 py-2">{review.phone}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate">{review.comment}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        review.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.isApproved ? t.approved : t.pending}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        {!review.isApproved && (
                          <button
                            onClick={() => handleApprove(review._id)}
                            className="text-green-600 hover:text-green-800"
                            title={t.approve}
                          >
                            <FaCheck />
                          </button>
                        )}
                        {review.isApproved && (
                          <button
                            onClick={() => handleReject(review._id)}
                            className="text-yellow-600 hover:text-yellow-800"
                            title={t.reject}
                          >
                            <FaTimes />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="text-red-600 hover:text-red-800"
                          title={t.delete}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* عرض البطاقات للهواتف المحمولة */}
          <div className="md:hidden space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="space-y-3">
                  {/* معلومات المراجع */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{review.name}</h3>
                      <p className="text-sm text-gray-600">{review.phone}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.isApproved ? t.approved : t.pending}
                    </span>
                  </div>
                  
                  {/* التقييم */}
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-medium text-gray-700">{t.rating}:</span>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  {/* التعليق */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{t.comment}:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">{review.comment}</p>
                  </div>
                  
                  {/* أزرار الإجراءات - أصغر حجماً */}
                  <div className="flex space-x-2 rtl:space-x-reverse pt-2">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md flex items-center text-xs font-medium flex-1 justify-center"
                      >
                        <FaCheck className="ml-1 text-xs" />
                        {t.approve}
                      </button>
                    )}
                    {review.isApproved && (
                      <button
                        onClick={() => handleReject(review._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md flex items-center text-xs font-medium flex-1 justify-center"
                      >
                        <FaTimes className="ml-1 text-xs" />
                        {t.reject}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md flex items-center text-xs font-medium flex-1 justify-center"
                    >
                      <FaTrash className="ml-1 text-xs" />
                      {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}