
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSouvenirs } from '../context/souvenir';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import WelcomeScreen from '../components/WelcomeScreen';

const Index: React.FC = () => {
  const { souvenirs } = useSouvenirs();
  const { user, loading } = useAuth();
  
  // If loading, show a simple loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, show the welcome screen
  return (
    <Layout hideNav={false}>
      <WelcomeScreen />
    </Layout>
  );
};

export default Index;
