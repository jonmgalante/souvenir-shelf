
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapCenterProps {
  center: {
    lat: number;
    lng: number;
  };
}

// Separate component for map center updates
const MapCenter: React.FC<MapCenterProps> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  
  return null;
};

export default MapCenter;
