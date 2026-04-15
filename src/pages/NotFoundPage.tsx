import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="bg-surface min-h-screen flex items-center justify-center px-6">
      <div className="text-center animate-slide-up">
        <h1 className="font-headline font-black text-[8rem] md:text-[12rem] leading-none text-on-surface opacity-5 select-none">
          404
        </h1>
        <div className="-mt-12 md:-mt-24 relative z-10">
          <h2 className="font-headline font-bold text-2xl md:text-3xl text-on-surface uppercase tracking-tight mb-4">
            Ubicación fuera del archivo
          </h2>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant opacity-60 max-w-xs mx-auto mb-12">
            La página que busca no forma parte de la colección actual o ha sido removida permanentemente.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-primary px-12 py-5 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-95"
          >
            Regresar al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
