
import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from './ui/skeleton';

type LayoutProps = {
  children: React.ReactNode;
  hideNav?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, hideNav = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAuthPage = location.pathname === '/auth';
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    console.log('Layout: Auth state changed', { 
      user: !!user, 
      loading, 
      isAuthPage,
      redirectAttempted,
      pathname: location.pathname 
    });

    // Only attempt redirects once authentication state is determined (loading is false)
    if (!loading) {
      // If not authenticated and not on auth page, redirect to auth
      if (!user && !isAuthPage && !redirectAttempted) {
        console.log('Layout: User not authenticated, redirecting to auth page');
        setRedirectAttempted(true);
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate('/auth');
      }
      
      // If authenticated and on auth page, redirect to collection
      else if (user && isAuthPage && !redirectAttempted) {
        console.log('Layout: User authenticated on auth page, redirecting to collection');
        setRedirectAttempted(true);
        navigate('/collection');
      }
    }
  }, [user, loading, isAuthPage, navigate, redirectAttempted, location.pathname]);

  // Reset redirect flag when route changes
  useEffect(() => {
    setRedirectAttempted(false);
  }, [location.pathname]);

  // Show loading state only when checking authentication and not on the auth page
  if (loading && !isAuthPage) {
    console.log('Layout: Showing loading state');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <p className="text-muted-foreground mt-4">Loading authentication...</p>
      </div>
    );
  }

  // Don't render private content for unauthenticated users except on auth page
  if (!user && !isAuthPage) {
    return null; // The useEffect will handle the redirect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      
      {!hideNav && !isAuthPage && <Navigation />}
    </div>
  );
};

export default Layout;
