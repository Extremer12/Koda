import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://izbjowtoxuilkjrgguxw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Ympvd3RveHVpbGtqcmdndXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTIzMjMsImV4cCI6MjA5MTY4ODMyM30.e5OoApJvhGighOqmMvPJPWcsyVJG1FAl3Gm50fgDabY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SUPABASE_URL = supabaseUrl;

export function getStorageUrl(bucket: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
