import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function MobileBottomNav() {
  const { profile } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-outline-variant/10 px-4 pb-safe-offset-2 pt-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/') ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/') ? 'fill-1' : ''}`}>home</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Tienda</span>
        </Link>

        <Link 
          to="/vender" 
          className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/vender') ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/vender') ? 'fill-1' : ''}`}>campaign</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">{profile?.role === 'creator' ? 'Mi Tienda' : 'Vender'}</span>
        </Link>

        {profile && (
          <Link 
            to={profile.role === 'creator' ? "/dashboard/creator" : "/dashboard/affiliate"} 
            className={`flex flex-col items-center gap-1 p-2 transition-all ${location.pathname.startsWith('/dashboard') && !location.pathname.endsWith('/settings') ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${location.pathname.startsWith('/dashboard') && !location.pathname.endsWith('/settings') ? 'fill-1' : ''}`}>dashboard</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Panel</span>
          </Link>
        )}

        {profile && (
          <Link 
            to={profile.role === 'creator' ? "/dashboard/creator/settings" : "/dashboard/affiliate/settings"} 
            className={`flex flex-col items-center gap-1 p-2 transition-all ${location.pathname.endsWith('/settings') ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${location.pathname.endsWith('/settings') ? 'fill-1' : ''}`}>person</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Perfil</span>
          </Link>
        )}

        {!profile && (
          <Link 
            to="/login" 
            className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/login') ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isActive('/login') ? 'fill-1' : ''}`}>login</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Entrar</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
