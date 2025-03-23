
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapCenterProps {
  center: {
    lat: number;
    lng: number;
  };
}

const MapCenter = ({ center }: MapCenterProps) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  
  return null;
};

export default MapCenter;
