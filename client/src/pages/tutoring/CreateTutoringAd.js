import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { AcademicCapIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const CreateTutoringAd = () => {
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

  const createAdMutation = useMutation(
    (adData) => api.post('/tutoring', adData),
    {
      onSuccess: () => {
        toast.success('Ogłoszenie zostało utworzone pomyślnie!');
        navigate('/tutoring');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Błąd podczas tworzenia ogłoszenia');
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
      toast.error('Proszę wypełnić wszystkie wymagane pola');
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error('Proszę wprowadzić prawidłową cenę');
      return;
    }

    createAdMutation.mutate({
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/tutoring')}
              className="mr-3 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Utwórz ogłoszenie</h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Podstawowe informacje</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Tytuł ogłoszenia *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="np. Doświadczony korepetytor matematyki"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Przedmiot *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="np. Matematyka, Fizyka"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Opis *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Opisz swoje podejście do nauczania, doświadczenie i czego mogą oczekiwać uczniowie..."
                required
              />
            </div>

            {/* Pricing and Location */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cena i lokalizacja</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Cena za godzinę (zł) *
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="80"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Lokalizacja
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="np. Warszawa, Online"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
                Harmonogram
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="np. Dni robocze 18-20, weekendy 10-14"
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Wymagania dla uczniów
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="np. Uczniowie powinni mieć podstawową znajomość algebry, przynosić własne materiały..."
              />
            </div>

            {/* Experience and Education */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Doświadczenie i wykształcenie</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Doświadczenie w nauczaniu
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Opisz swoje doświadczenie w nauczaniu, lata praktyki, poprzednich uczniów..."
                  />
                </div>

                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                    Wykształcenie i certyfikaty
                  </label>
                  <textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Wymień swoje stopnie, certyfikaty, odpowiednie kursy..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/tutoring')}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={createAdMutation.isLoading}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createAdMutation.isLoading ? 'Tworzenie...' : 'Utwórz ogłoszenie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTutoringAd; 