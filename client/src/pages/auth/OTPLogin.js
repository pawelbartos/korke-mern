import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ClockIcon, ArrowPathIcon, UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const OTPLogin = () => {
  const [step, setStep] = useState('email'); // 'email', 'register', or 'otp'
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [requiresRegistration, setRequiresRegistration] = useState(false);
  const { sendOTP, resendOTP, loginWithOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/tutoring';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const watchedOTP = watch('otp', '');

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async (data) => {
    setIsLoading(true);
    try {
      const response = await sendOTP(data);
      setEmail(data.email);
      setStep('otp');
      setCountdown(60); // 60 seconds countdown
      toast.success(response.message);
    } catch (error) {
      if (error.response?.data?.requiresRegistration) {
        setRequiresRegistration(true);
        setEmail(data.email);
        setStep('register');
      } else {
        toast.error(error.response?.data?.message || 'Błąd wysyłania kodu OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterAndSendOTP = async (data) => {
    setIsLoading(true);
    try {
      const response = await sendOTP({
        email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      });
      setStep('otp');
      setCountdown(60);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Błąd tworzenia konta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await resendOTP(email);
      setCountdown(60);
      toast.success('Nowy kod OTP został wysłany');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Błąd wysyłania kodu OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data) => {
    setIsLoading(true);
    try {
      const response = await loginWithOTP(email, data.otp);
      toast.success(response.message);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Błąd weryfikacji kodu OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setEmail('');
    setCountdown(0);
    setRequiresRegistration(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Email Step */}
        {step === 'email' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Logowanie przez kod OTP
              </h2>
              <p className="text-sm text-gray-600">
                Wprowadź swój adres email, aby otrzymać kod weryfikacyjny
              </p>
            </div>

            <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adres email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email jest wymagany',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Nieprawidłowy adres email',
                    },
                  })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="twoj@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Wyślij kod OTP'
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Registration Step */}
        {step === 'register' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Utwórz nowe konto
              </h2>
              <p className="text-sm text-gray-600">
                Konto z adresem {email} nie istnieje. Wypełnij dane, aby je utworzyć.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleRegisterAndSendOTP)} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Imię
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName', {
                    required: 'Imię jest wymagane',
                    minLength: {
                      value: 2,
                      message: 'Imię musi mieć co najmniej 2 znaki',
                    },
                  })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-500' : ''
                  }`}
                  placeholder="Jan"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwisko
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName', {
                    required: 'Nazwisko jest wymagane',
                    minLength: {
                      value: 2,
                      message: 'Nazwisko musi mieć co najmniej 2 znaki',
                    },
                  })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-500' : ''
                  }`}
                  placeholder="Kowalski"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Rola
                </label>
                <select
                  id="role"
                  {...register('role', {
                    required: 'Rola jest wymagana',
                  })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.role ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Wybierz rolę</option>
                  <option value="teacher">Nauczyciel</option>
                  <option value="student">Uczeń</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Utwórz konto i wyślij kod OTP'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleBackToEmail}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Zmień adres email
              </button>
            </div>
          </motion.div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Wprowadź kod OTP
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Kod został wysłany na adres:
              </p>
              <p className="text-sm font-medium text-gray-900">{email}</p>
            </div>

            <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Kod OTP (6 cyfr)
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength="6"
                  autoComplete="one-time-code"
                  {...register('otp', {
                    required: 'Kod OTP jest wymagany',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Kod OTP musi składać się z 6 cyfr',
                    },
                  })}
                  className={`w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.otp ? 'border-red-500' : ''
                  }`}
                  placeholder="000000"
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || watchedOTP.length !== 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Zaloguj się'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              {countdown > 0 ? (
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Możesz ponownie wysłać kod za {countdown}s
                </div>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Wyślij nowy kod OTP
                </button>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleBackToEmail}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Zmień adres email
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OTPLogin; 