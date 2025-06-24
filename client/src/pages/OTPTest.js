import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';

const OTPTest = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Sending OTP request for:', email);
      const response = await authAPI.sendOTP({ email });
      console.log('Send OTP response:', response);
      toast.success(response.message);
      setStep('otp');
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(error.response?.data?.message || 'Błąd wysyłania OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Verifying OTP:', { email, otp });
      const response = await authAPI.verifyOTP(email, otp);
      console.log('Verify OTP response:', response);
      toast.success(response.message);
      setStep('success');
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(error.response?.data?.message || 'Błąd weryfikacji OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Test OTP System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Testowanie systemu logowania OTP
          </p>
        </div>

        {step === 'email' && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="test@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Wysyłanie...' : 'Wyślij kod OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Kod OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="123456"
                maxLength="6"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Wstecz
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Weryfikacja...' : 'Zweryfikuj kod'}
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="mt-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sukces!</h3>
            <p className="mt-1 text-sm text-gray-500">
              Logowanie OTP zakończone pomyślnie.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setStep('email');
                  setEmail('');
                  setOtp('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Testuj ponownie
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Instrukcje:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Wprowadź email i kliknij "Wyślij kod OTP"</li>
            <li>2. Sprawdź konsolę serwera - kod pojawi się tam</li>
            <li>3. Skopiuj kod z konsoli i wprowadź go w formularzu</li>
            <li>4. Kliknij "Zweryfikuj kod"</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default OTPTest; 