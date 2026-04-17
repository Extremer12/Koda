import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full py-12 px-6 md:px-12 bg-white font-label text-sm tracking-wide mt-12 border-t border-outline-variant/10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-[1920px] mx-auto">
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <span className="text-xl font-black text-on-surface tracking-tighter">KODA</span>
          <p className="text-on-surface-variant text-xs opacity-80">
            © {new Date().getFullYear()} KODA. La Biblioteca Luminosa. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center font-medium">
          <Link to="/privacidad" className="text-on-surface-variant hover:text-secondary transition-colors">Privacidad</Link>
          <Link to="/terminos" className="text-on-surface-variant hover:text-secondary transition-colors">Términos de Uso</Link>
          <Link to="/contacto" className="text-on-surface-variant hover:text-secondary transition-colors">Contacto</Link>
          <Link to="/contacto" className="text-on-surface-variant hover:text-secondary transition-colors">Ayuda</Link>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-all shadow-sm">
            <span className="material-symbols-outlined text-xl">language</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-all shadow-sm">
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
