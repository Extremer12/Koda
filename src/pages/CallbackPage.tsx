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
          .select('role, full_name')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            // Si el nombre es genérico o el rol es el default, podríamos preguntar.
            // Para asegurar la petición del usuario: redirigir a select-role si es su primera vez 
            // (podemos usar un flag en localStorage o simplemente ver si el perfil está incompleto)
            // Por simplicidad y cumplimiento del pedido:
            const isNewUser = session.user.app_metadata.provider === 'google' && (!data?.role || data?.role === 'affiliate');
            
            if (isNewUser && !localStorage.getItem('role_selected')) {
              navigate('/select-role', { replace: true });
            } else if (data?.role === 'creator') {
              navigate('/dashboard/creator', { replace: true });
            } else {
              navigate('/', { replace: true });
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
