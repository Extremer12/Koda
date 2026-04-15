import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCreatorEbooks } from '../hooks/useEbooks';
import { useCreatorSales } from '../hooks/useSales';
import { supabase } from '../lib/supabase';
import { formatPrice, formatDate, CATEGORIES } from '../lib/utils';
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
    return (
      <main className="bg-surface min-h-screen flex items-center justify-center">
        <div className="h-12 w-[1px] bg-primary animate-curatorial-pulse"></div>
      </main>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

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
      <main className="bg-surface min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-12 shadow-[0_40px_80px_-20px_rgba(45,47,44,0.1)] border border-[#f1f1ec] text-center">
          <h2 className="font-headline font-bold text-2xl text-on-surface uppercase tracking-tight mb-6">Panel de Creador</h2>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-60 leading-relaxed mb-12">
            Actualmente eres afiliado. ¿Quieres convertirte en creador para publicar tus propios e-books en el archivo?
          </p>
          <button 
            onClick={switchToCreator} 
            className="w-full bg-primary py-4 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95"
          >
            Ser Creador
          </button>
        </div>
      </main>
    );
  }

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
      let coverUrl = '';
      if (coverFile) {
        const coverPath = `${user!.id}/${timestamp}-cover.${coverFile.name.split('.').pop()}`;
        const { error: coverErr } = await supabase.storage.from('covers').upload(coverPath, coverFile);
        if (coverErr) throw coverErr;
        const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(coverPath);
        coverUrl = publicUrl;
      }

      const ebookPath = `${user!.id}/${timestamp}-ebook.${ebookFile.name.split('.').pop()}`;
      const { error: ebookErr } = await supabase.storage.from('ebooks').upload(ebookPath, ebookFile);
      if (ebookErr) throw ebookErr;

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
    <main className="bg-surface min-h-screen pt-24 md:pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1920px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 animate-slide-up">
          <div>
            <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-4 block">Gestión de Archivo</span>
            <h1 className="font-headline font-black text-4xl md:text-6xl text-on-surface uppercase tracking-tight">Panel de Creador</h1>
          </div>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-primary px-8 py-4 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-95 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Nuevo E-Book
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: 'book', label: 'Ediciones', value: stats.totalBooks },
            { icon: 'shopping_cart', label: 'Ventas Totales', value: stats.approvedSales },
            { icon: 'payments', label: 'Ingresos Netos', value: formatPrice(stats.totalRevenue) },
            { icon: 'trending_up', label: 'Tasa de Éxito', value: stats.totalSales > 0 ? `${Math.round((stats.approvedSales / stats.totalSales) * 100)}%` : '0%' },
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

        {/* Chart */}
        <section className="bg-white p-8 md:p-12 border border-[#f1f1ec] mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight">Evolución de Ingresos</h3>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">Últimos 30 días</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7d10e7" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#7d10e7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#2d2f2c', fontSize: 10, fontFamily: 'Inter' }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: '#2d2f2c', fontSize: 10, fontFamily: 'Inter' }} 
                  axisLine={false} 
                  tickLine={false} 
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #f1f1ec', 
                    borderRadius: '0.5rem', 
                    fontSize: '12px', 
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                  }}
                  itemStyle={{ color: '#7d10e7', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="monto" 
                  stroke="#7d10e7" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorMonto)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Tables Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* My Ebooks */}
          <section className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight">Catálogo Propio</h3>
              <span className="font-label text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest">{ebooks.length} Items</span>
            </div>
            <div className="bg-white border border-[#f1f1ec] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-label text-[10px] uppercase tracking-widest">
                  <thead>
                    <tr className="border-b border-outline-variant/10 text-on-surface-variant opacity-40">
                      <th className="px-6 py-4 font-bold">Título</th>
                      <th className="px-6 py-4 font-bold">Precio</th>
                      <th className="px-6 py-4 font-bold">Estado</th>
                      <th className="px-6 py-4 font-bold text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {ebooksLoading ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center">Cargando...</td></tr>
                    ) : ebooks.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center">Sin e-books publicados</td></tr>
                    ) : ebooks.map((eb) => (
                      <tr key={eb.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4 text-on-surface font-bold">{eb.title}</td>
                        <td className="px-6 py-4">{formatPrice(eb.price)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${eb.is_active ? 'bg-primary' : 'bg-error'}`}></span>
                          {eb.is_active ? 'Activo' : 'Inactivo'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => toggleEbook(eb.id, eb.is_active)}
                            className="text-on-surface hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">
                              {eb.is_active ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Recent Sales */}
          <section className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight">Registro de Ventas</h3>
              <span className="font-label text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest">Historial</span>
            </div>
            <div className="bg-white border border-[#f1f1ec] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-label text-[10px] uppercase tracking-widest">
                  <thead>
                    <tr className="border-b border-outline-variant/10 text-on-surface-variant opacity-40">
                      <th className="px-6 py-4 font-bold">Fecha</th>
                      <th className="px-6 py-4 font-bold">Item</th>
                      <th className="px-6 py-4 font-bold">Neto</th>
                      <th className="px-6 py-4 font-bold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {salesLoading ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center">Cargando...</td></tr>
                    ) : sales.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center">Sin ventas registradas</td></tr>
                    ) : sales.slice(0, 10).map((s) => (
                      <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4 opacity-60">{formatDate(s.created_at)}</td>
                        <td className="px-6 py-4 text-on-surface font-bold text-ellipsis overflow-hidden">{(s as any).ebook?.title || '—'}</td>
                        <td className="px-6 py-4 text-primary font-bold">{formatPrice(s.creator_amount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 text-[8px] font-black border ${
                            s.status === 'approved' ? 'border-primary text-primary' : 'border-tertiary text-tertiary'
                          }`}>
                            {s.status === 'approved' ? 'OK' : s.status}
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
      </div>

      {/* New Ebook Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary-dim/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl shadow-[0_80px_160px_-40px_rgba(45,47,44,0.3)] border border-[#f1f1ec] animate-scale-in">
            <div className="p-8 md:p-12 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="font-headline font-bold text-2xl text-on-surface uppercase tracking-tight">Publicar Archivo</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
              >
                close
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="eb-title">Título de la Obra</label>
                    <input 
                      id="eb-title" 
                      className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors" 
                      placeholder="EJ: TEORÍA DEL DISEÑO" 
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="eb-price">Precio Base (ARS)</label>
                    <input 
                      id="eb-price" 
                      type="number"
                      className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-sm uppercase tracking-widest focus:outline-none focus:border-primary transition-colors" 
                      placeholder="0.00" 
                      value={formData.price} 
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="eb-category">Categoría</label>
                    <select 
                      id="eb-category" 
                      className="w-full bg-transparent border-b border-outline-variant/30 py-3 font-label text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary transition-colors"
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-8">
                   <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Portada (JPG/PNG)</label>
                    <div 
                      onClick={() => coverInputRef.current?.click()}
                      className="border border-dashed border-outline-variant/30 h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-primary/40 mb-2">image</span>
                      <span className="font-label text-[8px] uppercase tracking-widest">{coverFile ? coverFile.name : 'Subir Imagen'}</span>
                    </div>
                    <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                  </div>

                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Archivo Principal (PDF/EPUB)</label>
                    <div 
                      onClick={() => ebookInputRef.current?.click()}
                      className="border border-dashed border-outline-variant/30 h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-primary/40 mb-2">upload_file</span>
                      <span className="font-label text-[8px] uppercase tracking-widest">{ebookFile ? ebookFile.name : 'Subir Archivo'}</span>
                    </div>
                    <input ref={ebookInputRef} type="file" accept=".pdf,.epub" style={{ display: 'none' }} onChange={(e) => setEbookFile(e.target.files?.[0] || null)} />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-6">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-primary px-8 py-4 text-on-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:brightness-110 active:scale-95"
                >
                  {submitting ? 'Publicando...' : 'Confirmar Publicación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
