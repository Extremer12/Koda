import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function RoleSelectionPage() {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSelectRole(role: 'creator' | 'affiliate') {
    try {
      setLoading(role);
      await updateProfile({ role });
      toast.success('¡Perfil configurado correctamente!');
      
      if (role === 'creator') {
        navigate('/dashboard/creator');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      console.error(error);
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-surface flex flex-col items-center py-12 md:py-24 px-6 md:px-12 relative overflow-x-hidden">
      {/* Background decoration - Lighter & cleaner */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[60rem] h-[60rem] bg-secondary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl w-full relative z-10 flex flex-col flex-1">
        <header className="text-center mb-16 md:mb-24 animate-fade-in">
          <Link to="/" className="text-3xl font-black tracking-tighter text-primary mb-12 inline-block">KODA</Link>
          <h1 className="text-5xl md:text-8xl font-black text-on-surface tracking-tighter mb-8 uppercase leading-[0.9]">
            Tu nuevo <span className="text-primary italic">Comienzo.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-medium opacity-50 leading-relaxed">
            Personaliza tu experiencia en el ecosistema editorial más elegante. ¿Cómo prefieres participar hoy?
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto w-full pb-12">
          {/* Lector */}
          <div 
            onClick={() => handleSelectRole('affiliate')}
            className={`group bg-white rounded-[2rem] p-8 md:p-10 cursor-pointer animate-slide-up stagger-1 flex flex-col items-start text-left transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-outline-variant/10 hover:border-primary/20 ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center mb-12 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <span className="material-symbols-outlined text-3xl">local_library</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Lector</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8 opacity-60 font-medium">
              Explora, compra y disfruta de los mejores e-books independientes.
            </p>
            <div className="mt-auto pt-6 border-t border-outline-variant/5 w-full flex items-center justify-between">
              <span className="font-black text-[10px] uppercase tracking-widest text-primary">Acceder ahora</span>
              <span className="material-symbols-outlined text-primary text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Autor */}
          <div 
            onClick={() => handleSelectRole('creator')}
            className={`group bg-white rounded-[2rem] p-8 md:p-10 cursor-pointer animate-slide-up stagger-2 flex flex-col items-start text-left transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border-2 border-primary/20 shadow-xl shadow-primary/5 ${loading === 'creator' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-12 shadow-lg shadow-primary/20 group-hover:scale-110 transition-all duration-500">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Autor</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8 opacity-60 font-medium">
              Publica, monetiza y gestiona tus obras con un panel profesional.
            </p>
            <div className="mt-auto pt-6 border-t border-outline-variant/5 w-full flex items-center justify-between">
              <span className="font-black text-[10px] uppercase tracking-widest text-primary">{loading === 'creator' ? 'Configurando...' : 'Crear Tienda'}</span>
              <span className="material-symbols-outlined text-primary text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Afiliado */}
          <div 
            onClick={() => handleSelectRole('affiliate')}
            className={`group bg-white rounded-[2rem] p-8 md:p-10 cursor-pointer animate-slide-up stagger-3 flex flex-col items-start text-left transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-outline-variant/10 hover:border-secondary/20 ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-container-low text-secondary flex items-center justify-center mb-12 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
              <span className="material-symbols-outlined text-3xl">campaign</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Afiliado</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8 opacity-60 font-medium">
              Recomienda libros y gana comisiones por cada venta exitosa.
            </p>
            <div className="mt-auto pt-6 border-t border-outline-variant/5 w-full flex items-center justify-between">
              <span className="font-black text-[10px] uppercase tracking-widest text-secondary">Generar ingresos</span>
              <span className="material-symbols-outlined text-secondary text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>

        <footer className="mt-auto pt-12 pb-12 text-center animate-fade-in stagger-4">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-on-surface-variant opacity-30">
            Podrás cambiar tu rol en cualquier momento desde los ajustes.
          </p>
        </footer>
      </div>
    </main>
  );
}
