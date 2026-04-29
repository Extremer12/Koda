import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

// Eagerly loaded (Main entry point)
import { StorePage } from './pages/StorePage';

// Lazy loaded pages
const EbookPage = React.lazy(() => import('./pages/EbookPage').then(module => ({ default: module.EbookPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const CallbackPage = React.lazy(() => import('./pages/CallbackPage').then(module => ({ default: module.CallbackPage })));
const RoleSelectionPage = React.lazy(() => import('./pages/RoleSelectionPage').then(module => ({ default: module.RoleSelectionPage })));
const CreatorDashboard = React.lazy(() => import('./pages/CreatorDashboard').then(module => ({ default: module.CreatorDashboard })));
const CreatorSettings = React.lazy(() => import('./pages/CreatorSettings').then(module => ({ default: module.CreatorSettings })));
const AffiliateDashboard = React.lazy(() => import('./pages/AffiliateDashboard').then(module => ({ default: module.AffiliateDashboard })));
const AffiliateSettings = React.lazy(() => import('./pages/AffiliateSettings').then(module => ({ default: module.AffiliateSettings })));
const SellersLandingPage = React.lazy(() => import('./pages/SellersLandingPage').then(module => ({ default: module.SellersLandingPage })));
const DownloadPage = React.lazy(() => import('./pages/DownloadPage').then(module => ({ default: module.DownloadPage })));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const TermsPage = React.lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

const PageLoader = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<StorePage />} />
            <Route path="/vender" element={<SellersLandingPage />} />
            <Route path="/ebook/:id" element={<EbookPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<CallbackPage />} />
            <Route path="/select-role" element={<RoleSelectionPage />} />
            <Route path="/dashboard/creator" element={<CreatorDashboard />} />
            <Route path="/dashboard/creator/settings" element={<CreatorSettings />} />
            <Route path="/dashboard/affiliate" element={<AffiliateDashboard />} />
            <Route path="/dashboard/affiliate/settings" element={<AffiliateSettings />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/terminos" element={<TermsPage />} />
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/download/:token" element={<DownloadPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Footer />
        <MobileBottomNav />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(45, 47, 44, 0.95)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '1rem 1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            },
            success: {
              iconTheme: {
                primary: '#7d10e7',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
