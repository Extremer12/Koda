import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function CreatorSettings() {
  const { user, profile, loading: authLoading } = useAuth();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
  });

  useEffect(() => {
    // Revisar si venimos de un redirect de Mercado Pago
    const params = new URLSearchParams(location.search);
    if (params.get('mp_success') === 'true') {
      toast.success('¡Cuenta de Mercado Pago vinculada exitosamente!');
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('mp_error') === 'true') {
      toast.error('Error al vincular Mercado Pago. Intenta nuevamente.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const mpClientId = import.meta.env.VITE_MP_CLIENT_ID || 'APP_USR-ACA_VA_TU_CLIENT_ID';
  const mpRedirectUri = import.meta.env.VITE_MP_REDIRECT_URI || 'https://izbjowtoxuilkjrgguxw.supabase.co/functions/v1/mp-oauth';
  const mpOAuthUrl = `https://auth.mercadopago.com/authorization?client_id=${mpClientId}&response_type=code&platform_id=mp&state=${profile?.id}|creator&redirect_uri=${mpRedirectUri}`;

  if (authLoading) {
    return (
      <main className="bg-surface min-h-screen flex items-center justify-center">
        <div className="h-12 w-[1px] bg-primary animate-curatorial-pulse"></div>
      </main>
    );
  }

  if (!user || profile?.role !== 'creator') return <Navigate to="/login" replace />;

  return (
    <main className="bg-surface min-h-screen pt-24 md:pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/dashboard/creator" 
          className="inline-flex items-center gap-2 font-label text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors mb-12"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Panel
        </Link>

        <header className="mb-16 animate-slide-up">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-4 block">Configuración</span>
          <h1 className="font-headline font-black text-4xl md:text-5xl text-on-surface uppercase tracking-tight">Preferencias de Creador</h1>
        </header>

        {/* Mercado Pago Integration */}
        <section className="bg-white p-8 md:p-12 border border-[#f1f1ec] shadow-[0_40px_80px_-20px_rgba(45,47,44,0.1)] mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start gap-6 mb-8">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${profile?.mercadopago_access_token ? 'bg-[#009EE3]/10 text-[#009EE3]' : 'bg-surface-container-low text-on-surface-variant'}`}>
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mb-2">Integración de Cobros</h3>
              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60 leading-relaxed max-w-lg">
                Conecta tu cuenta de Mercado Pago para recibir el dinero de tus ventas de forma automática. KODA utiliza el sistema de Split Payments para asegurar la distribución inmediata.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-outline-variant/10">
            {profile?.mercadopago_access_token ? (
              <div className="bg-[#009EE3]/10 border border-[#009EE3]/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#009EE3] rounded-full flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <span className="block font-headline font-bold text-lg text-on-surface">Cuenta Vinculada</span>
                    <span className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
                      ID: {profile.mercadopago_user_id || 'Activa'}
                    </span>
                  </div>
                </div>
                <a href="https://www.mercadopago.com" target="_blank" rel="noreferrer" className="text-[#009EE3] text-sm font-bold hover:underline">
                  Ir a Mercado Pago
                </a>
              </div>
            ) : (
              <div className="bg-surface-container-low p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-outline-variant/10">
                <div>
                  <span className="block font-headline font-bold text-lg text-on-surface mb-1">Vincular cuenta</span>
                  <span className="block text-sm text-on-surface-variant opacity-80 max-w-sm">
                    Conecta tu cuenta para recibir el dinero de tus ventas automáticamente sin retenciones.
                  </span>
                </div>
                <a 
                  href={mpOAuthUrl}
                  className="whitespace-nowrap bg-[#009EE3] text-white font-label text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition-all hover:brightness-110 active:scale-95"
                >
                  Conectar Mercado Pago
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Profile Settings */}
        <section className="bg-white p-8 md:p-12 border border-[#f1f1ec] animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mb-8">Datos Públicos</h3>
          
          <form className="space-y-8" onSubmit={e => e.preventDefault()}>
            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Nombre de Creador / Marca</label>
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors" 
                defaultValue={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Email de Contacto</label>
              <input 
                type="email" 
                className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors opacity-50 cursor-not-allowed" 
                value={profile.email}
                disabled
              />
              <p className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant opacity-40 mt-2">El email no puede modificarse por seguridad.</p>
            </div>

            <button 
              type="submit" 
              onClick={() => toast.success('Perfil actualizado (Placeholder)')}
              className="bg-primary py-4 px-8 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-95"
            >
              Guardar Cambios
            </button>
          </form>
        </section>

      </div>
    </main>
  );
}
