import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAffiliateSales } from '../hooks/useSales';
import { supabase } from '../lib/supabase';
import { formatPrice, formatDate, generateRefCode } from '../lib/utils';
import { Ebook, Affiliation } from '../types/database';
import toast from 'react-hot-toast';

export function AffiliateDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { sales, stats } = useAffiliateSales(user?.id);

  const [availableEbooks, setAvailableEbooks] = useState<Ebook[]>([]);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [loadingEbooks, setLoadingEbooks] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingEbooks(true);
      const { data: ebooks } = await supabase
        .from('ebooks')
        .select('*, creator:profiles!ebooks_creator_id_fkey(id, full_name)')
        .eq('is_active', true)
        .gt('commission_percent', 0)
        .order('created_at', { ascending: false });

      const { data: affs } = await supabase
        .from('affiliations')
        .select('*, ebook:ebooks(id, title, price, cover_url, commission_percent)')
        .eq('affiliate_id', user.id);

      setAvailableEbooks(ebooks || []);
      setAffiliations(affs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEbooks(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (authLoading) {
    return (
      <main className="bg-surface min-h-screen flex items-center justify-center">
        <div className="h-12 w-[1px] bg-primary animate-curatorial-pulse"></div>
      </main>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  async function generateLink(ebookId: string) {
    try {
      const code = generateRefCode();
      const { error } = await supabase.from('affiliations').insert({
        affiliate_id: user!.id,
        ebook_id: ebookId,
        ref_code: code,
      });
      if (error) throw error;
      toast.success('¡Link de afiliado generado!');
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al generar link');
    }
  }

  function copyLink(refCode: string, affiliationId: string) {
    const url = `${window.location.origin}/ebook/${affiliations.find(a => a.ref_code === refCode)?.ebook_id}?ref=${refCode}`;
    navigator.clipboard.writeText(url);
    setCopiedId(affiliationId);
    toast.success('Link copiado al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  }

  const existingEbookIds = new Set(affiliations.map(a => a.ebook_id));

  return (
    <main className="bg-surface min-h-screen pt-24 md:pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1920px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 animate-slide-up">
          <div>
            <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-4 block">Programa de Socios</span>
            <h1 className="font-headline font-black text-4xl md:text-6xl text-on-surface uppercase tracking-tight">Panel de Afiliado</h1>
          </div>
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40 max-w-xs md:text-right">
            Genera links curados, rastrea la interacción y recibe comisiones por cada adquisición en el archivo.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: 'ads_click', label: 'Impactos', value: stats.totalClicks.toLocaleString() },
            { icon: 'shopping_cart', label: 'Conversiones', value: stats.totalSales },
            { icon: 'payments', label: 'Comisiones Netas', value: formatPrice(stats.totalCommissions) },
            { icon: 'analytics', label: 'Tasa de Conversión', value: `${stats.conversionRate.toFixed(1)}%` },
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 border border-[#f1f1ec] animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-primary text-xl opacity-40">{s.icon}</span>
                <span className="font-label text-[8px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">{s.label}</span>
              </div>
              <span className="font-headline font-black text-3xl text-on-surface">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Active Affiliations */}
        <section className="mb-24 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight">Mis Enlaces Curados</h3>
            <span className="font-label text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest">{affiliations.length} Activos</span>
          </div>
          <div className="bg-white border border-[#f1f1ec] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-label text-[10px] uppercase tracking-widest">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-on-surface-variant opacity-40">
                    <th className="px-6 py-4 font-bold">Edición</th>
                    <th className="px-6 py-4 font-bold">Comisión</th>
                    <th className="px-6 py-4 font-bold">Impactos</th>
                    <th className="px-6 py-4 font-bold text-right">Link de Socio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {affiliations.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center opacity-40 italic">Aún no has generado enlaces de socio.</td></tr>
                  ) : affiliations.map((aff) => (
                    <tr key={aff.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 text-on-surface font-bold">{(aff as any).ebook?.title || '—'}</td>
                      <td className="px-6 py-4">{(aff as any).ebook?.commission_percent || 0}%</td>
                      <td className="px-6 py-4">{aff.clicks}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => copyLink(aff.ref_code, aff.id)}
                          className="inline-flex items-center gap-2 text-primary font-bold hover:brightness-110 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">{copiedId === aff.id ? 'check_circle' : 'content_copy'}</span>
                          {copiedId === aff.id ? 'Copiado' : 'Copiar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Available Catalog */}
        <section className="mb-24 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex justify-between items-center mb-12">
            <h3 className="font-headline font-bold text-2xl text-on-surface uppercase tracking-tight">Catálogo de Oportunidades</h3>
            <span className="font-label text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest">Nuevas incorporaciones</span>
          </div>
          
          {loadingEbooks ? (
            <div className="flex justify-center py-12"><div className="h-8 w-[1px] bg-primary animate-bounce"></div></div>
          ) : availableEbooks.length === 0 ? (
            <p className="text-center opacity-40 font-label text-xs tracking-widest py-12">No hay ediciones disponibles para afiliación ahora mismo.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableEbooks.map((eb) => {
                const hasLink = existingEbookIds.has(eb.id);
                const isOwn = eb.creator_id === user?.id;
                return (
                  <div key={eb.id} className="bg-white p-8 border border-[#f1f1ec] group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-label text-[8px] uppercase tracking-[0.2em] text-primary font-bold">Acuerdo al {eb.commission_percent}%</span>
                      <span className="font-headline font-bold text-sm text-on-surface">{formatPrice(eb.price)}</span>
                    </div>
                    <h4 className="font-headline font-bold text-xl text-on-surface mb-2 group-hover:text-primary transition-colors">{eb.title}</h4>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40 mb-8">
                      por {(eb as any).creator?.full_name || 'Autor'}
                    </p>
                    
                    <div className="mt-auto">
                      {isOwn ? (
                        <div className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-20 py-3 border border-outline-variant/10 text-center italic">Tu propia edición</div>
                      ) : hasLink ? (
                        <div className="text-[10px] uppercase tracking-widest font-bold text-primary py-3 border border-primary/20 text-center flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          Socio Activo
                        </div>
                      ) : (
                        <button 
                          onClick={() => generateLink(eb.id)}
                          className="w-full bg-on-background py-4 text-white font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-primary"
                        >
                          Generar Credenciales
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* History */}
        <section className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mb-8">Registro de Comisiones</h3>
          <div className="bg-white border border-[#f1f1ec] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-label text-[10px] uppercase tracking-widest">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-on-surface-variant opacity-40">
                    <th className="px-6 py-4 font-bold">Fecha</th>
                    <th className="px-6 py-4 font-bold">Edición</th>
                    <th className="px-6 py-4 font-bold">Valor Transacción</th>
                    <th className="px-6 py-4 font-bold">Tu Retorno</th>
                    <th className="px-6 py-4 font-bold">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {sales.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center opacity-40 italic">Sin comisiones registradas aún.</td></tr>
                  ) : sales.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 opacity-60">{formatDate(s.created_at)}</td>
                      <td className="px-6 py-4 text-on-surface font-bold">{(s as any).ebook?.title || '—'}</td>
                      <td className="px-6 py-4">{formatPrice(s.total_amount)}</td>
                      <td className="px-6 py-4 text-primary font-bold">{formatPrice(s.affiliate_amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[8px] font-black border ${
                          s.status === 'approved' ? 'border-primary text-primary' : 'border-tertiary text-tertiary'
                        }`}>
                          {s.status === 'approved' ? 'LIQUIDADO' : s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
