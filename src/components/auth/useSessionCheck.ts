
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
    
    // Handle hash fragment or query string for OAuth redirects
    const handleAuthRedirect = () => {
      // Get the current URL
      const currentUrl = window.location.href;
      console.log('useSessionCheck - Current URL:', currentUrl);
      
      // Handle redirects from root or index path with both methods to ensure it works
      if (location.pathname === '/' || 
          location.pathname === '/index' || 
          location.pathname === '/index.html') {
        console.log('useSessionCheck - Detected root or index path, redirecting to collection');
        // Hard redirect for problematic browsers
        window.location.href = '/collection';
        return true;
      }
      
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
            // Use both methods to ensure it works across browsers
            window.location.href = '/collection';
            navigate('/collection', { replace: true });
          }
          
          setCheckComplete(true);
        }
      } catch (error) {
        console.error('useSessionCheck - Error checking session:', error);
        toast({
          title: "Session error",
          description: "There was a problem checking your authentication status",
          variant: "destructive",
        });
        
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
          setHasSession(true);
          console.log('useSessionCheck - User signed in, redirecting to collection');
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
          // Use both methods to ensure it works across browsers
          window.location.href = '/collection';
          navigate('/collection', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          setHasSession(false);
          console.log('useSessionCheck - User signed out');
          if (location.pathname !== '/auth') {
            toast({
              title: "Signed out",
              description: "You have been signed out",
            });
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
