import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PortfolioNav from './components/portfolio/PortfolioNav';
import PortfolioFooter from './components/portfolio/PortfolioFooter';
import FloatingStars from './components/portfolio/FloatingStars';
import PortfolioScrollPage from './pages/portfolio/PortfolioScrollPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import CommunityPage from './pages/CommunityPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import FAQPage from './pages/FAQPage';
import DsyncLandingPage from './pages/DsyncLandingPage';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

function AppContent() {
  const location = useLocation();
  const isDsync = location.pathname === '/dsync';

  if (isDsync) {
    return <DsyncLandingPage />;
  }

  return (
    <div className="min-h-screen bg-space relative">
      <FloatingStars />
      <div className="relative z-10">
        <PortfolioNav />
        <Routes>
          <Route path="/" element={<PortfolioScrollPage />} />
          <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        <PortfolioFooter />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/dsync" element={<DsyncLandingPage />} />
          <Route path="*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;