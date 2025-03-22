
import React from 'react';
import { useAuth } from '../context/AuthContext';
import WelcomeScreen from '../components/WelcomeScreen';
import Layout from '../components/Layout';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <Layout hideNav>
      <WelcomeScreen />
    </Layout>
  );
};

export default Index;
