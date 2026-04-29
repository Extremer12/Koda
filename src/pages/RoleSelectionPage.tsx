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
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-6 uppercase">
            Bienvenido a <span className="text-primary">KODA</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-medium">
            Personaliza tu experiencia. Cuéntanos cómo planeas usar la plataforma hoy.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lector / Comprador */}
          <div 
            onClick={() => handleSelectRole('affiliate')}
            className={`card-premium cursor-pointer animate-slide-up stagger-1 flex flex-col items-center text-center group ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="icon-circle bg-surface-container-low text-primary group-hover:bg-primary group-hover:text-white">
              <span className="material-symbols-outlined text-4xl">local_library</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Solo Leer</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              Quiero explorar la biblioteca, descubrir autores independientes y comprar los mejores e-books del mercado.
            </p>
            <div className="mt-auto w-full py-4 border-t border-outline-variant/10 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Elegir este rol
            </div>
          </div>

          {/* Creador / Vendedor */}
          <div 
            onClick={() => handleSelectRole('creator')}
            className={`card-premium cursor-pointer animate-slide-up stagger-2 flex flex-col items-center text-center group border-primary/20 bg-primary/5 ${loading === 'creator' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="icon-circle bg-primary text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-4xl">menu_book</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Vender E-books</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              Soy autor o creador de contenido. Quiero publicar mis obras, administrar mi propia tienda y ganar dinero.
            </p>
            <div className="mt-auto w-full py-4 border-t border-outline-variant/10 text-[10px] font-black uppercase tracking-widest text-primary">
              {loading === 'creator' ? 'Procesando...' : '¡Quiero mi Tienda!'}
            </div>
          </div>

          {/* Afiliado */}
          <div 
            onClick={() => handleSelectRole('affiliate')}
            className={`card-premium cursor-pointer animate-slide-up stagger-3 flex flex-col items-center text-center group ${loading === 'affiliate' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="icon-circle bg-surface-container-low text-secondary group-hover:bg-secondary group-hover:text-white">
              <span className="material-symbols-outlined text-4xl">campaign</span>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Ser Afiliado</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              Quiero recomendar los libros de otros creadores y ganar comisiones por cada venta realizada con mi link.
            </p>
            <div className="mt-auto w-full py-4 border-t border-outline-variant/10 text-[10px] font-black uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              Elegir este rol
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center animate-fade-in stagger-4">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-on-surface-variant opacity-40">
            Podrás cambiar tu rol en cualquier momento desde los ajustes.
          </p>
        </footer>
      </div>
    </main>
  );
}
