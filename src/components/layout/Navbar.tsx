import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full glass-nav luminous-shadow">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4 lg:py-6 max-w-[1920px] mx-auto">
          {/* Branding */}
          <Link 
            to="/" 
            className="text-3xl font-black tracking-tighter text-primary hover:opacity-80 transition-opacity"
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
              Tienda
            </Link>
            
            <Link
              to="/vender"
              className={`${
                location.pathname === '/vender' 
                  ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant font-medium hover:text-primary'
              } transition-all duration-300`}
            >
              {profile?.role === 'creator' ? 'Mi Tienda' : 'Vender en KODA'}
            </Link>
            
            {profile?.role === 'creator' && (
              <Link
                to="/dashboard/creator"
                className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">storefront</span>
                Administrar mi Tienda
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
            <div className="flex items-center gap-2 lg:gap-4">

              {user ? (
                <>
                  {profile?.role === 'admin' && (
                    <Link 
                      to="/admin"
                      className="active:scale-95 transition-transform flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low text-error"
                      title="Panel Administrativo"
                    >
                      <span className="material-symbols-outlined">shield_person</span>
                    </Link>
                  )}
                  <Link 
                    to={profile?.role === 'creator' ? '/dashboard/creator' : '/dashboard/affiliate'}
                    className="active:scale-95 transition-transform flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low"
                    title="Panel de Control"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">dashboard</span>
                  </Link>
                  <Link 
                    to={profile?.role === 'creator' ? '/dashboard/creator/settings' : '/dashboard/affiliate/settings'}
                    className="active:scale-95 transition-transform flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low"
                    title="Configuración"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">settings</span>
                  </Link>
                  <button 
                    onClick={signOut}
                    className="active:scale-95 transition-transform flex items-center justify-center w-10 h-10 rounded-full hover:bg-error-container hover:text-on-error-container"
                    title="Cerrar Sesión"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-error-container">logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="hidden sm:block font-label text-[10px] uppercase tracking-widest font-bold text-on-surface hover:text-primary transition-colors">
                    Iniciar Sesión
                  </Link>
                  <Link to="/login">
                    <button className="bg-primary text-on-primary font-label text-[10px] uppercase tracking-widest font-bold px-6 py-3 hover:brightness-110 active:scale-95 transition-all">
                      Empezar
                    </button>
                  </Link>
                </div>
              )}
            </div>

        </div>
      </nav>
    </>
  );
}
