import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAffiliateSales } from '../hooks/useSales';
import { supabase } from '../lib/supabase';
import { formatPrice, formatDate, generateRefCode } from '../lib/utils';
import { Ebook, Affiliation } from '../types/database';
import {
  MousePointerClick, DollarSign, TrendingUp, Link2,
  Copy, Check, ExternalLink, ShoppingCart,
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AffiliateDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const { sales, stats, loading: salesLoading } = useAffiliateSales(user?.id);

  const [availableEbooks, setAvailableEbooks] = useState<Ebook[]>([]);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [loadingEbooks, setLoadingEbooks] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingEbooks(true);

      // Get all active ebooks
      const { data: ebooks } = await supabase
        .from('ebooks')
        .select('*, creator:profiles!ebooks_creator_id_fkey(id, full_name)')
        .eq('is_active', true)
        .gt('commission_percent', 0)
        .order('created_at', { ascending: false });

      // Get user's affiliations
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
    return <main className="page"><div className="page-loader"><div className="spinner spinner-lg" /></div></main>;
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
    <main className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel de Afiliado</h1>
          <p className="dashboard-subtitle">Genera links, rastrea clics y cobra comisiones</p>
        </div>

        {/* Stats */}
        <div className="grid grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
          {[
            { icon: <MousePointerClick size={20} />, label: 'Clics Totales', value: stats.totalClicks.toLocaleString(), cls: 'accent' },
            { icon: <ShoppingCart size={20} />, label: 'Ventas', value: stats.totalSales, cls: 'success' },
            { icon: <DollarSign size={20} />, label: 'Comisiones', value: formatPrice(stats.totalCommissions), cls: 'accent' },
            { icon: <TrendingUp size={20} />, label: 'Conversión', value: `${stats.conversionRate.toFixed(1)}%`, cls: 'warning' },
          ].map((s, i) => (
            <div key={i} className={`stat-card animate-slide-up stagger-${i + 1}`}>
              <div className={`stat-card-icon ${s.cls}`}>{s.icon}</div>
              <span className="stat-card-label">{s.label}</span>
              <span className="stat-card-value">{s.value}</span>
            </div>
          ))}
        </div>

        {/* My Links */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-display)' }}>
            <Link2 size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Mis Links de Afiliado
          </h3>
          {affiliations.length === 0 ? (
            <div className="empty-state glass-card-static" style={{ padding: 'var(--space-2xl)' }}>
              <p className="empty-state-desc">Aún no tienes links. Genera uno desde el catálogo de abajo.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>E-Book</th>
                    <th>Comisión</th>
                    <th>Clics</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliations.map((aff) => (
                    <tr key={aff.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{(aff as any).ebook?.title || '—'}</td>
                      <td>{(aff as any).ebook?.commission_percent || 0}%</td>
                      <td className="font-mono">{aff.clicks}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => copyLink(aff.ref_code, aff.id)}
                        >
                          {copiedId === aff.id ? <Check size={14} /> : <Copy size={14} />}
                          {copiedId === aff.id ? 'Copiado' : 'Copiar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Available Ebooks */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-display)' }}>
            Catálogo de E-Books Disponibles
          </h3>
          {loadingEbooks ? (
            <div className="page-loader" style={{ minHeight: '200px' }}><div className="spinner" /></div>
          ) : availableEbooks.length === 0 ? (
            <div className="empty-state glass-card-static" style={{ padding: 'var(--space-2xl)' }}>
              <p className="empty-state-desc">No hay e-books disponibles para afiliación en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-auto-fill">
              {availableEbooks.map((eb) => {
                const hasLink = existingEbookIds.has(eb.id);
                const isOwn = eb.creator_id === user?.id;
                return (
                  <div key={eb.id} className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, flex: 1 }}>{eb.title}</h4>
                      <span className="badge badge-accent">{eb.commission_percent}%</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      por {(eb as any).creator?.full_name || 'Autor'}
                    </p>
                    <p className="font-mono" style={{ color: 'var(--accent-secondary)' }}>
                      {formatPrice(eb.price)}
                    </p>
                    <div style={{ marginTop: 'auto', paddingTop: 'var(--space-sm)' }}>
                      {isOwn ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Tu e-book</span>
                      ) : hasLink ? (
                        <span className="badge badge-success">Link generado</span>
                      ) : (
                        <button className="btn btn-primary btn-sm w-full" onClick={() => generateLink(eb.id)}>
                          <Link2 size={14} />
                          Generar Link
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Commission History */}
        <div>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-display)' }}>
            Historial de Comisiones
          </h3>
          {salesLoading ? (
            <div className="page-loader" style={{ minHeight: '200px' }}><div className="spinner" /></div>
          ) : sales.length === 0 ? (
            <div className="empty-state glass-card-static" style={{ padding: 'var(--space-2xl)' }}>
              <p className="empty-state-desc">Aún no tienes comisiones. Comparte tus links para empezar a ganar.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>E-Book</th>
                    <th>Venta Total</th>
                    <th>Tu Comisión</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id}>
                      <td>{formatDate(s.created_at)}</td>
                      <td style={{ color: 'var(--text-primary)' }}>{(s as any).ebook?.title || '—'}</td>
                      <td className="font-mono">{formatPrice(s.total_amount)}</td>
                      <td className="font-mono" style={{ color: 'var(--success)' }}>{formatPrice(s.affiliate_amount)}</td>
                      <td>
                        <span className={`badge ${s.status === 'approved' ? 'badge-success' : s.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                          {s.status === 'approved' ? 'Cobrada' : s.status === 'pending' ? 'Pendiente' : s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
