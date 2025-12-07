import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const useSessionCheck = () => {
  const [checkComplete, setCheckComplete] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Handle hash fragment or query string for OAuth/magic link redirects
    const handleAuthRedirect = () => {
      const currentUrl = window.location.href;
      console.log('useSessionCheck - Current URL:', currentUrl);

      if (
        (currentUrl.includes('#access_token=') ||
          currentUrl.includes('?access_token=')) &&
        (currentUrl.includes('type=recovery') ||
          currentUrl.includes('type=signup') ||
          currentUrl.includes('type=magiclink'))
      ) {
        console.log(
          'useSessionCheck - Found auth redirect with access_token, letting Supabase process token before session check',
        );
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
        // If we have an auth redirect in progress, delay the session check
        if (handleAuthRedirect()) {
          return;
        }

        const { data } = await supabase.auth.getSession();
        const sessionExists = !!data.session;

        console.log(
          'useSessionCheck - Session check:',
          sessionExists ? 'Session found' : 'No session',
        );

        if (!mounted) return;

        setHasSession(sessionExists);
        setCheckComplete(true);
      } catch (error) {
        console.error('useSessionCheck - Error checking session:', error);
        if (mounted) {
          setHasSession(false);
          setCheckComplete(true);
        }
      }
    };

    checkSession();

    // Keep hasSession in sync with Supabase auth state
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('useSessionCheck - Auth state changed:', event);
      if (!mounted) return;
      const sessionExists = !!session;
      setHasSession(sessionExists);
      setCheckComplete(true);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { checkComplete, hasSession };
};

export default useSessionCheck;