import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogIn, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);



  return (
    <nav className="navbar" role="navigation" aria-label="Navegación principal">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="Ir al inicio">
          <BookOpen size={28} style={{ color: 'var(--accent-secondary)' }} />
          <span className="navbar-brand-text text-gradient">Koda</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Explorar
          </Link>
          {profile?.role === 'creator' && (
            <Link
              to="/dashboard/creator"
              className={`navbar-link ${location.pathname.includes('/creator') ? 'active' : ''}`}
            >
              Mi Panel
            </Link>
          )}
          {(profile?.role === 'affiliate' || profile?.role === 'creator') && (
            <Link
              to="/dashboard/affiliate"
              className={`navbar-link ${location.pathname.includes('/affiliate') ? 'active' : ''}`}
            >
              Afiliados
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link
                to={profile?.role === 'creator' ? '/dashboard/creator' : '/dashboard/affiliate'}
                className="btn btn-ghost"
                aria-label="Ir al dashboard"
              >
                <LayoutDashboard size={18} />
                <span className="nav-desktop-only">{profile?.full_name?.split(' ')[0] || 'Dashboard'}</span>
              </Link>
              <button
                onClick={signOut}
                className="btn btn-ghost"
                aria-label="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <LogIn size={18} />
              <span>Ingresar</span>
            </Link>
          )}

          <button
            className="btn btn-icon btn-ghost mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú móvil"
            style={{ display: 'none' }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="mobile-nav-menu animate-slide-down"
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-glass)',
            padding: 'var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
          }}
        >
          <Link to="/" className="sidebar-link" onClick={() => setMobileOpen(false)}>
            Explorar
          </Link>
          {profile?.role === 'creator' && (
            <Link to="/dashboard/creator" className="sidebar-link" onClick={() => setMobileOpen(false)}>
              Mi Panel
            </Link>
          )}
          {profile && (
            <Link to="/dashboard/affiliate" className="sidebar-link" onClick={() => setMobileOpen(false)}>
              Afiliados
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .nav-desktop-only { display: none; }
        }
        @media (min-width: 769px) {
          .nav-desktop-only { display: inline; }
        }
      `}</style>
    </nav>
  );
}
