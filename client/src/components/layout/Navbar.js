import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../auth/LoginModal';

// Custom User Icon SVG
const UserIcon = ({ className }) => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M16 5.33317C10.1089 5.33317 5.33329 10.1088 5.33329 15.9998C5.33329 21.8909 10.1089 26.6665 16 26.6665C21.891 26.6665 26.6666 21.8909 26.6666 15.9998C26.6666 10.1088 21.891 5.33317 16 5.33317ZM2.66663 15.9998C2.66663 8.63604 8.63616 2.6665 16 2.6665C23.3638 2.6665 29.3333 8.63604 29.3333 15.9998C29.3333 23.3636 23.3638 29.3332 16 29.3332C8.63616 29.3332 2.66663 23.3636 2.66663 15.9998Z" 
      fill="black"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M16 10.6667C14.5272 10.6667 13.3333 11.8606 13.3333 13.3333C13.3333 14.8061 14.5272 16 16 16C17.4727 16 18.6666 14.8061 18.6666 13.3333C18.6666 11.8606 17.4727 10.6667 16 10.6667ZM10.6666 13.3333C10.6666 10.3878 13.0544 8 16 8C18.9455 8 21.3333 10.3878 21.3333 13.3333C21.3333 16.2789 18.9455 18.6667 16 18.6667C13.0544 18.6667 10.6666 16.2789 10.6666 13.3333Z" 
      fill="black"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M11.2674 23.2783C10.3653 23.6502 9.8256 24.2056 9.46237 25.1467C9.19724 25.8337 8.42539 26.1757 7.73839 25.9106C7.0514 25.6454 6.70941 24.8736 6.97455 24.1866C7.59355 22.5827 8.65364 21.4714 10.2512 20.8129C11.7534 20.1936 13.6722 20 15.9998 20C18.3392 20 20.2689 20.1812 21.775 20.7938C23.3847 21.4487 24.4443 22.5677 25.0551 24.1993C25.3132 24.8889 24.9634 25.6572 24.2737 25.9154C23.5841 26.1735 22.8157 25.8237 22.5576 25.1341C22.199 24.176 21.666 23.6284 20.7702 23.2639C19.7707 22.8573 18.2817 22.6667 15.9998 22.6667C13.7457 22.6667 12.2649 22.8671 11.2674 23.2783Z" 
      fill="black"
    />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const activeLinkStyle = {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontWeight: '600',
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-[#E4E4E4] sticky top-0 z-[70]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between" style={{height: '54px'}}>
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold hover:text-blue-600 transition-colors duration-200" style={{color: '#000000'}}>
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
                      <button 
                        onClick={openLoginModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                      >
                        Zaloguj się
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile login button */}
            <div className="md:hidden">
              {user ? (
                <Link
                  to="/dashboard"
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-all duration-200"
                  aria-label="Panel użytkownika"
                >
                  <UserIcon className="h-8 w-8" />
                </Link>
              ) : (
                <button
                  onClick={openLoginModal}
                  type="button"
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-all duration-200"
                  aria-label="Zaloguj się"
                >
                  <UserIcon className="h-8 w-8" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

export default Navbar; 