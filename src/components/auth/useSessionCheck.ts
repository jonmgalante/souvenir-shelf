
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const useSessionCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkComplete, setCheckComplete] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Handle hash fragment for OAuth redirects
    const handleHashFragment = () => {
      // Look for both hash fragment and query parameter formats
      const hashFragment = window.location.hash;
      const queryParams = new URLSearchParams(window.location.search);
      const accessToken = queryParams.get('access_token');
      
      if ((hashFragment && hashFragment.includes('access_token')) || accessToken) {
        console.log('useSessionCheck - Found access_token, redirecting to collection');
        
        // Important: Wait a moment to let Supabase process the token before redirecting
        setTimeout(() => {
          if (mounted) {
            navigate('/collection', { replace: true });
          }
        }, 100);
        
        return true;
      }
      return false;
    };
    
    const checkSession = async () => {
      try {
        // First check if we have an access token in the URL
        if (handleHashFragment()) {
          return;
        }
        
        const { data } = await supabase.auth.getSession();
        const sessionExists = !!data.session;
        
        console.log('useSessionCheck - Session check:', sessionExists ? 'Session found' : 'No session');
        
        if (mounted) {
          setHasSession(sessionExists);
          
          // Only redirect if we're on the auth page and have a session
          if (sessionExists && location.pathname === '/auth') {
            console.log('useSessionCheck - On auth page with session, redirecting to collection');
            navigate('/collection', { replace: true });
          }
          
          setCheckComplete(true);
        }
      } catch (error) {
        console.error('useSessionCheck - Error checking session:', error);
        if (mounted) {
          setHasSession(false);
          setCheckComplete(true);
        }
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('useSessionCheck - Auth state changed:', event);
      
      if (mounted) {
        if (event === 'SIGNED_IN' && session) {
          console.log('useSessionCheck - User signed in, redirecting to collection');
          navigate('/collection', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          console.log('useSessionCheck - User signed out');
          if (location.pathname !== '/auth') {
            navigate('/auth', { replace: true });
          }
        }
      }
    });
    
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return { checkComplete, hasSession };
};

export default useSessionCheck;
