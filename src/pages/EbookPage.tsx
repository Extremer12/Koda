import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useEbook } from '../hooks/useEbooks';
import { supabase } from '../lib/supabase';
import { formatPrice, calculateCommissions, PLATFORM_FEE_PERCENT } from '../lib/utils';
import { ShoppingCart, ArrowLeft, Download, Shield, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryLabels: Record<string, string> = {
  'desarrollo-personal': 'Desarrollo Personal',
  'marketing': 'Marketing',
  'programacion': 'Programación',
  'finanzas': 'Finanzas',
  'negocios': 'Negocios',
  'diseno': 'Diseño',
  'productividad': 'Productividad',
  'idiomas': 'Idiomas',
  'salud': 'Salud',
  'general': 'General',
};

export function EbookPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || undefined;
  const { ebook, loading, error } = useEbook(id);

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // Track affiliate clicks
  useEffect(() => {
    if (refCode) {
      supabase.rpc('increment_clicks', { p_ref_code: refCode }).catch(() => {});
    }
  }, [refCode]);

  function validate() {
    const errs: typeof errors = {};
    if (!buyerName.trim()) errs.name = 'Ingresa tu nombre';
    if (!buyerEmail.trim()) errs.email = 'Ingresa tu email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) errs.email = 'Email inválido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !ebook) return;

    setSubmitting(true);
    try {
      // In production, this would call the Edge Function that creates
      // a Mercado Pago preference and returns the checkout URL
      const response = await supabase.functions.invoke('create-preference', {
        body: {
          ebook_id: ebook.id,
          buyer_name: buyerName.trim(),
          buyer_email: buyerEmail.trim(),
          ref_code: refCode,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Error al crear el pago');
      }

      const { init_point } = response.data;
      if (init_point) {
        window.location.href = init_point;
      } else {
        toast.success('Pago creado. Redirigiendo...');
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Error al procesar. Intenta de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="page-loader">
          <div className="spinner spinner-lg" />
        </div>
      </main>
    );
  }

  if (error || !ebook) {
    return (
      <main className="page">
        <div className="container empty-state">
          <h2>E-book no encontrado</h2>
          <p className="empty-state-desc">El e-book que buscas no existe o fue eliminado.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
            Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

  const creatorName = (ebook as any).creator?.full_name || 'Autor';

  return (
    <main className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
        <Link to="/" className="btn btn-ghost" style={{ marginBottom: 'var(--space-lg)' }}>
          <ArrowLeft size={18} />
          Volver a la tienda
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--space-2xl)', alignItems: 'start' }}>
          {/* Left: Ebook Info */}
          <div className="animate-slide-up">
            <div style={{
              borderRadius: 'var(--radius-2xl)',
              overflow: 'hidden',
              marginBottom: 'var(--space-xl)',
              maxWidth: '400px',
              aspectRatio: '3/4',
              background: 'var(--bg-tertiary)',
            }}>
              {ebook.cover_url ? (
                <img
                  src={ebook.cover_url}
                  alt={ebook.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem',
                  opacity: 0.2,
                }}>
                  📖
                </div>
              )}
            </div>

            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-md)' }}>
              {categoryLabels[ebook.category] || ebook.category}
            </span>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
              {ebook.title}
            </h1>

            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
              por <strong style={{ color: 'var(--text-primary)' }}>{creatorName}</strong>
            </p>

            {ebook.description && (
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginTop: 'var(--space-lg)',
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap',
              }}>
                {ebook.description}
              </p>
            )}

            {/* Trust badges */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-xl)',
              marginTop: 'var(--space-2xl)',
              flexWrap: 'wrap',
            }}>
              {[
                { icon: <Zap size={18} />, text: 'Descarga inmediata' },
                { icon: <Shield size={18} />, text: 'Pago seguro' },
                { icon: <Clock size={18} />, text: 'Acceso de por vida' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Checkout */}
          <div className="checkout-section animate-slide-up stagger-2">
            <div className="checkout-price text-gradient">
              {formatPrice(ebook.price)}
            </div>

            <form onSubmit={handleCheckout}>
              <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="input-label" htmlFor="buyer-name">Tu nombre</label>
                <input
                  id="buyer-name"
                  type="text"
                  className={`input-field ${errors.name ? 'input-error' : ''}`}
                  placeholder="Juan Pérez"
                  value={buyerName}
                  onChange={(e) => { setBuyerName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                  autoComplete="name"
                />
                {errors.name && <span className="input-error-msg">{errors.name}</span>}
              </div>

              <div className="input-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="input-label" htmlFor="buyer-email">Tu email</label>
                <input
                  id="buyer-email"
                  type="email"
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  placeholder="tu@email.com"
                  value={buyerEmail}
                  onChange={(e) => { setBuyerEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                  autoComplete="email"
                />
                {errors.email && <span className="input-error-msg">{errors.email}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={submitting}
                id="checkout-btn"
              >
                {submitting ? (
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Comprar ahora
                  </>
                )}
              </button>
            </form>

            <div className="checkout-divider" />

            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.6 }}>
              Serás redirigido a Mercado Pago para completar tu compra de forma segura. Tras el pago, podrás descargar tu e-book al instante.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page > .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
