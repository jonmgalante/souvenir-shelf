
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const useSessionCheck = () => {
  const navigate = useNavigate();
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('useSessionCheck - Session check:', data.session ? 'Session found' : 'No session');
        
        if (data.session) {
          console.log('useSessionCheck - Redirecting to collection');
          navigate('/collection');
        }
        
        setCheckComplete(true);
      } catch (error) {
        console.error('useSessionCheck - Error checking session:', error);
        setCheckComplete(true);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('useSessionCheck - Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        console.log('useSessionCheck - User signed in, redirecting to collection');
        navigate('/collection');
      }
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  return { checkComplete };
};

export default useSessionCheck;
