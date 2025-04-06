
import React, { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import { SouvenirContextType } from "./types";

// Import the updated TripProvider and SouvenirProvider as components.
// Ensure these files export default React components.
import TripProviderComponent from "./TripProvider";
import SouvenirProviderComponent from "./SouvenirProvider";

export const SouvenirContext = createContext<SouvenirContextType | undefined>(undefined);

// Default context value
const defaultValue: SouvenirContextType = {
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
};

type SouvenirContextProviderProps = {
  children: ReactNode;
};

export const SouvenirProvider: React.FC<SouvenirContextProviderProps> = ({ children }) => {
  const [contextValue, setContextValue] = useState<SouvenirContextType>(defaultValue);

  // Hold the data from the Trip and Souvenir providers once they are ready
  const [tripData, setTripData] = useState<any>(null);
  const [souvenirData, setSouvenirData] = useState<any>(null);

  // Merge the data once both providers have reported their data
  useEffect(() => {
    if (tripData && souvenirData) {
      setContextValue({
        souvenirs: Array.isArray(souvenirData.souvenirs) ? souvenirData.souvenirs : [],
        trips: Array.isArray(tripData.trips) ? tripData.trips : [],
        loading: Boolean(souvenirData.loading || tripData.loading),
        addSouvenir: souvenirData.addSouvenir || (async () => {}),
        updateSouvenir: souvenirData.updateSouvenir || (async () => {}),
        deleteSouvenir: souvenirData.deleteSouvenir || (async () => {}),
        getSouvenirById: souvenirData.getSouvenirById || (() => undefined),
        addTrip: tripData.addTrip || (async () => {}),
        updateTrip: tripData.updateTrip || (async () => {}),
        deleteTrip: tripData.deleteTrip || (async () => {}),
      });
    }
  }, [tripData, souvenirData]);

  // Memoize the merged context value to avoid unnecessary re-renders
  const value = useMemo(() => contextValue, [contextValue]);

  return (
    <SouvenirContext.Provider value={value}>
      <TripProviderComponent onReady={(data: any) => setTripData(data)}>
        <SouvenirProviderComponent
          tripsContext={{ trips: tripData?.trips || [] }}
          onReady={(data: any) => setSouvenirData(data)}
        >
          {children}
        </SouvenirProviderComponent>
      </TripProviderComponent>
    </SouvenirContext.Provider>
  );
};

export const useSouvenirContext = () => {
  const context = React.useContext(SouvenirContext);
  if (!context) {
    throw new Error("useSouvenirContext must be used within a SouvenirProvider");
  }
  return context;
};

export default SouvenirProvider;
