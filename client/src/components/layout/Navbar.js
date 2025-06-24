import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bars3Icon, XMarkIcon, UserIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, BookmarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkStyle = {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontWeight: '600',
  };

  const authLinks = user ? [
    { to: '/dashboard', text: 'Panel główny', icon: Cog6ToothIcon },
    { to: '/favorites', text: 'Moje zakładki', icon: BookmarkIcon },
    { to: '/profile', text: 'Profil', icon: UserIcon },
    { to: '/messages', text: 'Wiadomości', icon: ChatBubbleLeftRightIcon },
    ...(user.role === 'teacher' ? [{ to: '/applications', text: 'Aplikacje', icon: AcademicCapIcon }] : []),
    ...(user.role === 'student' ? [{ to: '/my-applications', text: 'Moje aplikacje', icon: AcademicCapIcon }] : []),
  ] : [
    { to: '/otp-login', text: 'Zaloguj się', icon: UserIcon },
    { to: '/otp-info', text: 'Jak to działa?', icon: InformationCircleIcon },
    { to: '/otp-test', text: 'Test OTP', icon: AcademicCapIcon },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };
   
  return (
    <>
      <nav className="bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-[54px] md:h-12">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold hover:text-blue-600 transition-colors duration-200" style={{color: '#333333'}}>
                korke
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <div className="ml-4">
                  {user ? (
                     <div className="flex items-center space-x-4">
                        <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-gray-900 hover:bg-amber-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">Panel główny</NavLink>
                        <button onClick={logout} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm">Wyloguj</button>
                     </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <NavLink to="/otp-login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm">Zaloguj się</NavLink>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Otwórz menu główne</span>
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu popup overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[100]">
          {/* Dark overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed right-0 top-0 h-full w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Menu content */}
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex-1 px-6 py-4">
                {/* Auth Links */}
                <div className="space-y-2 mb-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Konto</h3>
                  {authLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                      className="flex items-center px-4 py-4 text-lg font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-800 rounded-xl transition-all duration-200 group"
                    >
                      <link.icon className="mr-4 h-6 w-6 text-gray-500 group-hover:text-amber-600 transition-colors duration-200" />
                      {link.text}
                    </NavLink>
                  ))}
                  
                  {/* Logout button for logged in users */}
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-4 text-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-800 rounded-xl transition-all duration-200 group"
                    >
                      <svg className="mr-4 h-6 w-6 text-gray-500 group-hover:text-red-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Wyloguj się
                    </button>
                  )}
                </div>

                {/* User info for logged in users */}
                {user && (
                  <>
                    <div className="border-t border-gray-200 my-6"></div>
                    <div className="px-4 py-6 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900">Zalogowany użytkownik</p>
                          <p className="text-sm text-gray-500">Panel korepetytora</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 