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
    <main className="fixed inset-0 z-[200] bg-surface flex items-center justify-center p-6 md:p-12 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-secondary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="w-full max-w-xl relative z-10 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <Link to="/" className="text-5xl md:text-6xl font-black tracking-[-0.05em] text-primary hover:opacity-80 transition-opacity uppercase">
            KODA
          </Link>
          <p className="font-label text-[10px] uppercase tracking-[0.6em] text-on-surface-variant opacity-40 mt-6 font-bold">
            {isLogin ? 'Acceso a tu Archivo Digital' : 'Únete a la Revolución Editorial'}
          </p>
        </div>

        <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_80px_160px_-40px_rgba(45,47,44,0.15)] border border-outline-variant/5 animate-scale-in">
          <h2 className="font-headline font-black text-2xl md:text-3xl text-on-surface uppercase tracking-tight mb-10 text-center leading-none">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div className="space-y-3 animate-fade-in">
                <label className="font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant/60" htmlFor="fullName">
                  Nombre Completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  required={!isLogin}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant/10 px-6 py-4 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-on-surface/10 rounded-t-xl"
                  placeholder="JUAN PÉREZ"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-3">
              <label className="font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant/60" htmlFor="email">
                Dirección de Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full bg-surface-container-low border-b-2 border-outline-variant/10 px-6 py-4 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-on-surface/10 rounded-t-xl"
                placeholder="TU@EMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant/60" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="w-full bg-surface-container-low border-b-2 border-outline-variant/10 px-6 py-4 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-on-surface/10 rounded-t-xl"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="space-y-4 pt-4 animate-fade-in">
                <label className="font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant/60">
                  ¿Cuál será tu rol principal?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer rounded-2xl border-2 p-5 text-center transition-all ${role === 'affiliate' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/10 text-on-surface-variant hover:border-primary/30'}`}>
                    <input type="radio" name="role" value="affiliate" checked={role === 'affiliate'} onChange={() => setRole('affiliate')} className="hidden" />
                    <span className="material-symbols-outlined block mb-2 text-3xl">campaign</span>
                    <span className="font-label text-[10px] font-black uppercase tracking-widest block">Afiliado</span>
                  </label>
                  <label className={`cursor-pointer rounded-2xl border-2 p-5 text-center transition-all ${role === 'creator' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/10 text-on-surface-variant hover:border-primary/30'}`}>
                    <input type="radio" name="role" value="creator" checked={role === 'creator'} onChange={() => setRole('creator')} className="hidden" />
                    <span className="material-symbols-outlined block mb-2 text-3xl">menu_book</span>
                    <span className="font-label text-[10px] font-black uppercase tracking-widest block">Creador</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-5 rounded-2xl text-on-primary font-label text-xs font-black uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-6 shadow-xl shadow-primary/20"
            >
              {loading ? (
                <div className="h-5 w-[2px] bg-on-primary animate-pulse"></div>
              ) : (
                isLogin ? 'Ingresar Ahora' : 'Crear mi Cuenta'
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-6 text-on-surface-variant text-[10px] uppercase tracking-widest font-black opacity-30">O accede con</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border-2 border-outline-variant/10 py-5 rounded-2xl text-on-surface font-label text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-surface-container-low active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            Google
          </button>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setRole('affiliate');
              }}
              className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-black underline underline-offset-8"
            >
              {isLogin ? '¿No tienes cuenta? Crea una' : '¿Ya eres miembro? Accede'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/" 
            className="font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant hover:text-primary transition-all inline-flex items-center gap-3 group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Volver a la Biblioteca
          </Link>
        </div>
      </div>
    </main>
  );
}
