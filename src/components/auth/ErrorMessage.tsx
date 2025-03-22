
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center">
      <AlertCircle className="h-5 w-5 mr-2" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorMessage;
