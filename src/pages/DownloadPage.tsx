import { useParams, Link } from 'react-router-dom';
import { Download, CheckCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function DownloadPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'ready' | 'expired' | 'error'>('loading');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [ebookTitle, setEbookTitle] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    async function validateToken() {
      try {
        const { data, error } = await supabase.functions.invoke('download-ebook', {
          body: { download_token: token },
        });

        if (error) throw error;
        if (data?.url) {
          setDownloadUrl(data.url);
          setEbookTitle(data.title || 'E-book');
          setStatus('ready');
        } else {
          setStatus('expired');
        }
      } catch {
        setStatus('error');
      }
    }

    validateToken();
  }, [token]);

  return (
    <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card-static animate-scale-in" style={{
        padding: 'var(--space-2xl)',
        width: '100%',
        maxWidth: '480px',
        textAlign: 'center',
      }}>
        {status === 'loading' && (
          <>
            <div className="spinner spinner-lg" style={{ margin: '0 auto var(--space-lg)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Verificando tu compra...</p>
          </>
        )}

        {status === 'ready' && (
          <>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--success-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-lg)',
            }}>
              <CheckCircle size={36} style={{ color: 'var(--success)' }} />
            </div>
            <h2 style={{ marginBottom: 'var(--space-sm)' }}>¡Pago confirmado!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '0.9rem' }}>
              Tu e-book <strong style={{ color: 'var(--text-primary)' }}>{ebookTitle}</strong> está listo para descargar.
            </p>
            {downloadUrl && (
              <a href={downloadUrl} className="btn btn-primary btn-lg w-full" download>
                <Download size={20} />
                Descargar E-Book
              </a>
            )}
            <div style={{ marginTop: 'var(--space-xl)' }}>
              <Link to="/" className="btn btn-ghost">
                <ArrowLeft size={16} />
                Explorar más e-books
              </Link>
            </div>
          </>
        )}

        {status === 'expired' && (
          <>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Enlace expirado</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
              Este enlace de descarga ha expirado. Contacta a soporte para obtener uno nuevo.
            </p>
            <a href="mailto:zioncode25@gmail.com" className="btn btn-primary">
              Contactar soporte
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Error</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
              No pudimos verificar tu compra. Intenta de nuevo o contacta a soporte.
            </p>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
