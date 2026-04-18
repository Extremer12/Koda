import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useEbook } from '../hooks/useEbooks';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
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
      supabase.rpc('increment_clicks', { p_ref_code: refCode }).then();
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
      const { data, error: functionError } = await supabase.functions.invoke('checkout', {
        body: {
          ebookId: ebook.id,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          refCode: refCode,
        },
      });

      if (functionError) {
        throw new Error(functionError.message || 'Error al procesar el pago');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const { checkoutUrl } = data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error('No se pudo obtener la URL de pago');
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
      <main className="bg-surface min-h-screen flex items-center justify-center">
        <div className="h-12 w-[1px] bg-primary animate-curatorial-pulse"></div>
      </main>
    );
  }

  if (error || !ebook) {
    return (
      <main className="bg-surface min-h-screen pt-32 px-6">
        <div className="max-w-xl mx-auto text-center border border-dashed border-outline-variant/30 p-12">
          <h2 className="font-headline font-bold text-2xl text-on-surface uppercase tracking-tight">E-book no encontrado</h2>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-4 opacity-50">El archivo solicitado no está disponible.</p>
          <Link to="/" className="inline-block mt-12 bg-primary px-8 py-3 text-on-primary font-label text-xs font-bold uppercase tracking-widest transition-transform active:scale-95">
            Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

  const creatorName = (ebook as any).creator?.full_name || 'Autor';

  return (
    <main className="bg-surface min-h-screen pt-24 md:pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1920px] mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 font-label text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors mb-12"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al archivo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
          {/* Left: Product Info */}
          <div className="lg:col-span-7 animate-slide-up">
            <div className="aspect-[3/4] md:aspect-auto md:h-[700px] overflow-hidden bg-surface-container-low mb-12 shadow-[40px_40px_80px_rgba(45,47,44,0.08)]">
              <img
                src={ebook.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80'}
                alt={ebook.title}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="bg-primary text-on-primary font-label text-[10px] px-3 py-1 uppercase tracking-widest">
                Edición Permanente
              </span>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
                {categoryLabels[ebook.category] || ebook.category}
              </span>
            </div>

            <h1 className="font-headline font-black text-4xl md:text-7xl leading-[0.9] tracking-tight uppercase text-on-surface mb-8">
              {ebook.title}
            </h1>

            <p className="font-headline font-bold text-xl text-on-surface-variant mb-12 italic">
              por <span className="text-on-surface not-italic">{creatorName}</span>
            </p>

            {ebook.description && (
              <div className="prose prose-sm md:prose-base max-w-none">
                <p className="font-body text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                  {ebook.description}
                </p>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-24 pt-12 border-t border-outline-variant/10">
              {[
                { icon: 'speed', text: 'Descarga inmediata', label: 'Entrega' },
                { icon: 'verified_user', text: 'Checkout seguro', label: 'Protección' },
                { icon: 'all_inclusive', text: 'Acceso de por vida', label: 'Eternidad' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="font-label text-[8px] uppercase tracking-[0.2em] text-primary font-bold">{item.label}</span>
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                    <span className="font-label text-[10px] uppercase tracking-widest font-bold">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Checkout (Fixed-like behavior on large screen) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white p-8 md:p-12 shadow-[0_40px_80px_-20px_rgba(45,47,44,0.1)] border border-[#f1f1ec]">
              <div className="flex justify-between items-baseline mb-12">
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Precio de Archivo</span>
                <span className="font-headline font-black text-4xl md:text-5xl text-on-surface">{formatPrice(ebook.price)}</span>
              </div>

              <form onSubmit={handleCheckout} className="space-y-8">
                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="buyer-name">Nombre Completo</label>
                  <input
                    id="buyer-name"
                    type="text"
                    className={`w-full bg-transparent border-b ${errors.name ? 'border-error' : 'border-outline-variant/30'} py-4 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/20`}
                    placeholder="INTRODUCE TU NOMBRE"
                    value={buyerName}
                    onChange={(e) => { setBuyerName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                  />
                  {errors.name && <p className="text-[10px] text-error uppercase tracking-widest font-bold">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="buyer-email">Email de Entrega</label>
                  <input
                    id="buyer-email"
                    type="email"
                    className={`w-full bg-transparent border-b ${errors.email ? 'border-error' : 'border-outline-variant/30'} py-4 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface/20`}
                    placeholder="TU@EMAIL.COM"
                    value={buyerEmail}
                    onChange={(e) => { setBuyerEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                  />
                  {errors.email && <p className="text-[10px] text-error uppercase tracking-widest font-bold">{errors.email}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary py-6 text-on-primary font-label text-xs font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <div className="h-4 w-[1px] bg-on-primary animate-curatorial-pulse"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      Adquirir ahora
                    </>
                  )}
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40 leading-relaxed">
                  Serás redirigido a Mercado Pago para completar tu transacción de forma segura mediante encriptación bancaria.
                </p>
              </div>
            </div>
            
            {/* Secondary Bento in Sidebar for "More from author" - Placeholder concept */}
            <div className="mt-12 border-l border-outline-variant/10 pl-8">
               <span className="font-label text-[10px] uppercase tracking-[0.2em] text-tertiary font-bold mb-4 block">Garantía Curatorial</span>
               <p className="font-body text-xs text-on-surface-variant leading-relaxed opacity-60 italic">
                 "Cada pieza en el archivo Koda ha sido sometida a un riguroso proceso de revisión técnica y estética para asegurar la máxima calidad de contenido."
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
