import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { MapPinIcon, ClockIcon, AcademicCapIcon, CurrencyDollarIcon, BookmarkIcon, StarIcon, ChatBubbleLeftRightIcon, EyeIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { tutoringAPI, messageAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TutoringAdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isContacting, setIsContacting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [applicationData, setApplicationData] = useState({ 
    message: '', 
    preferredTime: '', 
    preferredLocation: '' 
  });

  // Fetch tutoring ad details
  const { data: ad, isLoading, error } = useQuery(
    ['tutoringAd', id],
    () => tutoringAPI.getAd(id),
    {
      enabled: !!id,
    }
  );

  // Fetch reviews for this ad
  const { data: reviewsData } = useQuery(
    ['reviews', id],
    () => tutoringAPI.getReviews(id),
    {
      enabled: !!id,
    }
  );

  // Fetch applications (for teachers only)
  const { data: applicationsData } = useQuery(
    ['applications', id],
    () => tutoringAPI.getApplications(id),
    {
      enabled: !!user && user.role === 'teacher' && !!id,
    }
  );

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation(
    () => tutoringAPI.toggleFavorite(id),
    {
      onSuccess: (data) => {
        setIsFavorite(data.isFavorite);
        toast.success(data.message);
        queryClient.invalidateQueries(['userFavorites']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update favorite');
      },
    }
  );

  // Contact teacher mutation
  const contactMutation = useMutation(
    (messageData) => messageAPI.sendMessage(messageData),
    {
      onSuccess: () => {
        toast.success('Message sent successfully!');
        setIsContacting(false);
        navigate('/messages');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to send message');
        setIsContacting(false);
      },
    }
  );

  // Delete ad mutation (for teacher)
  const deleteMutation = useMutation(
    () => tutoringAPI.deleteAd(id),
    {
      onSuccess: () => {
        toast.success('Ad deleted successfully!');
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete ad');
      },
    }
  );

  // Create review mutation
  const createReviewMutation = useMutation(
    (reviewData) => tutoringAPI.createReview(id, reviewData),
    {
      onSuccess: () => {
        toast.success('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: '' });
        queryClient.invalidateQueries(['reviews', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit review');
      },
    }
  );

  // Apply for ad mutation
  const applyMutation = useMutation(
    (applicationData) => tutoringAPI.applyForAd(id, applicationData),
    {
      onSuccess: () => {
        toast.success('Application submitted successfully!');
        setShowApplicationForm(false);
        setApplicationData({ message: '', preferredTime: '', preferredLocation: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit application');
      },
    }
  );

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsContacting(true);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      deleteMutation.mutate();
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    createReviewMutation.mutate(reviewData);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    applyMutation.mutate(applicationData);
  };

  const calculateAverageRating = () => {
    if (!reviewsData?.reviews || reviewsData.reviews.length === 0) return 0;
    const total = reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviewsData.reviews.length).toFixed(1);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !ad) return <div className="text-center text-gray-600 py-12">Ogłoszenie nie zostało znalezione.</div>;

  const reviews = reviewsData?.reviews || [];
  const applications = applicationsData?.applications || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{ad.title}</h1>
            <p className="text-gray-600 text-lg">{ad.subject}</p>
          </div>
          <div className="flex space-x-2">
            {user && user._id !== ad.teacher._id && (
              <button
                onClick={handleToggleFavorite}
                disabled={toggleFavoriteMutation.isLoading}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isFavorite ? 'Usuń z zakładek' : 'Dodaj do zakładek'}
              >
                {isFavorite ? (
                  <BookmarkIconSolid className="h-6 w-6" />
                ) : (
                  <BookmarkIcon className="h-6 w-6" />
                )}
              </button>
            )}
            {user && user._id === ad.teacher._id && (
              <>
                <button
                  onClick={() => navigate(`/tutoring/${id}/edit`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edytuj
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Usuń
                </button>
              </>
            )}
          </div>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-2xl font-bold text-green-600">
                {ad.price.amount} {ad.price.currency}/{ad.price.perHour ? 'godzinę' : 'sesję'}
              </span>
            </div>
            <div className="flex items-center">
              <StarIconSolid className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="text-lg font-semibold">{calculateAverageRating()}</span>
              <span className="text-gray-500 ml-1">({reviews.length} recenzji)</span>
            </div>
            <div className="flex items-center">
              <EyeIcon className="h-5 w-5 text-gray-400 mr-1" />
              <span className="text-gray-500">{ad.views} wyświetleń</span>
            </div>
          </div>
        </div>

        {/* Location and Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">
              {ad.location.type === 'online' ? 'Online' : `${ad.location.type} - ${ad.location.city}`}
            </span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Poziom: {ad.level}</span>
          </div>
        </div>
      </div>

      {/* Teacher Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">O Nauczycielu</h2>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <AcademicCapIcon className="h-8 w-8 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{ad.teacher.firstName} {ad.teacher.lastName}</h3>
            <p className="text-gray-600 mb-2">{ad.teacher.bio}</p>
            <div className="flex items-center mb-2">
              <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{ad.teacher.rating.average}</span>
              <span className="text-gray-500 ml-1">({ad.teacher.rating.count} ocen)</span>
            </div>
            <p className="text-gray-700">{ad.description}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {user && user._id !== ad.teacher._id && user?.role === 'student' && (
            <button
              onClick={() => setShowApplicationForm(true)}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
              Złóż aplikację
            </button>
          )}
          {user && user._id !== ad.teacher._id && (
            <button
              onClick={handleContact}
              disabled={isContacting}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isContacting ? 'Wysyłanie...' : 'Skontaktuj się'}
            </button>
          )}
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zaloguj się, aby aplikować
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recenzje ({reviews.length})</h2>
          {user && user.role === 'student' && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Dodaj recenzję
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Brak recenzji</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-semibold">{review.student.firstName} {review.student.lastName}</span>
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
        )}
      </div>

      {/* Applications Section (for teachers only) */}
      {user && user.role === 'teacher' && user._id === ad.teacher._id && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Aplikacje ({applications.length})</h2>
          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Brak aplikacji</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{application.student.firstName} {application.student.lastName}</h4>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status === 'accepted' ? 'Zaakceptowana' :
                         application.status === 'rejected' ? 'Odrzucona' : 'Oczekująca'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{application.message}</p>
                  {application.preferredTime && (
                    <p className="text-sm text-gray-600">Preferowany czas: {application.preferredTime}</p>
                  )}
                  {application.preferredLocation && (
                    <p className="text-sm text-gray-600">Preferowana lokalizacja: {application.preferredLocation}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Dodaj recenzję</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ocena</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none"
                    >
                      <StarIconSolid
                        className={`h-6 w-6 ${
                          star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Komentarz</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={createReviewMutation.isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createReviewMutation.isLoading ? 'Wysyłanie...' : 'Wyślij'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Złóż aplikację</h3>
            <form onSubmit={handleSubmitApplication}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Wiadomość</label>
                <textarea
                  value={applicationData.message}
                  onChange={(e) => setApplicationData({ ...applicationData, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Napisz dlaczego chcesz wziąć udział w korepetycjach..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferowany czas</label>
                <input
                  type="text"
                  value={applicationData.preferredTime}
                  onChange={(e) => setApplicationData({ ...applicationData, preferredTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="np. Wtorki i czwartki 18:00"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferowana lokalizacja</label>
                <input
                  type="text"
                  value={applicationData.preferredLocation}
                  onChange={(e) => setApplicationData({ ...applicationData, preferredLocation: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="np. Online lub konkretny adres"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={applyMutation.isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {applyMutation.isLoading ? 'Wysyłanie...' : 'Wyślij aplikację'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutoringAdDetail; 