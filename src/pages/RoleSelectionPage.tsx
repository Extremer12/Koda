import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <main className="fixed inset-0 z-[200] bg-surface flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-[40rem] h-[40rem] bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10 py-12">
        <header className="text-center mb-16 md:mb-24 animate-fade-in">
          <span className="font-label text-[10px] uppercase tracking-[0.6em] text-primary font-black mb-4 block">Bienvenido a KODA</span>
          <h1 className="text-5xl md:text-8xl font-black text-on-surface tracking-tighter mb-8 uppercase leading-[0.9]">
            Define tu <span className="text-primary italic">Propósito.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-medium opacity-60 leading-relaxed">
            Personaliza tu experiencia. Cuéntanos cómo planeas participar en el ecosistema editorial más elegante del mercado.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Lector / Comprador */}
          <div 
            onClick={() => handleSelectRole('affiliate')}
            className={`group relative bg-white rounded-[2.5rem] p-10 cursor-pointer animate-slide-up stagger-1 flex flex-col items-center text-center transition-all duration-700 hover:shadow-[0_80px_120px_-30px_rgba(0,0,0,0.08)] border border-outline-variant/10 hover:border-primary/30 overflow-hidden ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="w-24 h-24 rounded-3xl bg-surface-container-low text-primary flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white group-hover:rotate-[10deg] transition-all duration-500 ease-spring">
              <span className="material-symbols-outlined text-5xl">local_library</span>
            </div>
            
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter group-hover:scale-105 transition-transform">Lector</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-10 opacity-60 font-medium">
              Explora la biblioteca luminosa, apoya a tus autores favoritos y adquiere conocimientos exclusivos.
            </p>
            
            <div className="mt-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <span className="h-[2px] w-8 bg-primary/20 group-hover:w-12 transition-all"></span>
              Empezar a leer
              <span className="h-[2px] w-8 bg-primary/20 group-hover:w-12 transition-all"></span>
            </div>
          </div>

          {/* Creador / Vendedor */}
          <div 
            onClick={() => handleSelectRole('creator')}
            className={`group relative bg-on-surface rounded-[2.5rem] p-10 cursor-pointer animate-slide-up stagger-2 flex flex-col items-center text-center transition-all duration-700 hover:shadow-[0_80px_120px_-30px_rgba(125,16,231,0.2)] border border-white/5 overflow-hidden ${loading === 'creator' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="w-24 h-24 rounded-3xl bg-primary text-white flex items-center justify-center mb-10 shadow-2xl shadow-primary/40 group-hover:scale-110 group-hover:-rotate-[10deg] transition-all duration-500 ease-spring">
              <span className="material-symbols-outlined text-5xl">menu_book</span>
            </div>
            
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white group-hover:scale-105 transition-transform">Autor</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-10 font-medium">
              Publica tus obras, monetiza tu conocimiento y gestiona tu catálogo con un panel de control profesional.
            </p>
            
            <div className="mt-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <span className="h-[2px] w-8 bg-primary/40 group-hover:w-12 transition-all"></span>
              {loading === 'creator' ? 'Configurando...' : 'Abrir mi tienda'}
              <span className="h-[2px] w-8 bg-primary/40 group-hover:w-12 transition-all"></span>
            </div>
          </div>

          {/* Afiliado */}
          <div 
            onClick={() => handleSelectRole('affiliate')}
            className={`group relative bg-white rounded-[2.5rem] p-10 cursor-pointer animate-slide-up stagger-3 flex flex-col items-center text-center transition-all duration-700 hover:shadow-[0_80px_120px_-30px_rgba(0,0,0,0.08)] border border-outline-variant/10 hover:border-secondary/30 overflow-hidden ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-secondary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="w-24 h-24 rounded-3xl bg-surface-container-low text-secondary flex items-center justify-center mb-10 group-hover:bg-secondary group-hover:text-white group-hover:rotate-[5deg] transition-all duration-500 ease-spring">
              <span className="material-symbols-outlined text-5xl">campaign</span>
            </div>
            
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter group-hover:scale-105 transition-transform">Afiliado</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-10 opacity-60 font-medium">
              Únete a la red comercial, recomienda los mejores títulos y genera ingresos pasivos al instante.
            </p>
            
            <div className="mt-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-secondary">
              <span className="h-[2px] w-8 bg-secondary/20 group-hover:w-12 transition-all"></span>
              Generar Ingresos
              <span className="h-[2px] w-8 bg-secondary/20 group-hover:w-12 transition-all"></span>
            </div>
          </div>
        </div>

        <footer className="mt-20 text-center animate-fade-in stagger-4">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-on-surface-variant opacity-30">
            Podrás cambiar tu rol en cualquier momento desde los ajustes de tu cuenta.
          </p>
        </footer>
      </div>
    </main>
  );
}
