import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { MapPinIcon, AcademicCapIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Fetch all teachers with their ads
  const { data: teachers, isLoading, error } = useQuery(
    'teachers',
    () => api.get('/users/teachers').then(res => res.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch reviews for all teachers
  const { data: reviews } = useQuery(
    'allReviews',
    () => api.get('/reviews').then(res => res.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const calculateAverageRating = (teacherId) => {
    if (!reviews) return 0;
    const teacherReviews = reviews.filter(review => review.teacher === teacherId);
    if (teacherReviews.length === 0) return 0;
    const total = teacherReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / teacherReviews.length).toFixed(1);
  };

  const getReviewCount = (teacherId) => {
    if (!reviews) return 0;
    return reviews.filter(review => review.teacher === teacherId).length;
  };

  const filteredTeachers = teachers?.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = !subjectFilter || 
                          teacher.tutoringAds?.some(ad => 
                            ad.subject.toLowerCase().includes(subjectFilter.toLowerCase())
                          );
    
    const matchesPrice = !priceRange || 
                        teacher.tutoringAds?.some(ad => {
                          const price = parseFloat(ad.price);
                          switch (priceRange) {
                            case '0-20': return price <= 20;
                            case '20-40': return price > 20 && price <= 40;
                            case '40-60': return price > 40 && price <= 60;
                            case '60+': return price > 60;
                            default: return true;
                          }
                        });

    return matchesSearch && matchesSubject && matchesPrice;
  }) || [];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600">Error loading teachers</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Tutor</h1>
        <p className="text-lg text-gray-600">Browse through our qualified teachers and find the right match for your learning needs</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Teachers
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name or email..."
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filter by subject..."
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              id="price"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Prices</option>
              <option value="0-20">$0 - $20/hour</option>
              <option value="20-40">$20 - $40/hour</option>
              <option value="40-60">$40 - $60/hour</option>
              <option value="60+">$60+/hour</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSubjectFilter('');
                setPriceRange('');
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Found {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-12">
          <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div key={teacher._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Teacher Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <StarIconSolid className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">
                        {calculateAverageRating(teacher._id)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      ({getReviewCount(teacher._id)} reviews)
                    </p>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="space-y-2 mb-4">
                  {teacher.phone && (
                    <p className="text-sm text-gray-600">📞 {teacher.phone}</p>
                  )}
                  {teacher.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {teacher.location}
                    </div>
                  )}
                </div>

                {/* Tutoring Ads */}
                {teacher.tutoringAds && teacher.tutoringAds.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Subjects Offered:</h4>
                    <div className="space-y-2">
                      {teacher.tutoringAds.slice(0, 3).map((ad) => (
                        <div key={ad._id} className="bg-gray-50 rounded p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">{ad.subject}</h5>
                              <p className="text-xs text-gray-600 line-clamp-2">{ad.description}</p>
                            </div>
                            <div className="flex items-center text-sm font-semibold text-green-600">
                              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                              {ad.price}/hr
                            </div>
                          </div>
                        </div>
                      ))}
                      {teacher.tutoringAds.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{teacher.tutoringAds.length - 3} more subjects
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    to={`/teachers/${teacher._id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/chat/${teacher._id}`}
                    className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teachers; 