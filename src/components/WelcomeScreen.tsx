
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Force redirect to collection page immediately
const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("WelcomeScreen accessed, forcing redirect to collection");
    // Force immediate redirect to collection
    navigate('/collection', { replace: true });
  }, [navigate]);
  
  // Return null as we're redirecting immediately
  return null;
};

export default WelcomeScreen;
