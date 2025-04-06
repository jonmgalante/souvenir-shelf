
import React, { useEffect } from 'react';
import Navigation from './Navigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from './ui/skeleton';
import usePageTitle from '@/hooks/usePageTitle';
import MobileContainer from './common/MobileContainer';
import { Capacitor } from '@capacitor/core';

type LayoutProps = {
  children: React.ReactNode;
  hideNav?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, hideNav = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAuthPage = location.pathname === '/auth';
  const isNative = Capacitor.isNativePlatform();
  
  // Set default page title
  usePageTitle();

  useEffect(() => {
    console.log('Layout: Auth state changed', { 
      user: !!user, 
      loading, 
      isAuthPage,
      pathname: location.pathname,
      isNative
    });
  
    if (location.pathname === '/' || 
        location.pathname === '/index' || 
        location.pathname === '/index.html') {
      console.log('Layout: Root or index path detected, redirecting to collection');
      window.location.replace('/collection');
      return;
    }
  
    if (!loading) {
      // If not authenticated and not on auth page, redirect to auth (no toast)
      if (!user && !isAuthPage) {
        console.log('Layout: User not authenticated, redirecting to auth page');
        navigate('/auth', { replace: true });
        return;
      }
  
      // If authenticated and on auth page, redirect to collection
      if (user && isAuthPage) {
        console.log('Layout: User authenticated on auth page, redirecting to collection');
        navigate('/collection', { replace: true });
        return;
      }
    }
  }, [user, loading, isAuthPage, navigate, location.pathname]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <MobileContainer>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </MobileContainer>
    );
  }

  // Don't render private content for unauthenticated users except on auth page
  if (!user && !isAuthPage) {
    return null; // The useEffect will handle the redirect
  }

  return (
    <MobileContainer>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-20">
          {children}
        </main>
        
        {!hideNav && !isAuthPage && <Navigation />}
      </div>
    </MobileContainer>
  );
};

export default Layout;
