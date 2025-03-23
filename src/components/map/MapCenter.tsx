
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface LatLng {
  lat: number;
  lng: number;
}

interface MapCenterProps {
  center: LatLng;
}

// Separate component file for map center update functionality
const MapCenter: React.FC<MapCenterProps> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  
  return null;
};

export default MapCenter;
