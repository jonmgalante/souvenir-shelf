
import React, { createContext, useState, useRef } from 'react';
import { TripProvider } from './TripProvider';
import { SouvenirContextType } from './types';
import { SouvenirProvider as SouvenirLogicProvider } from './SouvenirProvider';

export const SouvenirContext = createContext<SouvenirContextType | undefined>(undefined);

export const SouvenirProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const tripProviderRef = useRef<any>(null);
  const souvenirProviderRef = useRef<any>(null);
  
  const [contextValue, setContextValue] = useState<SouvenirContextType>({
    souvenirs: [],
    trips: [],
    loading: true,
    addSouvenir: async () => {},
    updateSouvenir: async () => {},
    deleteSouvenir: async () => {},
    getSouvenirById: () => undefined,
    addTrip: async () => {},
    updateTrip: async () => {},
    deleteTrip: async () => {},
  });
  
  const updateContextValue = (tripContext: any, souvenirContext: any) => {
    if (tripContext && souvenirContext) {
      setContextValue({
        souvenirs: souvenirContext.souvenirs || [],
        trips: tripContext.trips || [],
        loading: souvenirContext.loading || tripContext.loading,
        addSouvenir: souvenirContext.addSouvenir,
        updateSouvenir: souvenirContext.updateSouvenir,
        deleteSouvenir: souvenirContext.deleteSouvenir,
        getSouvenirById: souvenirContext.getSouvenirById,
        addTrip: tripContext.addTrip,
        updateTrip: tripContext.updateTrip,
        deleteTrip: tripContext.deleteTrip,
      });
    }
  };

  const captureTripProvider = (tripProviderOutput: any) => {
    tripProviderRef.current = tripProviderOutput;
    updateContextValue(tripProviderRef.current, souvenirProviderRef.current);
    return null;
  };

  const captureSouvenirProvider = (souvenirProviderOutput: any) => {
    souvenirProviderRef.current = souvenirProviderOutput;
    updateContextValue(tripProviderRef.current, souvenirProviderRef.current);
    return null;
  };

  return (
    <SouvenirContext.Provider value={contextValue}>
      <TripProviderRender onRender={captureTripProvider}>
        <SouvenirProviderRender 
          trips={tripProviderRef.current?.trips} 
          onRender={captureSouvenirProvider}
        >
          {children}
        </SouvenirProviderRender>
      </TripProviderRender>
    </SouvenirContext.Provider>
  );
};

const TripProviderRender = ({ 
  children, 
  onRender 
}: { 
  children: React.ReactNode, 
  onRender: (output: any) => void 
}) => {
  const tripProvider = TripProvider({ children: null });
  onRender(tripProvider);
  return <>{children}</>;
};

const SouvenirProviderRender = ({ 
  children, 
  trips, 
  onRender 
}: { 
  children: React.ReactNode, 
  trips: any, 
  onRender: (output: any) => void 
}) => {
  const souvenirProvider = SouvenirLogicProvider({ children: null, tripsContext: { trips } });
  onRender(souvenirProvider);
  return <>{children}</>;
};

export const SouvenirProvider = SouvenirProviderWrapper;
