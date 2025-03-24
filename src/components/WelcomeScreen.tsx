
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';

// This component is deprecated and should not be used directly.
// It's kept for backward compatibility only.
const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Always redirect to collection immediately
    navigate('/collection', { replace: true });
  }, [navigate]);
  
  // Render nothing as this will redirect immediately
  return null;
};

export default WelcomeScreen;
