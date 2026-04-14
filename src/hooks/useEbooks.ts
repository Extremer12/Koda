import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Ebook } from '../types/database';

export function useEbooks(category?: string) {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEbooks = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('ebooks')
        .select('*, creator:profiles!ebooks_creator_id_fkey(id, full_name, avatar_url)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEbooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar e-books');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchEbooks();
  }, [fetchEbooks]);

  return { ebooks, loading, error, refetch: fetchEbooks };
}

export function useEbook(id: string | undefined) {
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchEbook() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ebooks')
          .select('*, creator:profiles!ebooks_creator_id_fkey(id, full_name, avatar_url)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEbook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'E-book no encontrado');
      } finally {
        setLoading(false);
      }
    }

    fetchEbook();
  }, [id]);

  return { ebook, loading, error };
}

export function useCreatorEbooks(creatorId: string | undefined) {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEbooks = useCallback(async () => {
    if (!creatorId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEbooks(data || []);
    } catch (err) {
      console.error('Error fetching creator ebooks:', err);
    } finally {
      setLoading(false);
    }
  }, [creatorId]);

  useEffect(() => {
    fetchEbooks();
  }, [fetchEbooks]);

  return { ebooks, loading, refetch: fetchEbooks };
}
