
import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/use-toast';

type LayoutProps = {
  children: React.ReactNode;
  hideNav?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, hideNav = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAuthPage = location.pathname === '/auth';
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Only redirect if we have a definite auth state (loading is false)
    if (!loading) {
      // If not authenticated and not on auth page, redirect to auth
      if (!user && !isAuthPage && !redirected) {
        console.log('Layout - User not authenticated, redirecting to auth page');
        setRedirected(true);
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate('/auth');
      }
      
      // If authenticated and on auth page, redirect to collection
      if (user && isAuthPage && !redirected) {
        console.log('Layout - User authenticated on auth page, redirecting to collection');
        setRedirected(true);
        navigate('/collection');
      }
    }
  }, [user, loading, isAuthPage, navigate, redirected]);

  // Show loading state only when checking authentication
  // and not on the auth page
  if (loading && !isAuthPage) {
    console.log('Layout - Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }

  // Don't render content for unauthenticated users except on auth page
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
