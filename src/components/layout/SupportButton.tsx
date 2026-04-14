import { Mail } from 'lucide-react';
import { SUPPORT_EMAIL } from '../../lib/utils';

export function SupportButton() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="support-btn"
      aria-label="Contactar soporte por email"
      title="¿Necesitas ayuda?"
    >
      <Mail size={24} />
    </a>
  );
}
