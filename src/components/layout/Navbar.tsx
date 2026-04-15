import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full glass-nav luminous-shadow">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4 lg:py-6 max-w-[1920px] mx-auto">
          {/* Branding */}
          <Link 
            to="/" 
            className="text-3xl font-black tracking-tighter text-primary hover:opacity-80 transition-opacity"
            onClick={() => setMobileOpen(false)}
          >
            KODA
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-label tracking-tight text-sm">
            <Link
              to="/"
              className={`${
                location.pathname === '/' 
                  ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant font-medium hover:text-primary'
              } transition-all duration-300`}
            >
              Explorar
            </Link>
            
            {profile?.role === 'creator' && (
              <Link
                to="/dashboard/creator"
                className={`${
                  location.pathname.includes('/creator') 
                    ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                    : 'text-on-surface-variant font-medium hover:text-primary'
                } transition-all duration-300`}
              >
                Ediciones
              </Link>
            )}

            {(profile?.role === 'affiliate' || profile?.role === 'creator') && (
              <Link
                to="/dashboard/affiliate"
                className={`${
                  location.pathname.includes('/affiliate') 
                    ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                    : 'text-on-surface-variant font-medium hover:text-primary'
                } transition-all duration-300`}
              >
                Socios
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative hidden xl:block">
              <input 
                className="bg-surface-container-low border-none rounded-full py-2 pl-6 pr-12 w-64 focus:ring-2 focus:ring-primary text-sm transition-all focus:outline-none" 
                placeholder="Buscar historias..." 
                type="text"
                disabled
                title="Búsqueda global (Próximamente)"
              />
              <span className="material-symbols-outlined absolute right-4 top-2 text-outline-variant">search</span>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Fake Cart Icon for aesthetics as requested by design */}
              <button className="active:scale-95 transition-transform hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low" title="Tu Carrito (No aplica)">
                <span className="material-symbols-outlined text-on-surface-variant">shopping_cart</span>
              </button>

              {user ? (
                <>
                  <Link 
                    to={profile?.role === 'creator' ? '/dashboard/creator' : '/dashboard/affiliate'}
                    className="active:scale-95 transition-transform flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
                  </Link>
                  <button 
                    onClick={signOut}
                    className="active:scale-95 transition-transform hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-error-container hover:text-on-error-container"
                    title="Cerrar Sessión"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-error-container">logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <button className="active:scale-95 transition-transform flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary hover:text-white text-primary">
                    <span className="material-symbols-outlined">login</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="material-symbols-outlined text-2xl text-on-surface">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden fixed top-[72px] lg:top-[88px] left-0 w-full bg-white/95 backdrop-blur-xl border-b border-outline-variant/10 px-6 py-8 flex flex-col gap-6 font-label font-bold text-sm animate-slide-down z-40 shadow-xl">
          <Link to="/" onClick={() => setMobileOpen(false)} className="text-on-surface hover:text-primary">Explorar</Link>
          {profile?.role === 'creator' && (
            <Link to="/dashboard/creator" onClick={() => setMobileOpen(false)} className="text-on-surface hover:text-primary">Ediciones</Link>
          )}
          {profile && (
            <Link to="/dashboard/affiliate" onClick={() => setMobileOpen(false)} className="text-on-surface hover:text-primary">Socios</Link>
          )}
          {!user && (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-primary">Iniciar Sesión</Link>
          )}
          {user && (
            <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-left text-error">Cerrar Sesión</button>
          )}
        </div>
      )}
    </>
  );
}
