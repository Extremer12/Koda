export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'creator' | 'affiliate' | 'admin';
  mercadopago_access_token: string | null;
  mercadopago_refresh_token: string | null;
  mercadopago_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Ebook {
  id: string;
  title: string;
  description: string | null;
  price: number;
  cover_url: string | null;
  file_url: string;
  creator_id: string;
  commission_percent: number;
  is_active: boolean;
  category: string;
  downloads_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  creator?: Profile;
}

export interface Affiliation {
  id: string;
  affiliate_id: string;
  ebook_id: string;
  ref_code: string;
  clicks: number;
  created_at: string;
  // Joined fields
  ebook?: Ebook;
}

export interface Sale {
  id: string;
  ebook_id: string;
  buyer_name: string;
  buyer_email: string;
  affiliate_id: string | null;
  affiliation_id: string | null;
  total_amount: number;
  creator_amount: number;
  affiliate_amount: number;
  platform_fee: number;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  mercadopago_payment_id: string | null;
  mercadopago_preference_id: string | null;
  download_token: string | null;
  download_expires_at: string | null;
  created_at: string;
  // Joined fields
  ebook?: Ebook;
}

export interface CheckoutData {
  buyerName: string;
  buyerEmail: string;
  ebookId: string;
  refCode?: string;
}
