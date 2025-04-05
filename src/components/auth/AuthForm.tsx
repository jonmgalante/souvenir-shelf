
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/use-toast';

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  isLogin, 
  onToggleMode, 
  loading, 
  setLoading 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signIn, signUp } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use local state to prevent multiple submissions
    if (localLoading) return;
    
    setLocalLoading(true);
    setLoading(true);
    
    try {
      if (isLogin) {
        console.log('Attempting sign in with:', email);
        await signIn(email, password);
        console.log('Sign in call completed');
      } else {
        if (!name) {
          throw new Error('Name is required');
        }
        await signUp(email, password, name);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Error",
        description: error.error?.message || error.message || 'An error occurred during authentication',
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="block w-full pl-10 rounded-lg border border-input bg-background py-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="John Doe"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 rounded-lg border border-input bg-background py-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 rounded-lg border border-input bg-background py-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || localLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(loading || localLoading) ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <>
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm text-primary hover:underline"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </>
  );
};

export default AuthForm;
