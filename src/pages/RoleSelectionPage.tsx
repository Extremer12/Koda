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
    <main className="min-h-screen bg-surface flex flex-col items-center p-6 md:p-12">
      <div className="w-full max-w-3xl mx-auto my-auto py-12">
        <header className="text-center mb-16 animate-fade-in">
          <span className="font-label text-[10px] uppercase tracking-[0.6em] text-primary font-black mb-4 block">KODA</span>
          <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-6 uppercase">
            Selecciona tu Perfil
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant font-medium opacity-60">
            Elige cómo deseas participar en el ecosistema editorial.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {/* Lector */}
          <div 
            onClick={() => handleSelectRole('affiliate')}
            className={`group bg-white border border-outline-variant/20 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 hover:border-primary/50 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] cursor-pointer transition-all animate-slide-up stagger-1 ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center shrink-0 text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined text-3xl">local_library</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Lector</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed opacity-70 mb-4 md:mb-0">
                Explora la biblioteca luminosa, adquiere conocimientos exclusivos y apoya a creadores independientes.
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center self-center w-10 h-10 rounded-full border border-outline-variant/10 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
          </div>

          {/* Creador */}
          <div 
            onClick={() => handleSelectRole('creator')}
            className={`group bg-white border border-outline-variant/20 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 hover:border-primary/50 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] cursor-pointer transition-all animate-slide-up stagger-2 ${loading === 'creator' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center shrink-0 text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Autor / Creador</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed opacity-70 mb-4 md:mb-0">
                Publica tus e-books, monetiza tu conocimiento y gestiona tu catálogo con nuestro panel profesional.
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center self-center w-10 h-10 rounded-full border border-outline-variant/10 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                {loading === 'creator' ? 'hourglass_empty' : 'arrow_forward'}
              </span>
            </div>
          </div>

          {/* Afiliado */}
          <div 
            onClick={() => handleSelectRole('affiliate')}
            className={`group bg-white border border-outline-variant/20 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 hover:border-primary/50 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] cursor-pointer transition-all animate-slide-up stagger-3 ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center shrink-0 text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined text-3xl">campaign</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Socio Afiliado</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed opacity-70 mb-4 md:mb-0">
                Únete a la red comercial, recomienda los mejores títulos y genera ingresos de forma automatizada.
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center self-center w-10 h-10 rounded-full border border-outline-variant/10 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center animate-fade-in stagger-4">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-on-surface-variant opacity-30">
            Podrás cambiar tu rol en cualquier momento desde los ajustes.
          </p>
        </footer>
      </div>
    </main>
  );
}
