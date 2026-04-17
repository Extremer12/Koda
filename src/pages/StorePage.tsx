import { useState } from 'react';
import { useEbooks } from '../hooks/useEbooks';
import { EbookCard } from '../components/store/EbookCard';
import { CATEGORIES } from '../lib/utils';

export function StorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { ebooks, loading } = useEbooks(category);

  const filtered = search
    ? ebooks.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description?.toLowerCase().includes(search.toLowerCase())
      )
    : ebooks;

  return (
    <main className="max-w-[1920px] mx-auto flex gap-0 mt-0">
      {/* SideNavBar / Categorías */}
      <aside className="hidden xl:flex h-[calc(100vh-88px)] w-64 sticky top-[88px] flex-col gap-2 p-6 bg-surface border-r border-outline-variant/10 text-sm">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-on-surface">Categorías</h3>
          <p className="text-xs text-on-surface-variant">Explora el catálogo</p>
        </div>
        <nav className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                category === cat.id
                  ? 'bg-white text-primary shadow-sm hover:translate-x-1 font-bold'
                  : 'text-on-surface-variant hover:bg-white hover:text-on-surface hover:translate-x-1'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: category === cat.id ? "'FILL' 1" : "'FILL' 0" }}>
                {cat.id === 'all' ? 'widgets' : 
                 cat.id === 'programacion' ? 'memory' : 
                 cat.id === 'diseno' ? 'palette' : 
                 cat.id === 'negocios' ? 'business_center' : 
                 cat.id === 'marketing' ? 'campaign' : 
                 'menu_book'}
              </span>
              <span>{cat.label === 'Todos' ? 'Todas' : cat.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 bg-secondary-container rounded-xl border border-secondary-container">
          <p className="font-bold text-on-secondary-container text-xs mb-1">MEMBRESÍA KODA+</p>
          <p className="text-[10px] text-on-secondary-container opacity-80 leading-relaxed mb-3">Lectura ilimitada en miles de títulos seleccionados.</p>
          <button className="w-full bg-secondary text-white py-2 rounded-lg text-xs font-bold active:scale-95 transition-all shadow-md shadow-secondary/20 hover:bg-secondary-dim">Unirse ahora</button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 px-6 lg:px-12 py-8 min-w-0 bg-surface">
        {/* Hero Section */}
        <header className="relative overflow-hidden rounded-3xl mb-12 p-8 md:p-12 flex flex-col justify-center min-h-[400px] hero-gradient group">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-on-primary tracking-tighter leading-[1.1] mb-6">
              Descubre tu próxima gran historia
            </h1>
            <p className="text-base md:text-lg text-on-primary/80 mb-8 font-medium">
              Miles de e-books seleccionados para mentes curiosas. La biblioteca digital más clara y elegante del mundo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="flex-1 relative">
                <input 
                  className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all outline-none" 
                  placeholder="¿Qué quieres leer hoy?" 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-4 top-4 text-white/60">auto_awesome</span>
              </div>
            </div>
          </div>
          <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 w-[280px] h-[400px] rotate-6 group-hover:rotate-3 transition-transform duration-700">
            <div className="w-full h-full bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4">
              <img 
                alt="Featured Book" 
                className="w-full h-full object-cover rounded-xl" 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
              />
            </div>
          </div>
        </header>

        {/* Product Grid */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-on-surface tracking-tight mb-1">Novedades Destacadas</h2>
            <p className="text-on-surface-variant text-sm">Los lanzamientos más esperados de la colección</p>
          </div>
          {/* Mobile Categories Dropdown */}
          <div className="xl:hidden flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
             {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  category === cat.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white text-on-surface-variant border border-outline-variant/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center py-24">
             <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filtered.map((ebook, i) => (
              <div 
                key={ebook.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${(i % 10) * 0.05}s` }}
              >
                <EbookCard ebook={ebook} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-outline-variant/10">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40 mb-4 block">
              search_off
            </span>
            <h3 className="font-headline font-bold text-xl text-on-surface">No se encontraron títulos</h3>
            <p className="text-sm mt-2 text-on-surface-variant">
              Intenta con otra búsqueda o categoría.
            </p>
          </div>
        )}

        {/* Promotion Banner */}
        <div className="mt-16 bg-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-outline-variant/10 shadow-sm luminous-shadow">
          <div className="max-w-md">
            <span className="text-secondary font-bold text-xs tracking-widest uppercase mb-2 block">Oferta Limitada</span>
            <h2 className="text-3xl font-black text-on-surface tracking-tight mb-4">Pack de Iniciación: 5 E-books por $25</h2>
            <p className="text-on-surface-variant text-sm mb-6">Elige tus 5 historias favoritas de la selección editorial y ahorra más del 50% en tu primera compra.</p>
            <button className="bg-primary text-white flex items-center justify-center w-full md:w-auto px-8 py-3 rounded-lg font-bold hover:bg-primary-dim hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
              Crear mi pack
            </button>
          </div>
          <div className="flex -space-x-4">
            <img alt="Book 1" className="w-24 h-36 object-cover rounded-md shadow-lg border-2 border-white rotate-[-10deg]" src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200"/>
            <img alt="Book 2" className="w-24 h-36 object-cover rounded-md shadow-lg border-2 border-white rotate-0 z-10" src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200"/>
            <img alt="Book 3" className="w-24 h-36 object-cover rounded-md shadow-lg border-2 border-white rotate-[10deg]" src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200"/>
          </div>
        </div>
      </section>
    </main>
  );
}
