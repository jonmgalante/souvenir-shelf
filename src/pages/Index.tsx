
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSouvenirs } from '../context/souvenir';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import WelcomeScreen from '../components/WelcomeScreen';

const Index: React.FC = () => {
  const { souvenirs } = useSouvenirs();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  console.log('Index page - Auth state:', { user: !!user, loading });
  
  useEffect(() => {
    // Once we're sure authentication is complete and user isn't authenticated
    if (!loading && !user) {
      console.log('Index - Not loading, no user, redirecting to auth');
      navigate('/auth', { replace: true });
    }
  }, [loading, user, navigate]);
  
  // If still loading, show a simple loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If not authenticated, don't render anything as the useEffect will redirect
  if (!user) {
    console.log('Index - No user, waiting for redirect');
    return null;
  }

  // If authenticated, show the welcome screen
  console.log('Index - User authenticated, showing welcome screen');
  return (
    <Layout hideNav={false}>
      <WelcomeScreen />
    </Layout>
  );
};

export default Index;
