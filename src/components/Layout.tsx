
import React, { useEffect } from 'react';
import Navigation from './Navigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    if (!loading && !user && !isAuthPage) {
      navigate('/auth');
    }
  }, [user, loading, isAuthPage, navigate]);

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
