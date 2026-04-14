import { Link } from 'react-router-dom';
import { Ebook } from '../../types/database';
import { formatPrice } from '../../lib/utils';

interface EbookCardProps {
  ebook: Ebook;
  refCode?: string;
}

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

export function EbookCard({ ebook, refCode }: EbookCardProps) {
  const link = refCode ? `/ebook/${ebook.id}?ref=${refCode}` : `/ebook/${ebook.id}`;
  const creatorName = (ebook as any).creator?.full_name || 'Autor';

  return (
    <Link to={link} className="ebook-card animate-scale-in" aria-label={`Ver ${ebook.title}`}>
      <div className="ebook-card-cover">
        {ebook.cover_url ? (
          <img src={ebook.cover_url} alt={ebook.title} loading="lazy" />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))',
            fontSize: '3rem',
            opacity: 0.3,
          }}>
            📖
          </div>
        )}
        <div className="ebook-card-cover-overlay" />
        <div className="ebook-card-category">
          <span className="badge badge-accent">
            {categoryLabels[ebook.category] || ebook.category}
          </span>
        </div>
      </div>
      <div className="ebook-card-body">
        <h3 className="ebook-card-title">{ebook.title}</h3>
        {ebook.description && (
          <p className="ebook-card-description">{ebook.description}</p>
        )}
      </div>
      <div className="ebook-card-footer">
        <span className="ebook-card-price">{formatPrice(ebook.price)}</span>
        <span className="ebook-card-creator">por {creatorName}</span>
      </div>
    </Link>
  );
}
