import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mój profil</h1>
            <p className="text-gray-600 mt-2">
              Zarządzaj swoimi danymi osobowymi i ustawieniami
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Informacje osobowe
                  </h2>
                </div>
                <div className="card-body space-y-6">
                  <div className="flex items-center space-x-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-20 h-20 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="w-20 h-20 text-gray-400" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {user?.fullName}
                      </h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {user?.role === 'teacher' ? 'Nauczyciel' : 'Uczeń'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Imię
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{user?.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nazwisko
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{user?.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Telefon
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.phone || 'Nie podano'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      O mnie
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.bio || 'Brak opisu'}
                    </p>
                  </div>

                  <button className="btn-primary">
                    Edytuj profil
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Statystyki
                  </h3>
                </div>
                <div className="card-body space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ocena</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user?.rating?.average || '0'}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Liczba ocen</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user?.rating?.count || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Członek od</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Szybkie akcje
                  </h3>
                </div>
                <div className="card-body space-y-3">
                  <button className="btn-secondary w-full text-left">
                    Zmień hasło
                  </button>
                  <button className="btn-secondary w-full text-left">
                    Ustawienia powiadomień
                  </button>
                  <button className="btn-secondary w-full text-left">
                    Prywatność
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 