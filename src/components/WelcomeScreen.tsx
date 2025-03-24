import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';

// This component is no longer used directly in routes,
// but we keep it for backward compatibility
const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/collection', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }
  }, [user, loading, navigate]);
  
  // Render nothing as this will redirect immediately
  return null;
};

export default WelcomeScreen;
