import { Link } from 'react-router-dom';
import { Ebook } from '../../types/database';
import { formatPrice } from '../../lib/utils';

interface EbookCardProps {
  ebook: Ebook;
  refCode?: string;
  isLarge?: boolean; // Kept for compatibility but design is uniform now
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
  const creatorName = (ebook as any).creator?.full_name || 'Autor Desconocido';
  
  // Decide badge styling based on category or price as a mock feature
  const isTop = ebook.price > 15;
  const badgeClass = isTop ? 'bg-primary' : 'bg-secondary';
  const badgeText = isTop ? 'Top' : 'Nuevo';

  return (
    <Link to={link} className="group bg-white rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 block h-full flex flex-col border border-outline-variant/10 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
      <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4 relative bg-surface-container-low">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={ebook.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80'} 
          alt={ebook.title} 
        />
        <div className="absolute top-2 left-2">
          <span className={`${badgeClass} text-[10px] text-white px-2 py-1 rounded font-bold tracking-widest uppercase shadow-sm`}>
            {categoryLabels[ebook.category] || badgeText}
          </span>
        </div>
      </div>
      
      <h3 className="font-bold text-on-surface leading-tight mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
        {ebook.title}
      </h3>
      <p className="text-xs text-on-surface-variant mb-4">
        {creatorName}
      </p>
      
      <div className="mt-auto flex items-center justify-between">
        <span className="font-black text-primary text-sm md:text-base">{formatPrice(ebook.price)}</span>
        <button 
          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-surface text-primary hover:bg-primary hover:text-white transition-colors active:scale-95"
          onClick={() => {
            // Prevent navigating to the link when clicking the "add to cart" area
            // Currently it will act as navigating anyway unless we stop propagation, but since there's no actual cart, let it navigate.
            // e.preventDefault();
          }}
        >
          <span className="material-symbols-outlined text-sm md:text-base">add_shopping_cart</span>
        </button>
      </div>
    </Link>
  );
}
