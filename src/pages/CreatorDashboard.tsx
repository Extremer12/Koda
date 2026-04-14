import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCreatorEbooks } from '../hooks/useEbooks';
import { useCreatorSales } from '../hooks/useSales';
import { supabase } from '../lib/supabase';
import { formatPrice, formatDate, CATEGORIES } from '../lib/utils';
import {
  BookOpen, DollarSign, ShoppingCart, TrendingUp,
  Plus, Upload, X, Eye, EyeOff, BarChart3,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export function CreatorDashboard() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth();
  const { ebooks, loading: ebooksLoading, refetch: refetchEbooks } = useCreatorEbooks(user?.id);
  const { sales, stats, loading: salesLoading } = useCreatorSales(user?.id);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'general',
    commission_percent: '30',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const ebookInputRef = useRef<HTMLInputElement>(null);

  if (authLoading) {
    return <main className="page"><div className="page-loader"><div className="spinner spinner-lg" /></div></main>;
  }

  if (!user) return <Navigate to="/login" replace />;

  // Allow role change to creator if currently affiliate
  async function switchToCreator() {
    try {
      await updateProfile({ role: 'creator' });
      toast.success('¡Ahora eres creador! Puedes subir e-books.');
      window.location.reload();
    } catch {
      toast.error('Error al cambiar rol');
    }
  }

  if (profile?.role !== 'creator' && profile?.role !== 'admin') {
    return (
      <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card-static animate-scale-in" style={{ padding: 'var(--space-2xl)', maxWidth: '480px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>Panel de Creador</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Actualmente eres afiliado. ¿Quieres convertirte en creador para subir tus propios e-books?
          </p>
          <button onClick={switchToCreator} className="btn btn-primary btn-lg">
            Ser Creador
          </button>
        </div>
      </main>
    );
  }

  // Chart data (last 30 days)
  const chartData = (() => {
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days[key] = 0;
    }
    sales.filter(s => s.status === 'approved').forEach(s => {
      const key = s.created_at.split('T')[0];
      if (days[key] !== undefined) {
        days[key] += Number(s.creator_amount);
      }
    });
    return Object.entries(days).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
      monto: amount,
    }));
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.price || !ebookFile) {
      toast.error('Completa título, precio y sube el archivo');
      return;
    }

    setSubmitting(true);
    try {
      const timestamp = Date.now();

      // Upload cover
      let coverUrl = '';
      if (coverFile) {
        const coverPath = `${user!.id}/${timestamp}-cover.${coverFile.name.split('.').pop()}`;
        const { error: coverErr } = await supabase.storage
          .from('covers')
          .upload(coverPath, coverFile);
        if (coverErr) throw coverErr;
        const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(coverPath);
        coverUrl = publicUrl;
      }

      // Upload ebook file
      const ebookPath = `${user!.id}/${timestamp}-ebook.${ebookFile.name.split('.').pop()}`;
      const { error: ebookErr } = await supabase.storage
        .from('ebooks')
        .upload(ebookPath, ebookFile);
      if (ebookErr) throw ebookErr;

      // Insert ebook record
      const { error } = await supabase.from('ebooks').insert({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        cover_url: coverUrl || null,
        file_url: ebookPath,
        creator_id: user!.id,
        category: formData.category,
        commission_percent: parseInt(formData.commission_percent),
      });

      if (error) throw error;

      toast.success('¡E-book publicado exitosamente!');
      setShowForm(false);
      setFormData({ title: '', description: '', price: '', category: 'general', commission_percent: '30' });
      setCoverFile(null);
      setEbookFile(null);
      refetchEbooks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al publicar');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleEbook(id: string, active: boolean) {
    try {
      await supabase.from('ebooks').update({ is_active: !active }).eq('id', id);
      refetchEbooks();
      toast.success(active ? 'E-book desactivado' : 'E-book activado');
    } catch {
      toast.error('Error al actualizar');
    }
  }

  return (
    <main className="page">
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-4xl)' }}>
        {/* Header */}
        <div className="dashboard-header">
          <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <h1 className="dashboard-title">Panel de Creador</h1>
              <p className="dashboard-subtitle">Gestiona tus e-books y ventas</p>
            </div>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              <Plus size={18} />
              Nuevo E-Book
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
          {[
            { icon: <BookOpen size={20} />, label: 'E-Books', value: stats.totalBooks, cls: 'accent' },
            { icon: <ShoppingCart size={20} />, label: 'Ventas', value: stats.approvedSales, cls: 'success' },
            { icon: <DollarSign size={20} />, label: 'Ingresos', value: formatPrice(stats.totalRevenue), cls: 'accent' },
            { icon: <TrendingUp size={20} />, label: 'Tasa', value: stats.totalSales > 0 ? `${Math.round((stats.approvedSales / stats.totalSales) * 100)}%` : '0%', cls: 'warning' },
          ].map((s, i) => (
            <div key={i} className={`stat-card animate-slide-up stagger-${i + 1}`}>
              <div className={`stat-card-icon ${s.cls}`}>{s.icon}</div>
              <span className="stat-card-label">{s.label}</span>
              <span className="stat-card-value">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="chart-container" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="chart-header">
            <h3 className="chart-title">
              <BarChart3 size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Ingresos últimos 30 días
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#636366', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#636366', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18182a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', fontSize: '0.85rem' }}
                labelStyle={{ color: '#8e8e93' }}
              />
              <Area type="monotone" dataKey="monto" stroke="#7c3aed" strokeWidth={2} fill="url(#colorMonto)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* My Ebooks */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-display)' }}>Mis E-Books</h3>
          {ebooksLoading ? (
            <div className="page-loader" style={{ minHeight: '200px' }}><div className="spinner" /></div>
          ) : ebooks.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
              <p className="empty-state-desc">Aún no tienes e-books. ¡Publica el primero!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Comisión</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ebooks.map((eb) => (
                    <tr key={eb.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{eb.title}</td>
                      <td className="font-mono">{formatPrice(eb.price)}</td>
                      <td>{eb.commission_percent}%</td>
                      <td><span className="badge badge-neutral">{eb.category}</span></td>
                      <td>
                        <span className={`badge ${eb.is_active ? 'badge-success' : 'badge-error'}`}>
                          {eb.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => toggleEbook(eb.id, eb.is_active)}
                          aria-label={eb.is_active ? 'Desactivar' : 'Activar'}
                        >
                          {eb.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Sales */}
        <div>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-display)' }}>Ventas Recientes</h3>
          {salesLoading ? (
            <div className="page-loader" style={{ minHeight: '200px' }}><div className="spinner" /></div>
          ) : sales.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
              <p className="empty-state-desc">Aún no tienes ventas.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>E-Book</th>
                    <th>Comprador</th>
                    <th>Monto</th>
                    <th>Tu ingreso</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 20).map((s) => (
                    <tr key={s.id}>
                      <td>{formatDate(s.created_at)}</td>
                      <td style={{ color: 'var(--text-primary)' }}>{(s as any).ebook?.title || '—'}</td>
                      <td>{s.buyer_name}</td>
                      <td className="font-mono">{formatPrice(s.total_amount)}</td>
                      <td className="font-mono" style={{ color: 'var(--success)' }}>{formatPrice(s.creator_amount)}</td>
                      <td>
                        <span className={`badge ${s.status === 'approved' ? 'badge-success' : s.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                          {s.status === 'approved' ? 'Aprobada' : s.status === 'pending' ? 'Pendiente' : s.status}
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

      {/* New Ebook Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Publicar nuevo E-Book</h3>
              <button className="btn btn-icon btn-ghost" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="eb-title">Título *</label>
                  <input id="eb-title" className="input-field" placeholder="Ej: Guía de Marketing Digital" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="eb-desc">Descripción</label>
                  <textarea id="eb-desc" className="input-field" placeholder="Describe de qué trata tu e-book..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="eb-price">Precio (ARS) *</label>
                    <input id="eb-price" type="number" className="input-field" placeholder="5000" min="1" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="eb-commission">Comisión afiliado %</label>
                    <input id="eb-commission" type="number" className="input-field" min="0" max="100" value={formData.commission_percent} onChange={(e) => setFormData({ ...formData, commission_percent: e.target.value })} />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="eb-category">Categoría</label>
                  <select id="eb-category" className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Cover upload */}
                <div className="input-group">
                  <label className="input-label">Portada (imagen)</label>
                  <div
                    className="drop-zone"
                    onClick={() => coverInputRef.current?.click()}
                    style={{ padding: 'var(--space-lg)' }}
                  >
                    {coverFile ? (
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>📷 {coverFile.name}</p>
                    ) : (
                      <>
                        <Upload size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto var(--space-sm)' }} />
                        <p className="drop-zone-text">Click para subir portada</p>
                        <p className="drop-zone-hint">JPG, PNG — Max 5MB</p>
                      </>
                    )}
                  </div>
                  <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                </div>

                {/* Ebook file upload */}
                <div className="input-group">
                  <label className="input-label">Archivo del E-Book *</label>
                  <div
                    className="drop-zone"
                    onClick={() => ebookInputRef.current?.click()}
                    style={{ padding: 'var(--space-lg)' }}
                  >
                    {ebookFile ? (
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>📄 {ebookFile.name}</p>
                    ) : (
                      <>
                        <Upload size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto var(--space-sm)' }} />
                        <p className="drop-zone-text">Click para subir e-book</p>
                        <p className="drop-zone-hint">PDF, EPUB — Max 50MB</p>
                      </>
                    )}
                  </div>
                  <input ref={ebookInputRef} type="file" accept=".pdf,.epub" style={{ display: 'none' }} onChange={(e) => setEbookFile(e.target.files?.[0] || null)} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>
                    <Plus size={16} /> Publicar
                  </>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
