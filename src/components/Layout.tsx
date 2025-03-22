
import React, { useEffect } from 'react';
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

  useEffect(() => {
    // If not loading and no user is logged in and not on auth page, redirect to auth
    if (!loading && !user && !isAuthPage) {
      console.log('User not authenticated, redirecting to auth page');
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
      navigate('/auth');
    }
    
    // If user is logged in and on auth page, redirect to collection
    if (!loading && user && isAuthPage) {
      navigate('/collection');
    }
  }, [user, loading, isAuthPage, navigate, location.pathname]);

  // Show loading state only if we're actually checking authentication
  // and not on the auth page
  if (loading && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }

  // Don't render content for unauthenticated users (except on auth page)
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
