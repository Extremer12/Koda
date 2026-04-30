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
    
    // Validaciones iniciales
    if (!formData.title.trim() || !formData.price || !ebookFile) {
      toast.error('Completa el título, precio y selecciona el archivo del e-book');
      return;
    }

    // Validación de Portada (si existe)
    if (coverFile) {
      const validCoverTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validCoverTypes.includes(coverFile.type)) {
        toast.error('La portada debe ser una imagen (JPG, PNG o WEBP)');
        return;
      }
      if (coverFile.size > 5 * 1024 * 1024) { // 5MB
        toast.error('La portada no debe superar los 5MB');
        return;
      }
    }

    // Validación de E-book
    const validEbookTypes = ['application/pdf', 'application/epub+zip'];
    if (!validEbookTypes.includes(ebookFile.type) && !ebookFile.name.endsWith('.epub')) {
      toast.error('El formato del e-book debe ser PDF o EPUB');
      return;
    }
    if (ebookFile.size > 100 * 1024 * 1024) { // 100MB
      toast.error('El e-book no debe superar los 100MB');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Preparando archivos...');
    try {
      const timestamp = Date.now();
      let coverUrl = '';
      
      if (coverFile) {
        toast.loading(`Subiendo portada: ${Math.round(coverFile.size / 1024)}KB...`, { id: toastId });
        const coverExt = coverFile.name.split('.').pop();
        const coverPath = `${user!.id}/${timestamp}-cover.${coverExt}`;
        const { error: coverErr } = await supabase.storage.from('covers').upload(coverPath, coverFile);
        if (coverErr) throw new Error(`Error en portada: ${coverErr.message}`);
        const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(coverPath);
        coverUrl = publicUrl;
      }

      toast.loading(`Subiendo e-book: ${Math.round(ebookFile.size / (1024 * 1024))}MB (no cierres esta ventana)...`, { id: toastId });
      const ebookExt = ebookFile.name.split('.').pop();
      const ebookPath = `${user!.id}/${timestamp}-ebook.${ebookExt}`;
      const { error: ebookErr } = await supabase.storage.from('ebooks').upload(ebookPath, ebookFile);
      if (ebookErr) throw new Error(`Error en e-book: ${ebookErr.message}`);

      toast.loading('Registrando en la base de datos...', { id: toastId });
      const { error: dbError } = await supabase.from('ebooks').insert({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        cover_url: coverUrl || null,
        file_url: ebookPath,
        creator_id: user!.id,
        category: formData.category,
        commission_percent: parseInt(formData.commission_percent),
      });

      if (dbError) throw dbError;

      toast.success('¡E-book publicado con éxito!', { id: toastId });
      setShowForm(false);
      setFormData({ title: '', description: '', price: '', category: 'general', commission_percent: '30' });
      setCoverFile(null);
      setEbookFile(null);
      refetchEbooks();
    } catch (err) {
      console.error('Error publishing:', err);
      toast.error(err instanceof Error ? err.message : 'Fallo en la publicación. Inténtalo de nuevo.', { id: toastId });
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
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
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

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-outline-variant/5">
                {ebooksLoading ? (
                   <div className="px-6 py-12 text-center text-[10px] uppercase tracking-widest opacity-40 italic">Cargando...</div>
                ) : ebooks.length === 0 ? (
                  <div className="px-6 py-12 text-center text-[10px] uppercase tracking-widest opacity-40 italic">Sin e-books publicados</div>
                ) : ebooks.map((eb) => (
                  <div key={eb.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="font-headline font-bold text-sm text-on-surface">{eb.title}</span>
                      <button
                        onClick={() => toggleEbook(eb.id, eb.is_active)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${eb.is_active ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {eb.is_active ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-headline font-black text-lg text-primary">{formatPrice(eb.price)}</span>
                      <span className={`px-2 py-0.5 text-[8px] font-black border ${eb.is_active ? 'border-primary text-primary' : 'border-error text-error'}`}>
                        {eb.is_active ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </div>
                  </div>
                ))}
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
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
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

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-outline-variant/5">
                {salesLoading ? (
                  <div className="px-6 py-12 text-center text-[10px] uppercase tracking-widest opacity-40 italic">Cargando...</div>
                ) : sales.length === 0 ? (
                  <div className="px-6 py-12 text-center text-[10px] uppercase tracking-widest opacity-40 italic">Sin ventas registradas</div>
                ) : sales.slice(0, 10).map((s) => (
                  <div key={s.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block font-headline font-bold text-sm text-on-surface">{(s as any).ebook?.title || '—'}</span>
                        <span className="block font-label text-[8px] uppercase tracking-widest text-on-surface-variant opacity-40 mt-1">{formatDate(s.created_at)}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[8px] font-black border ${
                        s.status === 'approved' ? 'border-primary text-primary' : 'border-tertiary text-tertiary'
                      }`}>
                        {s.status === 'approved' ? 'OK' : s.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-40">Neto</span>
                      <span className="font-headline font-black text-lg text-primary">{formatPrice(s.creator_amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Full Screen Ebook Form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] bg-surface flex flex-col animate-fade-in overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-24">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-2 block">Nueva Publicación</span>
                <h2 className="font-headline font-black text-3xl md:text-5xl text-on-surface uppercase tracking-tight">Cargar Contenido</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 flex items-center gap-4 group cursor-help relative">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface">Requisitos</span>
                    <span className="text-[8px] uppercase tracking-widest text-on-surface-variant opacity-60">PDF/EPUB · Máx 100MB</span>
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute top-full right-0 mt-4 w-64 bg-on-surface text-white p-6 rounded-3xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-20">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Guía Técnica</p>
                    <ul className="space-y-2 text-[10px] opacity-70">
                      <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Portada: JPG o PNG (Recomendado 1200x1600px)</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> E-book: Formato PDF o EPUB</li>
                      <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Peso: Máximo 100MB por archivo</li>
                    </ul>
                  </div>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="w-12 h-12 rounded-full border border-outline-variant/10 flex items-center justify-center hover:bg-surface-container-low transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-12 pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="eb-title">Título de la Obra</label>
                    <input 
                      id="eb-title" 
                      className="w-full bg-transparent border-b-2 border-outline-variant/10 py-4 font-headline font-bold text-xl md:text-2xl uppercase tracking-tight focus:outline-none focus:border-primary transition-colors placeholder:opacity-20" 
                      placeholder="ESCRIBE EL TÍTULO AQUÍ" 
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="eb-price">Precio Base (ARS)</label>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 font-headline font-bold text-xl opacity-30">$</span>
                      <input 
                        id="eb-price" 
                        type="number"
                        className="w-full bg-transparent border-b-2 border-outline-variant/10 pl-6 py-4 font-headline font-bold text-xl md:text-2xl uppercase tracking-tight focus:outline-none focus:border-primary transition-colors placeholder:opacity-20" 
                        placeholder="0.00" 
                        value={formData.price} 
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="eb-category">Categoría</label>
                    <select 
                      id="eb-category" 
                      className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl px-6 py-5 font-label text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4 bg-primary/5 p-8 rounded-3xl border border-primary/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-label text-[10px] uppercase tracking-widest font-bold text-primary" htmlFor="eb-comm">Comisión Afiliados (%)</label>
                      <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full">{formData.commission_percent}%</span>
                    </div>
                    <input 
                      id="eb-comm" 
                      type="range"
                      max="90"
                      min="5"
                      step="5"
                      className="w-full h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary" 
                      value={formData.commission_percent} 
                      onChange={(e) => setFormData({ ...formData, commission_percent: e.target.value })} 
                      required 
                    />
                    <p className="text-[9px] uppercase tracking-widest text-primary/60 font-medium">Recomendamos 40% para maximizar el alcance a través de socios.</p>
                  </div>
                </div>

                <div className="space-y-10">
                   <div className="space-y-4">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Diseño de Portada</label>
                    <div 
                      onClick={() => coverInputRef.current?.click()}
                      className={`relative aspect-[3/4] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                        coverFile ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-primary/50'
                      }`}
                    >
                      {coverFile ? (
                        <div className="text-center p-6">
                           <span className="material-symbols-outlined text-primary text-5xl mb-4">check_circle</span>
                           <p className="font-label text-xs font-bold uppercase tracking-widest text-primary">{coverFile.name}</p>
                           <button className="mt-4 text-[10px] text-on-surface-variant uppercase tracking-widest underline">Cambiar imagen</button>
                        </div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-on-surface-variant text-5xl opacity-20 mb-4">add_photo_alternate</span>
                          <span className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-40">Subir Portada (JPG/PNG)</span>
                        </>
                      )}
                    </div>
                    <input ref={coverInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                  </div>

                  <div className="space-y-4">
                    <label className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Archivo Digital (E-book)</label>
                    <div 
                      onClick={() => ebookInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        ebookFile ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-primary/50'
                      }`}
                    >
                      {ebookFile ? (
                        <div className="text-center">
                           <span className="material-symbols-outlined text-primary text-5xl mb-4">task</span>
                           <p className="font-label text-xs font-bold uppercase tracking-widest text-primary max-w-[200px] truncate">{ebookFile.name}</p>
                           <p className="text-[10px] text-primary/60 mt-1 uppercase tracking-widest">{(ebookFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                           <button className="mt-4 text-[10px] text-on-surface-variant uppercase tracking-widest underline">Cambiar archivo</button>
                        </div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-on-surface-variant text-5xl opacity-20 mb-4">upload_file</span>
                          <span className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-40">Subir PDF o EPUB</span>
                        </>
                      )}
                    </div>
                    <input ref={ebookInputRef} type="file" accept=".pdf,.epub" style={{ display: 'none' }} onChange={(e) => setEbookFile(e.target.files?.[0] || null)} />
                  </div>
                </div>
              </div>

              <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-outline-variant/10">
                <div className="flex items-center gap-4 max-w-sm">
                  <span className="material-symbols-outlined text-primary opacity-40">gavel</span>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-on-surface-variant opacity-40 text-center md:text-left leading-relaxed">
                    Al publicar, confirmas que posees los derechos de autor de esta obra y aceptas nuestros términos.
                  </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="flex-1 md:flex-none px-10 py-5 font-label text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant hover:text-on-surface transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className={`flex-1 md:flex-none px-12 py-5 rounded-full font-label text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${
                      submitting 
                        ? 'bg-outline-variant/20 text-on-surface/20 cursor-not-allowed' 
                        : 'bg-primary text-on-primary hover:brightness-110 active:scale-95 shadow-primary/20'
                    }`}
                  >
                    {submitting ? 'PROCESANDO...' : 'PUBLICAR AHORA'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
