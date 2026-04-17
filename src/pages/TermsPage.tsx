import { Link } from 'react-router-dom';

export function TermsPage() {
  return (
    <main className="bg-surface min-h-screen pt-32 pb-24 px-6 md:px-12 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-16 border border-[#f1f1ec] shadow-[0_40px_80px_-20px_rgba(45,47,44,0.1)]">
        <header className="mb-12">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-4 block">Legal</span>
          <h1 className="font-headline font-black text-4xl text-on-surface uppercase tracking-tight">Términos de Servicio</h1>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60 mt-4">
            Última actualización: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
          </p>
        </header>

        <div className="prose prose-sm md:prose-base font-body text-on-surface-variant leading-relaxed opacity-80 max-w-none">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mt-8 mb-4">1. Aceptación de los Términos</h2>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mt-8 mb-4">2. Pagos y Comisiones</h2>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
          </p>
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mt-8 mb-4">3. Propiedad Intelectual</h2>
          <p>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
          </p>
          <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mt-8 mb-4">4. Limitación de Responsabilidad</h2>
          <p>
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-outline-variant/10">
          <Link to="/" className="font-label text-xs uppercase tracking-widest font-bold text-primary hover:text-on-surface transition-colors">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
