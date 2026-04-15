import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email);
    } catch (err) {
      // toast is handled in context
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-surface min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-black tracking-[-0.05em] text-primary hover:opacity-80 transition-opacity uppercase">
            KODA
          </Link>
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-on-surface-variant opacity-40 mt-4">
            Acceso al Archivo
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(45,47,44,0.1)] border border-[#f1f1ec]">
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mb-8">
            Iniciar Sesión
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="email">
                Dirección de Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full bg-transparent border-b border-outline-variant/30 py-4 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/20"
                placeholder="TU@EMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-5 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="h-4 w-[1px] bg-on-primary animate-curatorial-pulse"></div>
              ) : (
                'Enviar enlace mágico'
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40 leading-relaxed">
              Te enviaremos un enlace de acceso instantáneo a tu correo electrónico. No se requiere contraseña.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/" 
            className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
