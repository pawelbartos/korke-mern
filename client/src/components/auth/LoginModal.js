import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ClockIcon, ArrowPathIcon, UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import banner from '../../assets/banner.jpg';

const LoginModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('email'); // 'email', 'register', or 'otp'
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [requiresRegistration, setRequiresRegistration] = useState(false);
  const { sendOTP, resendOTP, loginWithOTP } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const watchedOTP = watch('otp', '');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('email');
      setEmail('');
      setCountdown(0);
      setRequiresRegistration(false);
      reset();
    }
  }, [isOpen, reset]);

  // Block scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      // Safari iOS specific
      document.body.style.webkitOverflowScrolling = 'touch';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.position = 'fixed';
      document.documentElement.style.width = '100%';
      document.documentElement.style.height = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.webkitOverflowScrolling = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.webkitOverflowScrolling = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

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
      onClose(); // Close modal after successful login
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

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
            style={{
              touchAction: 'none',
              overscrollBehavior: 'none'
            }}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-4 pointer-events-none"
          >
            <div 
              className="bg-white rounded-none md:rounded-lg shadow-none md:shadow-xl w-full h-full md:max-w-md md:h-auto md:max-h-[90vh] overflow-y-auto pointer-events-auto"
              style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                overscrollBehavior: 'contain'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - USUNIĘTY */}

              {/* Banner animowany tylko na mobile - PRZENIESIONY NAD PADDING */}
              <div className="relative w-full h-[55%] overflow-hidden md:hidden">
                {/* Nowy X w białym okręgu w prawym górnym rogu */}
                <button
                  onClick={handleClose}
                  aria-label="Zamknij"
                  className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md focus:outline-none"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                >
                  {/* Custom SVG X icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 18L18 6" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <img 
                    src={banner} 
                    alt="Banner" 
                    className="absolute top-0 left-0 w-full h-full object-cover animate-banner-scroll" 
                  />
                  <img 
                    src={banner} 
                    alt="Banner" 
                    className="absolute top-0 left-full w-full h-full object-cover animate-banner-scroll" 
                    style={{ animationDelay: '-5s' }}
                  />
                </div>
              </div>

              <div className="p-6">
                {/* Email Step */}
                {step === 'email' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-6">
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600">
                        Konto z adresem <span className="font-medium">{email}</span> nie istnieje. Wypełnij dane, aby je utworzyć.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(handleRegisterAndSendOTP)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                          <option value="student">Student</option>
                          <option value="teacher">Nauczyciel</option>
                        </select>
                        {errors.role && (
                          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handleBackToEmail}
                          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Wstecz
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isLoading ? (
                            <div className="loading-spinner"></div>
                          ) : (
                            'Utwórz konto'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* OTP Step */}
                {step === 'otp' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600">
                        Kod weryfikacyjny został wysłany na adres <span className="font-medium">{email}</span>
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-4">
                      <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                          Kod OTP
                        </label>
                        <input
                          id="otp"
                          type="text"
                          autoComplete="one-time-code"
                          maxLength="6"
                          {...register('otp', {
                            required: 'Kod OTP jest wymagany',
                            pattern: {
                              value: /^[0-9]{6}$/,
                              message: 'Kod OTP musi składać się z 6 cyfr',
                            },
                          })}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono ${
                            errors.otp ? 'border-red-500' : ''
                          }`}
                          placeholder="000000"
                        />
                        {errors.otp && (
                          <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>Kod ważny przez: {countdown}s</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={countdown > 0 || isLoading}
                          className="flex items-center text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowPathIcon className="h-4 w-4 mr-1" />
                          Wyślij ponownie
                        </button>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handleBackToEmail}
                          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Wstecz
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading || watchedOTP.length !== 6}
                          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isLoading ? (
                            <div className="loading-spinner"></div>
                          ) : (
                            'Zaloguj się'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal; 