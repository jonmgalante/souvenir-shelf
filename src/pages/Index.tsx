
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Use window.location for a hard redirect that works across all browsers
    console.log("Index page accessed, forcing hard redirect to collection");
    window.location.href = '/collection';
    
    // As a fallback, also try the React Router navigate
    navigate('/collection', { replace: true });
  }, [navigate]);
  
  // This should never render
  return <div className="hidden">Redirecting...</div>;
};

export default Index;
