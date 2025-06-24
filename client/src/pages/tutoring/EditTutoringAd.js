import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { AcademicCapIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditTutoringAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    price: '',
    location: '',
    schedule: '',
    requirements: '',
    experience: '',
    education: ''
  });

  // Fetch existing ad data
  const { data: ad, isLoading, error } = useQuery(
    ['tutoringAd', id],
    () => api.get(`/tutoring/${id}`).then(res => res.data),
    {
      enabled: !!id,
      onSuccess: (data) => {
        setFormData({
          title: data.title || '',
          subject: data.subject || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          location: data.location || '',
          schedule: data.schedule || '',
          requirements: data.requirements || '',
          experience: data.experience || '',
          education: data.education || ''
        });
      }
    }
  );

  const updateAdMutation = useMutation(
    (adData) => api.put(`/tutoring/${id}`, adData),
    {
      onSuccess: () => {
        toast.success('Tutoring ad updated successfully!');
        navigate(`/tutoring/${id}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update ad');
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.subject || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    updateAdMutation.mutate({
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600">Error loading ad details</div>;
  if (!ad) return <div className="text-center">Ad not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Tutoring Ad</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Experienced Math Tutor"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mathematics, Physics"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your teaching approach, experience, and what students can expect..."
              required
            />
          </div>

          {/* Pricing and Location */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Hour ($) *
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Downtown, Online"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
              Schedule
            </label>
            <div className="relative">
              <ClockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Weekdays 6-8 PM, Weekends 10 AM-2 PM"
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
              Student Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Students should have basic algebra knowledge, bring their own materials..."
            />
          </div>

          {/* Experience and Education */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience & Education</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Teaching Experience
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your teaching experience, years of experience, previous students..."
                />
              </div>

              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                  Education & Certifications
                </label>
                <textarea
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List your degrees, certifications, relevant coursework..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/tutoring/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateAdMutation.isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {updateAdMutation.isLoading ? 'Updating...' : 'Update Ad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTutoringAd; 