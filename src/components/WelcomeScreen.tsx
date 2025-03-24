
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Force redirect to collection page immediately
const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("WelcomeScreen accessed, forcing hard redirect to collection");
    // Use window.location for a hard redirect that works in all browsers
    window.location.href = '/collection';
    
    // As a fallback, also try the React Router navigate
    navigate('/collection', { replace: true });
  }, [navigate]);
  
  // Return simple redirect message in case it's momentarily visible
  return <div className="hidden">Redirecting to collection...</div>;
};

export default WelcomeScreen;
