
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const useSessionCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/collection');
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
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
