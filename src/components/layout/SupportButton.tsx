import { SUPPORT_EMAIL } from '../../lib/utils';

export function SupportButton() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="fixed bottom-8 right-8 z-[60] bg-on-background text-white w-14 h-14 rounded-none flex items-center justify-center shadow-2xl hover:bg-primary transition-all duration-300 hover:scale-110 active:scale-95 group"
      aria-label="Contactar soporte por email"
      title="¿Necesitas ayuda?"
    >
      <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">mail</span>
    </a>
  );
}
