
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately redirect to collection with no conditions
    console.log("Index page accessed, redirecting to collection");
    navigate('/collection', { replace: true });
  }, []);
  
  // This will never render as the redirect happens immediately
  return null;
};

export default Index;
