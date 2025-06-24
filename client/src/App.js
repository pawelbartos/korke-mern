import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import OTPLogin from './pages/auth/OTPLogin';
import OTPInfo from './pages/OTPInfo';
import OTPTest from './pages/OTPTest';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import TeacherProfile from './pages/TeacherProfile';
import Teachers from './pages/Teachers';
import Messages from './pages/Messages';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import TutoringAds from './pages/tutoring/TutoringAds';
import TutoringAdDetail from './pages/tutoring/TutoringAdDetail';
import CreateTutoringAd from './pages/tutoring/CreateTutoringAd';
import EditTutoringAd from './pages/tutoring/EditTutoringAd';
import Applications from './pages/tutoring/Applications';
import MyApplications from './pages/tutoring/MyApplications';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<TutoringAds />} />
                  <Route path="/otp-login" element={<OTPLogin />} />
                  <Route path="/otp-info" element={<OTPInfo />} />
                  <Route path="/otp-test" element={<OTPTest />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/teachers/:id" element={<TeacherProfile />} />
                  <Route path="/tutoring/:id" element={<TutoringAdDetail />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } />
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  } />
                  <Route path="/tutoring/create" element={
                    <ProtectedRoute>
                      <CreateTutoringAd />
                    </ProtectedRoute>
                  } />
                  <Route path="/tutoring/:id/edit" element={
                    <ProtectedRoute>
                      <EditTutoringAd />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications" element={
                    <ProtectedRoute>
                      <Applications />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-applications" element={
                    <ProtectedRoute>
                      <MyApplications />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
          <Toaster position="top-right" />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 