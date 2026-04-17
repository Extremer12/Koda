import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice, formatDate } from '../lib/utils';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  
  const [sales, setSales] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      if (profile?.role !== 'admin') return;
      
      try {
        const [salesRes, usersRes, ebooksRes] = await Promise.all([
          supabase.from('sales').select('*, ebook:ebooks(title)').order('created_at', { ascending: false }).limit(20),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(20),
          supabase.from('ebooks').select('*, creator:profiles(full_name)').order('created_at', { ascending: false }).limit(20)
        ]);

        setSales(salesRes.data || []);
        setUsers(usersRes.data || []);
        setEbooks(ebooksRes.data || []);
      } catch (err) {
        toast.error('Error cargando datos del panel de control');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && profile) {
      fetchAdminData();
    }
  }, [profile, authLoading]);

  if (authLoading) {
    return (
      <main className="bg-surface min-h-screen flex items-center justify-center">
        <div className="h-12 w-[1px] bg-primary animate-curatorial-pulse"></div>
      </main>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const totalPlatformFees = sales.reduce((acc, s) => acc + (s.platform_fee || 0), 0);
  const totalSalesVolume = sales.reduce((acc, s) => acc + (s.total_amount || 0), 0);

  return (
    <main className="bg-surface min-h-screen pt-24 md:pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1920px] mx-auto">
        <header className="mb-16 animate-slide-up">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-error font-black mb-4 block">Control Central</span>
          <h1 className="font-headline font-black text-4xl md:text-6xl text-on-surface uppercase tracking-tight">Panel Administrativo</h1>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: 'account_balance', label: 'Fees Plataforma', value: formatPrice(totalPlatformFees) },
            { icon: 'point_of_sale', label: 'Volumen Total', value: formatPrice(totalSalesVolume) },
            { icon: 'group', label: 'Usuarios', value: users.length },
            { icon: 'library_books', label: 'Ediciones Activas', value: ebooks.length },
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

        {loading ? (
          <div className="flex justify-center py-12"><div className="h-8 w-[1px] bg-primary animate-bounce"></div></div>
        ) : (
          <div className="space-y-12">
            {/* Sales Table */}
            <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight">Transacciones Recientes</h3>
              </div>
              <div className="bg-white border border-[#f1f1ec] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-label text-[10px] uppercase tracking-widest">
                    <thead>
                      <tr className="border-b border-outline-variant/10 text-on-surface-variant opacity-40">
                         <th className="px-6 py-4 font-bold">Fecha</th>
                         <th className="px-6 py-4 font-bold">Edición</th>
                         <th className="px-6 py-4 font-bold">Total</th>
                         <th className="px-6 py-4 font-bold text-error">Fee Plataforma</th>
                         <th className="px-6 py-4 font-bold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {sales.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center opacity-50">Sin ventas recientes</td></tr>
                      ) : sales.map((s) => (
                        <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-6 py-4 opacity-60">{formatDate(s.created_at)}</td>
                          <td className="px-6 py-4 text-on-surface font-bold">{s.ebook?.title || '—'}</td>
                          <td className="px-6 py-4">{formatPrice(s.total_amount)}</td>
                          <td className="px-6 py-4 text-error font-bold">{formatPrice(s.platform_fee)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 text-[8px] font-black border ${
                              s.status === 'approved' ? 'border-primary text-primary' : 'border-tertiary text-tertiary'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Users Table */}
              <section className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mb-8">Usuarios</h3>
                <div className="bg-white border border-[#f1f1ec] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-label text-[10px] uppercase tracking-widest">
                      <thead>
                        <tr className="border-b border-outline-variant/10 text-on-surface-variant opacity-40">
                          <th className="px-6 py-4 font-bold">Email</th>
                          <th className="px-6 py-4 font-bold">Rol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/5">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-6 py-4">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 text-[8px] font-black border border-outline-variant/30 text-on-surface-variant">
                                {u.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Ebooks Table */}
              <section className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <h3 className="font-headline font-bold text-xl text-on-surface uppercase tracking-tight mb-8">Ediciones</h3>
                <div className="bg-white border border-[#f1f1ec] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-label text-[10px] uppercase tracking-widest">
                      <thead>
                        <tr className="border-b border-outline-variant/10 text-on-surface-variant opacity-40">
                          <th className="px-6 py-4 font-bold">Título</th>
                          <th className="px-6 py-4 font-bold">Autor</th>
                          <th className="px-6 py-4 font-bold">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/5">
                        {ebooks.map((e) => (
                          <tr key={e.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-6 py-4 text-on-surface font-bold">{e.title}</td>
                            <td className="px-6 py-4 opacity-60">{e.creator?.full_name || 'Desconocido'}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${e.is_active ? 'bg-primary' : 'bg-error'}`}></span>
                              {e.is_active ? 'Activo' : 'Baja'}
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
        )}
      </div>
    </main>
  );
}
