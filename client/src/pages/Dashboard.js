import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  StarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Moje ogłoszenia',
      value: '0',
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
      href: '/tutoring/my-ads'
    },
    {
      name: 'Aplikacje',
      value: '0',
      icon: UserGroupIcon,
      color: 'bg-green-500',
      href: '/applications'
    },
    {
      name: 'Wiadomości',
      value: '0',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-purple-500',
      href: '/messages'
    },
    {
      name: 'Ocena',
      value: user?.rating?.average || '0',
      icon: StarIcon,
      color: 'bg-yellow-500',
      href: '/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Witaj, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Oto przegląd Twojego konta i aktywności
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Teachers */}
            {user?.role === 'teacher' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="card"
              >
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Szybkie akcje dla nauczycieli
                  </h2>
                </div>
                <div className="card-body space-y-4">
                  <button className="btn-primary w-full flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Dodaj nowe ogłoszenie
                  </button>
                  <button className="btn-secondary w-full">
                    Zarządzaj ogłoszeniami
                  </button>
                  <button className="btn-secondary w-full">
                    Sprawdź aplikacje
                  </button>
                </div>
              </motion.div>
            )}

            {/* For Students */}
            {user?.role === 'student' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="card"
              >
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Szybkie akcje dla uczniów
                  </h2>
                </div>
                <div className="card-body space-y-4">
                  <button className="btn-primary w-full">
                    Znajdź korepetycje
                  </button>
                  <button className="btn-secondary w-full">
                    Moje aplikacje
                  </button>
                  <button className="btn-secondary w-full">
                    Historia korepetycji
                  </button>
                </div>
              </motion.div>
            )}

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card"
            >
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">
                  Ostatnia aktywność
                </h2>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span>Witamy w portalu korepetycji!</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span>Twoje konto zostało utworzone</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 