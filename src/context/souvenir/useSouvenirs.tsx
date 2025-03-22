
import { useContext } from 'react';
import { SouvenirContext } from './SouvenirContext';

export const useSouvenirs = () => {
  const context = useContext(SouvenirContext);
  if (context === undefined) {
    throw new Error('useSouvenirs must be used within a SouvenirProvider');
  }
  return context;
};
