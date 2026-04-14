import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="flex items-center gap-sm">
            <BookOpen size={18} style={{ color: 'var(--accent-secondary)' }} />
            <span className="footer-text">
              © {new Date().getFullYear()} Koda. Todos los derechos reservados.
            </span>
          </div>
          <div className="footer-links">
            <Link to="/" className="footer-link">Explorar</Link>
            <a href="mailto:zioncode25@gmail.com" className="footer-link">Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
