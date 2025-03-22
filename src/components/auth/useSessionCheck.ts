
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const useSessionCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Session check:', data.session ? 'Session found' : 'No session');
      if (data.session) {
        navigate('/collection');
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        navigate('/collection');
      }
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, [navigate]);
};

export default useSessionCheck;
