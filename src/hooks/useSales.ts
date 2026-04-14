import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Sale } from '../types/database';

export function useCreatorSales(creatorId: string | undefined) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalBooks: 0,
    approvedSales: 0,
  });

  const fetchSales = useCallback(async () => {
    if (!creatorId) return;
    try {
      setLoading(true);
      
      // Get creator's ebook IDs
      const { data: ebooks } = await supabase
        .from('ebooks')
        .select('id')
        .eq('creator_id', creatorId);
      
      if (!ebooks || ebooks.length === 0) {
        setSales([]);
        setStats({ totalSales: 0, totalRevenue: 0, totalBooks: ebooks?.length || 0, approvedSales: 0 });
        setLoading(false);
        return;
      }

      const ebookIds = ebooks.map(e => e.id);

      const { data, error } = await supabase
        .from('sales')
        .select('*, ebook:ebooks(id, title, cover_url)')
        .in('ebook_id', ebookIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const salesData = data || [];
      setSales(salesData);

      const approved = salesData.filter(s => s.status === 'approved');
      setStats({
        totalSales: salesData.length,
        totalRevenue: approved.reduce((sum, s) => sum + Number(s.creator_amount), 0),
        totalBooks: ebooks.length,
        approvedSales: approved.length,
      });
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  }, [creatorId]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return { sales, stats, loading, refetch: fetchSales };
}

export function useAffiliateSales(affiliateId: string | undefined) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalSales: 0,
    totalCommissions: 0,
    conversionRate: 0,
  });

  const fetchSales = useCallback(async () => {
    if (!affiliateId) return;
    try {
      setLoading(true);
      
      // Get affiliations for clicks
      const { data: affiliations } = await supabase
        .from('affiliations')
        .select('*')
        .eq('affiliate_id', affiliateId);

      // Get sales
      const { data: salesData, error } = await supabase
        .from('sales')
        .select('*, ebook:ebooks(id, title, cover_url)')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const sales = salesData || [];
      const clicks = affiliations?.reduce((sum, a) => sum + a.clicks, 0) || 0;
      const approved = sales.filter(s => s.status === 'approved');

      setSales(sales);
      setStats({
        totalClicks: clicks,
        totalSales: approved.length,
        totalCommissions: approved.reduce((sum, s) => sum + Number(s.affiliate_amount), 0),
        conversionRate: clicks > 0 ? (approved.length / clicks) * 100 : 0,
      });
    } catch (err) {
      console.error('Error fetching affiliate sales:', err);
    } finally {
      setLoading(false);
    }
  }, [affiliateId]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return { sales, stats, loading, refetch: fetchSales };
}
