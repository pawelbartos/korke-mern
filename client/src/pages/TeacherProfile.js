import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { MapPinIcon, ClockIcon, AcademicCapIcon, CurrencyDollarIcon, PhoneIcon, EnvelopeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  // Fetch teacher details
  const { data: teacher, isLoading, error } = useQuery(
    ['teacher', id],
    () => api.get(`/users/${id}`).then(res => res.data),
    {
      enabled: !!id,
    }
  );

  // Fetch teacher reviews
  const { data: reviews, refetch: refetchReviews } = useQuery(
    ['reviews', id],
    () => api.get(`/reviews/teacher/${id}`).then(res => res.data),
    {
      enabled: !!id,
    }
  );

  // Submit review mutation
  const submitReviewMutation = useMutation(
    (reviewData) => api.post('/reviews', reviewData),
    {
      onSuccess: () => {
        toast.success('Review submitted successfully!');
        setRating(5);
        setReview('');
        refetchReviews();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit review');
      },
    }
  );

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!review.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    submitReviewMutation.mutate({
      teacher: id,
      rating,
      comment: review
    });
  };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/chat/${id}`);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600">Error loading teacher profile</div>;
  if (!teacher) return <div className="text-center">Teacher not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Teacher Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex items-start space-x-4 mb-4 md:mb-0">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <AcademicCapIcon className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{teacher.name}</h1>
              <p className="text-gray-600 mb-2">{teacher.email}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <StarIconSolid className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-lg font-semibold">{calculateAverageRating()}</span>
                  <span className="text-gray-500 ml-1">({reviews?.length || 0} reviews)</span>
                </div>
                {teacher.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {teacher.location}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {user && user._id !== teacher._id && (
            <button
              onClick={handleContact}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
              Contact Teacher
            </button>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teacher.phone && (
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">{teacher.phone}</span>
            </div>
          )}
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">{teacher.email}</span>
          </div>
        </div>
      </div>

      {/* Tutoring Ads */}
      {teacher.tutoringAds && teacher.tutoringAds.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Subjects & Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacher.tutoringAds.map((ad) => (
              <div key={ad._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{ad.subject}</h3>
                  <div className="flex items-center text-green-600 font-semibold">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    {ad.price}/hour
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{ad.description}</p>
                <div className="space-y-1 text-sm text-gray-500">
                  {ad.location && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {ad.location}
                    </div>
                  )}
                  {ad.schedule && (
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {ad.schedule}
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <Link
                    to={`/tutoring/${ad._id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        
        {/* Submit Review Form */}
        {user && user._id !== teacher._id && (
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-3">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <StarIconSolid
                        className={`h-6 w-6 ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience with this teacher..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitReviewMutation.isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-semibold">{review.student.name}</span>
                    <div className="flex items-center ml-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this teacher!</p>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile; 