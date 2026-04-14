export const PLATFORM_FEE_PERCENT = 8.5;
export const SUPPORT_EMAIL = 'zioncode25@gmail.com';

export const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'desarrollo-personal', label: 'Desarrollo Personal' },
  { id: 'marketing', label: 'Marketing Digital' },
  { id: 'programacion', label: 'Programación' },
  { id: 'finanzas', label: 'Finanzas' },
  { id: 'negocios', label: 'Negocios' },
  { id: 'diseno', label: 'Diseño' },
  { id: 'productividad', label: 'Productividad' },
  { id: 'idiomas', label: 'Idiomas' },
  { id: 'salud', label: 'Salud y Bienestar' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function generateRefCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function calculateCommissions(
  totalAmount: number,
  commissionPercent: number,
  hasAffiliate: boolean
) {
  const platformFee = totalAmount * (PLATFORM_FEE_PERCENT / 100);
  const affiliateAmount = hasAffiliate
    ? totalAmount * (commissionPercent / 100)
    : 0;
  const creatorAmount = totalAmount - platformFee - affiliateAmount;

  return {
    platformFee: Math.round(platformFee * 100) / 100,
    affiliateAmount: Math.round(affiliateAmount * 100) / 100,
    creatorAmount: Math.round(creatorAmount * 100) / 100,
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
