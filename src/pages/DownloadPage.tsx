import { useParams, Link } from 'react-router-dom';
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
    <main className="bg-surface min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-slide-up bg-white p-12 shadow-[0_40px_80px_-20px_rgba(45,47,44,0.1)] border border-[#f1f1ec] text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="h-12 w-[1px] bg-primary animate-curatorial-pulse mb-8"></div>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Verificando adquisición...</p>
          </div>
        )}

        {status === 'ready' && (
          <>
            <div className="mb-12">
              <span className="material-symbols-outlined text-6xl text-primary opacity-20">check_circle</span>
            </div>
            <h2 className="font-headline font-black text-2xl text-on-surface uppercase tracking-tight mb-4">Adquisición Confirmada</h2>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60 leading-relaxed mb-12">
              La edición <strong className="text-on-surface">{ebookTitle}</strong> ha sido verificada y está lista para ser incorporada a su biblioteca personal.
            </p>
            {downloadUrl && (
              <a 
                href={downloadUrl} 
                className="w-full bg-primary py-5 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-3" 
                download
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Descargar ahora
              </a>
            )}
            <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
              <Link 
                to="/" 
                className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                Volver al archivo
              </Link>
            </div>
          </>
        )}

        {status === 'expired' && (
          <>
            <h2 className="font-headline font-black text-2xl text-on-surface uppercase tracking-tight mb-4">Enlace Expirado</h2>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60 leading-relaxed mb-12">
              Esta credencial de descarga ha caducado por motivos de seguridad permanente.
            </p>
            <a 
              href="mailto:soporte@koda.com" 
              className="w-full bg-on-background py-5 text-white font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-primary flex items-center justify-center gap-3"
            >
              Contactar Soporte
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 className="font-headline font-black text-2xl text-on-surface uppercase tracking-tight mb-4">Error de Validación</h2>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60 leading-relaxed mb-12">
              No se ha podido autenticar la transacción. Por favor, intente de nuevo o consulte con nuestro equipo.
            </p>
            <Link 
              to="/" 
              className="w-full bg-primary py-5 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
            >
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
