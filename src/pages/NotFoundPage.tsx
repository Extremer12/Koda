import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-scale-in" style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: 'var(--space-md)',
        }}>
          <span className="text-gradient">404</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 'var(--space-xl)' }}>
          La página que buscas no existe.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
