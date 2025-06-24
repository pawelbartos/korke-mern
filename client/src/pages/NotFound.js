import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-4xl font-bold">404</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Strona nie została znaleziona
        </h1>
        
        <p className="text-gray-600 mb-8">
          Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary inline-flex items-center"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Wróć do strony głównej
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Wróć do poprzedniej strony
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound; 