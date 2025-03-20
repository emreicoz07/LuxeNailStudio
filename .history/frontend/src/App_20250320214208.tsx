import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home';
import ServicesPage from './pages/Services';
import GalleryPage from './pages/Gallery';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import BookingPage from './pages/Booking';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route 
                  path="/appointments" 
                  element={
                    <ProtectedRoute>
                      <BookingPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App; 