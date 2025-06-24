import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { tutoringAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckIcon, XMarkIcon, UserIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Applications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAd, setSelectedAd] = useState(null);

  // Fetch user's tutoring ads
  const { data: adsData, isLoading: adsLoading } = useQuery(
    ['myAds'],
    () => tutoringAPI.getAds({ teacher: user?._id }),
    {
      enabled: !!user,
    }
  );

  // Fetch applications for selected ad
  const { data: applicationsData, isLoading: applicationsLoading } = useQuery(
    ['applications', selectedAd],
    () => tutoringAPI.getApplications(selectedAd),
    {
      enabled: !!selectedAd,
    }
  );

  // Update application status mutation
  const updateApplicationMutation = useMutation(
    ({ adId, applicationId, status }) => tutoringAPI.updateApplication(adId, applicationId, { status }),
    {
      onSuccess: () => {
        toast.success('Status aplikacji został zaktualizowany');
        queryClient.invalidateQueries(['applications', selectedAd]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update application');
      },
    }
  );

  const handleStatusUpdate = (applicationId, status) => {
    updateApplicationMutation.mutate({ adId: selectedAd, applicationId, status });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Zaakceptowana';
      case 'rejected':
        return 'Odrzucona';
      default:
        return 'Oczekująca';
    }
  };

  if (!user || user.role !== 'teacher') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Brak dostępu</h1>
          <p className="text-gray-600">Ta strona jest dostępna tylko dla nauczycieli.</p>
        </div>
      </div>
    );
  }

  if (adsLoading) return <LoadingSpinner />;

  const ads = adsData?.ads || [];
  const applications = applicationsData?.applications || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Zarządzanie Aplikacjami</h1>
        <p className="text-gray-600">Przeglądaj i zarządzaj aplikacjami na Twoje ogłoszenia</p>
      </div>

      {ads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Brak ogłoszeń</h2>
          <p className="text-gray-600 mb-4">Nie masz jeszcze żadnych ogłoszeń o korepetycje.</p>
          <button
            onClick={() => window.location.href = '/tutoring/create'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Utwórz ogłoszenie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ads List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Twoje Ogłoszenia</h2>
              <div className="space-y-3">
                {ads.map((ad) => (
                  <button
                    key={ad._id}
                    onClick={() => setSelectedAd(ad._id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedAd === ad._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 mb-1">{ad.title}</h3>
                    <p className="text-sm text-gray-600">{ad.subject}</p>
                    <p className="text-sm text-gray-500">
                      {ad.applications?.length || 0} aplikacji
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {!selectedAd ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Wybierz ogłoszenie</h3>
                  <p className="text-gray-600">Wybierz ogłoszenie z listy, aby zobaczyć aplikacje</p>
                </div>
              ) : applicationsLoading ? (
                <LoadingSpinner />
              ) : (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Aplikacje</h2>
                  {applications.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Brak aplikacji dla tego ogłoszenia</p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <h4 className="font-semibold">
                                  {application.student.firstName} {application.student.lastName}
                                </h4>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                                  {getStatusText(application.status)}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(application.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-gray-700 mb-3">{application.message}</p>

                          {(application.preferredTime || application.preferredLocation) && (
                            <div className="space-y-1 mb-3">
                              {application.preferredTime && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  <span>Preferowany czas: {application.preferredTime}</span>
                                </div>
                              )}
                              {application.preferredLocation && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPinIcon className="h-4 w-4 mr-1" />
                                  <span>Preferowana lokalizacja: {application.preferredLocation}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {application.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(application._id, 'accepted')}
                                disabled={updateApplicationMutation.isLoading}
                                className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Akceptuj
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                disabled={updateApplicationMutation.isLoading}
                                className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                <XMarkIcon className="h-4 w-4 mr-1" />
                                Odrzuć
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications; 