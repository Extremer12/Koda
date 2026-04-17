import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SupportButton } from './components/layout/SupportButton';
import { StorePage } from './pages/StorePage';
import { EbookPage } from './pages/EbookPage';
import { LoginPage } from './pages/LoginPage';
import { CallbackPage } from './pages/CallbackPage';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { CreatorSettings } from './pages/CreatorSettings';
import { AffiliateDashboard } from './pages/AffiliateDashboard';
import { AffiliateSettings } from './pages/AffiliateSettings';
import { DownloadPage } from './pages/DownloadPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/ebook/:id" element={<EbookPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<CallbackPage />} />
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
        <Footer />
        <SupportButton />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#2d2f2c',
              color: '#f7f7f2',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '0',
              fontSize: '0.8rem',
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
