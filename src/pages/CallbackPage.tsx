import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch profile to determine role
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.role === 'creator') {
              navigate('/dashboard/creator', { replace: true });
            } else {
              navigate('/dashboard/affiliate', { replace: true });
            }
          });
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <main className="page">
      <div className="page-loader">
        <div style={{ textAlign: 'center' }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto var(--space-lg)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Autenticando...</p>
        </div>
      </div>
    </main>
  );
}
