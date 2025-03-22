
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSouvenirs } from '../context/SouvenirContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import WelcomeScreen from '../components/WelcomeScreen';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { souvenirs } = useSouvenirs();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // If loading, show a simple loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If not authenticated, don't render content (will redirect via the useEffect)
  if (!user) {
    return null;
  }

  // If authenticated, show the welcome screen
  return (
    <Layout hideNav={false}>
      <WelcomeScreen />
    </Layout>
  );
};

export default Index;
