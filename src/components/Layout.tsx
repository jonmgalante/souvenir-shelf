
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
  const isIndexPage = location.pathname === '/';

  useEffect(() => {
    if (!loading && !user && !isAuthPage && !isIndexPage) {
      console.log('User not authenticated, redirecting to auth page');
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, loading, isAuthPage, isIndexPage, navigate]);

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
