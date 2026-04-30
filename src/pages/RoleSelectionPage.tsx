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
            className={`group bg-white rounded-[2.5rem] p-10 cursor-pointer animate-slide-up stagger-1 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-outline-variant/5 hover:border-primary/20 ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-20 h-20 rounded-full bg-surface-container-low text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <span className="material-symbols-outlined text-4xl">local_library</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Solo Leer</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-10 opacity-70">
              Quiero explorar la biblioteca, descubrir autores independientes y comprar los mejores e-books del mercado.
            </p>
            <div className="mt-auto pt-6 border-t border-outline-variant/5 w-full font-black text-[10px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              Explorar Catálogo
            </div>
          </div>

          {/* Creador / Vendedor */}
          <div 
            onClick={() => handleSelectRole('creator')}
            className={`group bg-on-surface rounded-[2.5rem] p-10 cursor-pointer animate-slide-up stagger-2 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(125,16,231,0.2)] border border-white/5 ${loading === 'creator' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center mb-8 shadow-2xl shadow-primary/40 group-hover:scale-110 transition-all duration-500">
              <span className="material-symbols-outlined text-4xl">menu_book</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-white">Vender E-books</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-10">
              Sube tus archivos y vende directamente. Ganancia neta del 91.5% con pagos automáticos vía Mercado Pago.
            </p>
            <div className="mt-auto pt-6 border-t border-white/5 w-full font-black text-[10px] uppercase tracking-widest text-primary">
              {loading === 'creator' ? 'Configurando...' : 'Crear mi Tienda'}
            </div>
          </div>

          {/* Afiliado */}
          <div 
            onClick={() => handleSelectRole('affiliate')}
            className={`group bg-white rounded-[2.5rem] p-10 cursor-pointer animate-slide-up stagger-3 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-outline-variant/5 hover:border-secondary/20 ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-20 h-20 rounded-full bg-surface-container-low text-secondary flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
              <span className="material-symbols-outlined text-4xl">campaign</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Ser Afiliado</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-10 opacity-70">
              Recomienda libros y gana hasta el 80%. Recibe tu dinero en el acto con nuestro sistema de Split Payment.
            </p>
            <div className="mt-auto pt-6 border-t border-outline-variant/5 w-full font-black text-[10px] uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              Unirme a la Red
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
