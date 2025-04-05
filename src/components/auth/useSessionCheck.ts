
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const useSessionCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkComplete, setCheckComplete] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;
    
    // Handle immediate redirects from index pages
    if (location.pathname === '/' || 
        location.pathname === '/index' || 
        location.pathname === '/index.html') {
      console.log('useSessionCheck - Detected root or index path, redirecting to collection');
      // Hard redirect for cross-browser compatibility
      window.location.replace('/collection');
      return;
    }
    
    // Handle hash fragment or query string for OAuth redirects
    const handleAuthRedirect = () => {
      // Get the current URL
      const currentUrl = window.location.href;
      console.log('useSessionCheck - Current URL:', currentUrl);
      
      // Look for both hash fragment and query parameter formats
      if (
        (currentUrl.includes('#access_token=') || currentUrl.includes('?access_token=')) &&
        (currentUrl.includes('type=recovery') || currentUrl.includes('type=signup') || currentUrl.includes('type=magiclink'))
      ) {
        console.log('useSessionCheck - Found auth redirect with access_token, handling auth redirect');
        
        // Important: This will be handled by Supabase automatically
        // Just wait a moment to let Supabase process the token before we check the session
        setTimeout(() => {
          if (mounted) {
            checkSession();
          }
        }, 500);
        
        return true;
      }
      return false;
    };
    
    const checkSession = async () => {
      try {
        // First check if we have an auth redirect to handle
        if (handleAuthRedirect()) {
          return;
        }
        
        const { data } = await supabase.auth.getSession();
        const sessionExists = !!data.session;
        
        console.log('useSessionCheck - Session check:', sessionExists ? 'Session found' : 'No session');
        
        if (mounted) {
          setHasSession(sessionExists);
          
          // Only redirect if we're on the auth page and have a session
          if (sessionExists && (location.pathname === '/auth' || 
                              location.pathname === '/' || 
                              location.pathname === '/index' || 
                              location.pathname === '/index.html')) {
            console.log('useSessionCheck - On auth/root/index page with session, redirecting to collection');
            // Use navigate instead of location.replace for smoother transitions
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
    
    // Set up auth state listener first, using setTimeout to avoid potential recursion
    authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      console.log('useSessionCheck - Auth state changed:', event);
      
      if (!mounted) return;
      
      // Use setTimeout to prevent potential deadlocks or recursion
      setTimeout(() => {
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session) {
          setHasSession(true);
          console.log('useSessionCheck - User signed in, redirecting to collection');
          
          // Use navigate instead of window.location for smoother transitions
          navigate('/collection', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          setHasSession(false);
          console.log('useSessionCheck - User signed out');
          
          // Only redirect to auth if not already there
          if (location.pathname !== '/auth') {
            navigate('/auth', { replace: true });
          }
        }
      }, 0);
    });
    
    // Then check the session
    checkSession();
    
    return () => {
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [navigate, location.pathname]);

  return { checkComplete, hasSession };
};

export default useSessionCheck;
