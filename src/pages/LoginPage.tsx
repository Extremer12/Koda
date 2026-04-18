import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function LoginPage() {
  const { signInWithPassword, signUpWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('affiliate'); // 'affiliate' or 'creator'
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithPassword(email, password);
        toast.success('Sesión iniciada correctamente');
        navigate('/'); // O redirigir basado en el rol si prefieres, aquí lo dejamos ir al home y el navbar cambia
      } else {
        if (!fullName.trim()) {
          toast.error('El nombre es obligatorio para el registro');
          setLoading(false);
          return;
        }
        await signUpWithPassword(email, password, role, fullName);
        toast.success('Cuenta creada exitosamente');
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Ocurrió un error al procesar tu solicitud');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      toast.error(err.message || 'Error al conectar con Google');
    }
  }

  return (
    <main className="bg-surface min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-black tracking-[-0.05em] text-primary hover:opacity-80 transition-opacity uppercase">
            KODA
          </Link>
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-on-surface-variant opacity-40 mt-4">
            {isLogin ? 'Acceso a tu cuenta' : 'Únete a la plataforma'}
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(45,47,44,0.1)] border border-[#f1f1ec]">
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mb-8 text-center">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="fullName">
                  Nombre Completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  required={!isLogin}
                  className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/20"
                  placeholder="JUAN PÉREZ"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="email">
                Dirección de Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/20"
                placeholder="TU@EMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="space-y-4 pt-4 animate-fade-in">
                <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                  ¿Cómo quieres usar Koda?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer border p-4 text-center transition-all ${role === 'affiliate' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50'}`}>
                    <input type="radio" name="role" value="affiliate" checked={role === 'affiliate'} onChange={() => setRole('affiliate')} className="hidden" />
                    <span className="material-symbols-outlined block mb-2">campaign</span>
                    <span className="font-label text-[10px] font-bold uppercase tracking-widest block">Afiliado</span>
                    <span className="text-[8px] opacity-60 mt-1 block normal-case tracking-normal">Recomendar y ganar</span>
                  </label>
                  <label className={`cursor-pointer border p-4 text-center transition-all ${role === 'creator' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50'}`}>
                    <input type="radio" name="role" value="creator" checked={role === 'creator'} onChange={() => setRole('creator')} className="hidden" />
                    <span className="material-symbols-outlined block mb-2">menu_book</span>
                    <span className="font-label text-[10px] font-bold uppercase tracking-widest block">Creador</span>
                    <span className="text-[8px] opacity-60 mt-1 block normal-case tracking-normal">Vender E-books</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-4 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <div className="h-4 w-[1px] bg-on-primary animate-curatorial-pulse"></div>
              ) : (
                isLogin ? 'Ingresar a mi cuenta' : 'Crear mi cuenta en KODA'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">O continuar con</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-outline-variant/30 py-4 text-on-surface font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-surface-container-low active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            Google
          </button>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setRole('affiliate');
              }}
              className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Explorar Tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
