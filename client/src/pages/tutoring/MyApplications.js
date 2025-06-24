import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { tutoringAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ClockIcon, CheckIcon, XMarkIcon, UserIcon, CalendarIcon, MapPinIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const { user } = useAuth();

  // Fetch user's applications
  const { data: applicationsData, isLoading } = useQuery(
    ['myApplications'],
    () => tutoringAPI.getMyApplications(),
    {
      enabled: !!user && user.role === 'student',
    }
  );

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckIcon className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XMarkIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
    }
  };

  if (!user || user.role !== 'student') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Brak dostępu</h1>
          <p className="text-gray-600">Ta strona jest dostępna tylko dla studentów.</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  const applications = applicationsData?.applications || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Moje Aplikacje</h1>
        <p className="text-gray-600">Przeglądaj status swoich aplikacji na korepetycje</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Brak aplikacji</h2>
          <p className="text-gray-600 mb-4">Nie złożyłeś jeszcze żadnych aplikacji na korepetycje.</p>
          <Link
            to="/tutoring"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Przeglądaj ogłoszenia
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.ad.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <span className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{application.ad.subject}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span>{application.ad.teacher.firstName} {application.ad.teacher.lastName}</span>
                  </div>
                </div>
                <Link
                  to={`/tutoring/${application.ad._id}`}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Zobacz ogłoszenie</span>
                </Link>
              </div>

              <div className="border-t border-gray-200 pt-4">
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

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Złożona: {new Date(application.createdAt).toLocaleDateString()}</span>
                  {application.updatedAt && application.updatedAt !== application.createdAt && (
                    <span>Zaktualizowana: {new Date(application.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications; 