
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import AuthForm from './AuthForm';
import SocialLoginButtons from './SocialLoginButtons';
import useSessionCheck from './useSessionCheck';
import { toast } from '@/components/ui/use-toast';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check for session and set up auth state change listener
  const { hasSession } = useSessionCheck();

  // Check for redirect with access token
  useEffect(() => {
    // Function to detect if we're on an OAuth callback with tokens
    const isAuthCallback = () => {
      const url = window.location.href;
      // Check for various ways the token might appear
      return (
        url.includes('#access_token=') || 
        url.includes('?access_token=') || 
        url.includes('&access_token=') ||
        url.includes('code=')
      );
    };

    if (isAuthCallback()) {
      console.log('AuthScreen - Detected OAuth callback with tokens');
      // Let the user know we're processing their login
      toast({
        title: "Processing sign-in",
        description: "Please wait while we complete your authentication...",
      });
      
      // Set loading state to prevent other actions
      setLoading(true);
      
      // Give supabase client time to process the token
      setTimeout(() => {
        console.log('AuthScreen - Redirecting after OAuth callback processing');
        navigate('/collection', { replace: true });
      }, 1000);
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
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default AuthScreen;
