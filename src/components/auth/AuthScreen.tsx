
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import AuthForm from './AuthForm';
import SocialLoginButtons from './SocialLoginButtons';
import useSessionCheck from './useSessionCheck';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check for session and set up auth state change listener
  const { hasSession } = useSessionCheck();

  // Check for access tokens in different formats
  useEffect(() => {
    // Check for hash fragment (OAuth redirects)
    const hashFragment = window.location.hash;
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('access_token');
    
    if ((hashFragment && hashFragment.includes('access_token')) || accessToken) {
      console.log('AuthScreen - Found access_token, redirecting to collection');
      navigate('/collection', { replace: true });
    }
  }, [navigate]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 animate-fade-in">
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="w-full max-w-md px-6 py-8 glass-card rounded-3xl">
          <h1 className="text-3xl font-serif font-medium text-center mb-2">
            Hey Jetsetter
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Sign in to access your souvenir collection
          </p>

          <ErrorMessage message={error} />

          <AuthForm 
            isLogin={isLogin} 
            onToggleMode={toggleMode} 
            loading={loading}
            setLoading={setLoading}
          />

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <SocialLoginButtons loading={loading} setLoading={setLoading} />
        </div>
      </div>
      
      <footer className="mt-8 mb-2 text-center text-sm text-muted-foreground">
        {/* Footer content removed as in original */}
      </footer>
    </div>
  );
};

export default AuthScreen;
