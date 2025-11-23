
import React, { createContext, useMemo } from 'react';
import { TripProvider } from './TripProvider';
import { SouvenirContextType } from './types';
import { SouvenirProvider as SouvenirLogicProvider } from './SouvenirProvider';

export const SouvenirContext = createContext<SouvenirContextType | undefined>(undefined);

export const SouvenirProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  // Execute the underlying providers as hooks and compose their outputs.
  // These provider functions already use React state/effects and return plain objects,
  // so we can call them directly and derive a single context value.
  const tripContext = TripProvider({ children: null });
  const souvenirContext = SouvenirLogicProvider({ children: null, tripsContext: { trips: tripContext?.trips } });

  const noopAsync = async () => {};
  const noopGetById = () => undefined;

  const contextValue = useMemo<SouvenirContextType>(() => ({
    souvenirs: souvenirContext?.souvenirs || [],
    trips: tripContext?.trips || [],
    loading: Boolean(souvenirContext?.loading || tripContext?.loading),
    addSouvenir: souvenirContext?.addSouvenir || noopAsync,
    updateSouvenir: souvenirContext?.updateSouvenir || noopAsync,
    deleteSouvenir: souvenirContext?.deleteSouvenir || noopAsync,
    getSouvenirById: souvenirContext?.getSouvenirById || noopGetById,
    addTrip: tripContext?.addTrip || noopAsync,
    updateTrip: tripContext?.updateTrip || noopAsync,
    deleteTrip: tripContext?.deleteTrip || noopAsync,
  }), [souvenirContext, tripContext]);

  return (
    <SouvenirContext.Provider value={contextValue}>
      {children}
    </SouvenirContext.Provider>
  );
};

// Export the wrapper as SouvenirProvider to be used by the application
export const SouvenirProvider = SouvenirProviderWrapper;
