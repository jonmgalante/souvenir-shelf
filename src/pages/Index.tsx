
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouvenirs } from '../context/souvenir';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import WelcomeScreen from '../components/WelcomeScreen';
import { Skeleton } from '@/components/ui/skeleton';

const Index: React.FC = () => {
  const { souvenirs } = useSouvenirs();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  console.log('Index page - Auth state:', { user: !!user, loading });
  
  useEffect(() => {
    // Only redirect once auth is confirmed (not loading) and user is not authenticated
    if (!loading && !user) {
      console.log('Index - Not loading, no user, redirecting to auth');
      navigate('/auth', { replace: true });
    }
  }, [loading, user, navigate]);
  
  // If still loading, show a better loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
        <p className="text-muted-foreground mt-4">Loading authentication...</p>
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
