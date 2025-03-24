
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import AuthForm from './AuthForm';
import usePageTitle from '@/hooks/usePageTitle';

const AuthScreen: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Set the page title
  usePageTitle('Sign In');
  
  useEffect(() => {
    if (user) {
      navigate('/collection');
    }
  }, [user, navigate]);
  
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    // Update page title based on mode
    usePageTitle(isLogin ? 'Sign Up' : 'Sign In');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-medium mb-2">SouvieShelf</h1>
          <p className="text-muted-foreground">Your personal museum from a life well-traveled</p>
        </div>
        
        <AuthForm 
          isLogin={isLogin}
          onToggleMode={handleToggleMode}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default AuthScreen;
