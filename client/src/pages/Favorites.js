import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Favorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's favorite ads
  const { data: favoritesData, isLoading, error } = useQuery(
    ['userFavorites'],
    () => api.get('/tutoring/favorites').then(res => res.data),
    {
      enabled: !!user,
    }
  );

  // Remove from favorites mutation
  const removeFavoriteMutation = useMutation(
    (adId) => api.post(`/tutoring/${adId}/favorite`),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        // Invalidate favorites query to refresh the list
        queryClient.invalidateQueries(['userFavorites']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to remove from favorites');
      },
    }
  );

  const handleRemoveFavorite = (adId, e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavoriteMutation.mutate(adId);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Moje zakładki</h1>
          <p className="text-gray-600 mb-4">Zaloguj się, aby zobaczyć swoje zakładki</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zaloguj się
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600">Błąd podczas ładowania zakładek</div>;

  const favorites = favoritesData?.ads || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Moje zakładki</h1>
        <p className="text-gray-600">
          {favorites.length === 0 
            ? 'Nie masz jeszcze żadnych zakładek' 
            : `Masz ${favorites.length} zakładek`
          }
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Brak zakładek</h2>
          <p className="text-gray-600 mb-6">Przeglądaj ogłoszenia i dodawaj je do zakładek</p>
          <Link
            to="/tutoring"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Przeglądaj ogłoszenia
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Ad Image */}
              <div className="relative h-48 bg-gray-200">
                {ad.images && ad.images.length > 0 ? (
                  <img
                    src={ad.images[0].url}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Brak zdjęcia</span>
                  </div>
                )}
                
                {/* Favorite Button */}
                <button
                  onClick={(e) => handleRemoveFavorite(ad._id, e)}
                  disabled={removeFavoriteMutation.isLoading}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors"
                  title="Usuń z zakładek"
                >
                  <BookmarkIconSolid className="h-5 w-5 text-blue-500" />
                </button>
              </div>

              {/* Ad Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  <Link
                    to={`/tutoring/${ad._id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {ad.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-3">{ad.subject}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {ad.location?.city || ad.location?.type || 'Nie określono'}
                    </span>
                  </div>
                  <div className="flex items-center text-green-600 font-semibold">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    <span>{ad.price?.amount || ad.price} zł/h</span>
                  </div>
                </div>

                {/* Teacher Info */}
                {ad.teacher && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      {ad.teacher.avatar ? (
                        <img
                          src={ad.teacher.avatar}
                          alt={ad.teacher.firstName}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                          <span className="text-xs text-gray-600">
                            {ad.teacher.firstName?.[0]}{ad.teacher.lastName?.[0]}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-700">
                        {ad.teacher.firstName} {ad.teacher.lastName}
                      </span>
                    </div>
                    
                    {ad.teacher.rating && (
                      <div className="flex items-center">
                        <span className="text-sm text-yellow-600 font-semibold">
                          ★ {ad.teacher.rating.average?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* View Details Button */}
                <Link
                  to={`/tutoring/${ad._id}`}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                >
                  Zobacz szczegóły
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 