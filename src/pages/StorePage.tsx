import { useState } from 'react';
import { useEbooks } from '../hooks/useEbooks';
import { EbookCard } from '../components/store/EbookCard';
import { CATEGORIES } from '../lib/utils';

export function StorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { ebooks, loading } = useEbooks(category);

  const filtered = search
    ? ebooks.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description?.toLowerCase().includes(search.toLowerCase())
      )
    : [...ebooks];

  if (sortBy === 'popular') {
    filtered.sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0));
  } else if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  const currentCategoryLabel = CATEGORIES.find(c => c.id === category)?.label || 'Todas';

  return (
    <main className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-0 mt-0 relative min-h-screen">
      {/* Sidebar - Visible from LG */}
      <aside className="hidden lg:flex h-[calc(100vh-88px)] w-72 sticky top-[88px] flex-col gap-2 p-8 bg-white border-r border-outline-variant/10 shadow-[20px_0_40px_rgba(0,0,0,0.02)] z-10">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-on-surface uppercase tracking-tighter">Explorar</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant opacity-50 mt-1">Categorías de la tienda</p>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto no-scrollbar pr-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-left group ${
                category === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold scale-[1.02]'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface hover:translate-x-1'
              }`}
            >
              <span className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${category === cat.id ? 'fill-1' : ''}`}>
                {getCategoryIcon(cat.id)}
              </span>
              <span className="text-sm font-medium tracking-tight">{cat.label === 'Todos' ? 'Todas' : cat.label}</span>
            </button>
          ))}
        </nav>
        
      </aside>

      {/* Main Content */}
      <section className="flex-1 px-4 md:px-8 lg:px-12 py-8 min-w-0 bg-surface">
        {/* Hero Section - Light & Integrated */}
        <header className="relative mb-20 pt-12 md:pt-24 pb-12 overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -z-10 animate-pulse"></div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in stagger-1">
              <div className="inline-flex items-center gap-2 mb-8">
                <span className="w-8 h-[1px] bg-primary"></span>
                <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">Biblioteca Luminosa</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-on-surface tracking-[-0.05em] leading-[0.85] mb-10 uppercase">
                E-books <br /> 
                <span className="text-primary italic">Premium.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-on-surface-variant mb-12 font-medium max-w-lg leading-relaxed opacity-60">
                La curaduría más refinada de autores independientes. Conocimiento diseñado para ser devorado.
              </p>
              
              <div className="relative max-w-xl group">
                <input 
                  className="w-full bg-white border border-outline-variant/10 px-16 py-6 rounded-full text-lg font-bold uppercase tracking-tight shadow-xl shadow-on-surface/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                  placeholder="Buscar títulos, temas..." 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-30 group-focus-within:text-primary transition-colors text-3xl">search</span>
              </div>
            </div>

            <div className="hidden xl:flex justify-center relative animate-fade-in stagger-2">
              <div className="relative w-[400px] aspect-[3/4] group">
                {/* Visual shadow/decoration behind */}
                <div className="absolute -inset-8 bg-primary/5 blur-3xl rounded-full scale-90 group-hover:scale-110 transition-transform duration-1000"></div>
                
                <img 
                  alt="Featured Book" 
                  className="w-full h-full object-cover rounded-[2rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] transform group-hover:scale-[1.02] group-hover:rotate-1 transition-all duration-700" 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
                />
                
                <div className="absolute bottom-8 -right-8 bg-white p-8 rounded-[2rem] shadow-2xl border border-outline-variant/5 animate-float">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Destacado de la semana</span>
                  <span className="block text-xl font-black text-on-surface uppercase tracking-tight max-w-[150px]">Teoría de la Estética</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Categories Mobile Horizontal Scroll */}
        <div className="lg:hidden mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar flex gap-2 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full transition-all border ${
                category === cat.id
                  ? 'bg-primary border-primary text-white font-bold shadow-lg shadow-primary/20'
                  : 'bg-white border-outline-variant/10 text-on-surface-variant font-medium'
              }`}
            >
              <span className={`material-symbols-outlined text-sm ${category === cat.id ? 'fill-1' : ''}`}>
                {getCategoryIcon(cat.id)}
              </span>
              <span className="text-[10px] uppercase tracking-widest">{cat.label === 'Todos' ? 'Todas' : cat.label}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black text-on-surface tracking-tighter uppercase mb-2">Novedades</h2>
            <div className="h-1 w-12 bg-primary rounded-full"></div>
          </div>
          
          <div className="flex gap-4 items-center">
            <span className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant opacity-40">Ordenar por</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-sm text-on-surface outline-none cursor-pointer hover:text-primary transition-colors"
            >
              <option value="recent">Recientes</option>
              <option value="popular">Más Populares</option>
              <option value="price_asc">Precio: Bajo a Alto</option>
              <option value="price_desc">Precio: Alto a Bajo</option>
            </select>
          </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
             {[...Array(10)].map((_, i) => (
               <div key={i} className="animate-pulse bg-white rounded-xl p-4 border border-outline-variant/10">
                 <div className="aspect-[2/3] bg-surface-container-low rounded-lg mb-4"></div>
                 <div className="h-4 bg-surface-container-low rounded w-3/4 mb-2"></div>
                 <div className="h-3 bg-surface-container-low rounded w-1/2 mb-4"></div>
                 <div className="flex justify-between items-center">
                   <div className="h-5 bg-surface-container-low rounded w-1/4"></div>
                   <div className="h-8 w-8 bg-surface-container-low rounded-full"></div>
                 </div>
               </div>
             ))}
           </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
            {filtered.map((ebook, i) => (
              <div 
                key={ebook.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${(i % 8) * 0.1}s` }}
              >
                <EbookCard ebook={ebook} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-outline-variant/10 shadow-sm animate-fade-in">
            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-30">search_off</span>
            </div>
            <h3 className="font-black text-2xl text-on-surface uppercase tracking-tight">Sin resultados</h3>
            <p className="text-on-surface-variant mt-2 max-w-xs mx-auto font-medium">
              No encontramos e-books en la categoría <span className="text-primary">"{currentCategoryLabel}"</span> con esos términos.
            </p>
            <button 
              onClick={() => {setSearch(''); setCategory('all');}}
              className="mt-8 text-primary font-black text-[10px] uppercase tracking-[0.2em] underline underline-offset-8 hover:opacity-70 transition-opacity"
            >
              Ver todo el catálogo
            </button>
          </div>
        )}


      </section>

      {/* Bottom Sheet - Mobile Only */}
      {isCategoryModalOpen && (
        <>
          <div 
            className="bottom-sheet-overlay" 
            onClick={() => setIsCategoryModalOpen(false)}
          />
          <div className="bottom-sheet-content">
            <div className="bottom-sheet-handle" />
            <div className="px-8 pb-12">
              <header className="mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Categorías</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-50">Selecciona un tema para filtrar</p>
              </header>
              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      setIsCategoryModalOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all text-left ${
                      category === cat.id
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                        : 'bg-surface-container-low text-on-surface active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {getCategoryIcon(cat.id)}
                    </span>
                    <span className="font-bold uppercase text-[10px] tracking-[0.1em]">{cat.label}</span>
                    {category === cat.id && (
                      <span className="material-symbols-outlined ml-auto text-sm">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function getCategoryIcon(id: string) {
  switch (id) {
    case 'all': return 'widgets';
    case 'programacion': return 'memory';
    case 'diseno': return 'palette';
    case 'negocios': return 'business_center';
    case 'marketing': return 'campaign';
    case 'desarrollo-personal': return 'self_improvement';
    case 'finanzas': return 'payments';
    case 'productividad': return 'bolt';
    case 'idiomas': return 'language';
    case 'salud': return 'favorite';
    default: return 'menu_book';
  }
}
