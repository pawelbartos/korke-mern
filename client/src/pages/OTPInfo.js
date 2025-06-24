import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, InformationCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const OTPInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nowy System Logowania OTP
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Wprowadziliśmy nowy, bezpieczniejszy system logowania bez potrzeby konfiguracji email
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Darmowe i Proste</h3>
            </div>
            <p className="text-gray-600">
              Nie potrzebujesz konfiguracji Gmail ani płatnych usług email. 
              System działa lokalnie i jest całkowicie darmowy.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Bezpieczne</h3>
            </div>
            <p className="text-gray-600">
              Kody OTP są generowane kryptograficznie i wygasają po 10 minutach. 
              Maksymalnie 3 próby na kod.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <InformationCircleIcon className="h-8 w-8 text-purple-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Jak to działa?</h3>
            </div>
            <p className="text-gray-600">
              Wprowadź swój email, a kod OTP pojawi się w konsoli serwera. 
              Skopiuj kod i wprowadź go w aplikacji.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Automatyczna Rejestracja</h3>
            </div>
            <p className="text-gray-600">
              Jeśli to Twoje pierwsze logowanie, konto zostanie utworzone automatycznie 
              po podaniu imienia, nazwiska i roli.
            </p>
          </div>
        </div>

        {/* How to use */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Jak się zalogować?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Przejdź do logowania</h3>
                <p className="text-gray-600">Kliknij "Zaloguj się" w nawigacji</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Wprowadź email</h3>
                <p className="text-gray-600">Podaj swój adres email i kliknij "Wyślij kod"</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sprawdź konsolę serwera</h3>
                <p className="text-gray-600">
                  Kod OTP pojawi się w terminalu/konsole serwera w formacie:
                  <br />
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    OTP for your@email.com: 123456
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Wprowadź kod</h3>
                <p className="text-gray-600">Skopiuj kod z konsoli i wprowadź go w aplikacji</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link
            to="/otp-login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            Przejdź do logowania
          </Link>
          
          <div>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Wróć do strony głównej
            </Link>
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <InformationCircleIcon className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Ważna informacja
              </h3>
              <p className="text-yellow-700">
                Ten system jest przeznaczony do rozwoju i testowania. W produkcji zalecamy 
                użycie prawdziwego systemu email lub SMS. Możesz łatwo przełączyć się na 
                Resend.com (darmowe 3000 emaili/miesiąc) lub inne usługi email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPInfo; 