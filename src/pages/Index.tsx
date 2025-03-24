
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';

// This file is deprecated and should not be used directly.
// It's kept for backward compatibility only.
const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately redirect regardless of auth state
    navigate('/collection', { replace: true });
  }, [navigate]);
  
  // Render nothing as this will redirect immediately
  return null;
};

export default Index;
