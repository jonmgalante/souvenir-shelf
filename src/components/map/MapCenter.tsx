
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapCenterProps {
  center: {
    lat: number;
    lng: number;
  };
}

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
