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
import { AffiliateDashboard } from './pages/AffiliateDashboard';
import { DownloadPage } from './pages/DownloadPage';
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
          <Route path="/dashboard/affiliate" element={<AffiliateDashboard />} />
          <Route path="/download/:token" element={<DownloadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <SupportButton />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#18182a',
              color: '#f5f5f7',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              fontSize: '0.9rem',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
