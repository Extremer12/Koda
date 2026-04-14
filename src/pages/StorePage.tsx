import { useState } from 'react';
import { useEbooks } from '../hooks/useEbooks';
import { EbookCard } from '../components/store/EbookCard';
import { Search, BookOpen } from 'lucide-react';
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
    <main className="page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Descubre tu próximo <span className="text-gradient">e-book favorito</span>
          </h1>
          <p className="hero-subtitle">
            Encuentra conocimiento de calidad creado por expertos. Compra en segundos, descarga al instante.
          </p>

          {/* Search */}
          <div className="search-bar" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="search-bar-icon">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar por título o tema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar e-books"
              id="search-ebooks"
            />
          </div>

          {/* Categories */}
          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-chip ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
                aria-label={`Filtrar por ${cat.label}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container" style={{ paddingBottom: 'var(--space-4xl)' }}>
        {loading ? (
          <div className="page-loader">
            <div className="spinner spinner-lg" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-auto-fill" role="list" aria-label="Lista de e-books">
            {filtered.map((ebook, i) => (
              <div key={ebook.id} role="listitem" className={`stagger-${Math.min(i + 1, 5)}`}>
                <EbookCard ebook={ebook} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookOpen size={36} />
            </div>
            <h3 className="empty-state-title">
              {search ? 'Sin resultados' : 'Aún no hay e-books'}
            </h3>
            <p className="empty-state-desc">
              {search
                ? `No encontramos e-books que coincidan con "${search}".`
                : 'Pronto habrá contenido increíble aquí. ¡Vuelve pronto!'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
