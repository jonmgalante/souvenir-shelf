
import React, { useMemo } from 'react';
import { useSouvenirs } from '../../context/souvenir';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import MapCenter from './MapCenter';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define type for LatLng
interface LatLng {
  lat: number;
  lng: number;
}

const MapView: React.FC = () => {
  const { souvenirs, loading } = useSouvenirs();
  const navigate = useNavigate();
  
  // Group souvenirs by location to avoid duplicate markers
  const locationMap = useMemo(() => {
    const map = new Map();
    souvenirs.forEach(souvenir => {
      const key = `${souvenir.location.latitude},${souvenir.location.longitude}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(souvenir);
    });
    return map;
  }, [souvenirs]);

  // Calculate map center
  const getMapCenter = useMemo((): LatLng => {
    if (souvenirs.length === 0) {
      return { lat: 20, lng: 0 }; // Default center if no souvenirs
    }
    
    // Calculate average of all coordinates
    const sum = souvenirs.reduce(
      (acc, s) => {
        acc.lat += s.location.latitude;
        acc.lng += s.location.longitude;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    
    return { lat: sum.lat / souvenirs.length, lng: sum.lng / souvenirs.length };
  }, [souvenirs]);

  // Create marker elements before rendering
  const markerElements = useMemo(() => {
    return Array.from(locationMap.entries()).map(([key, locationSouvenirs]) => {
      const [lat, lng] = key.split(',').map(Number);
      const position: [number, number] = [lat, lng];
      
      return (
        <Marker 
          key={key} 
          position={position}
        >
          <Popup>
            <div className="max-w-xs">
              <h3 className="font-medium">{locationSouvenirs[0].location.city}, {locationSouvenirs[0].location.country}</h3>
              <p className="text-sm text-gray-600 mb-2">{locationSouvenirs.length} souvenir(s)</p>
              <ul className="space-y-1">
                {locationSouvenirs.map(s => (
                  <li key={s.id}>
                    <button
                      onClick={() => navigate(`/souvenir/${s.id}`)}
                      className="text-sm text-blue-600 hover:underline text-left"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [locationMap, navigate]);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-[calc(100vh-80px)]">
        <p>Loading map data...</p>
      </div>
    );
  }

  const center = getMapCenter;
  const defaultCenter: [number, number] = [center.lat, center.lng];

  return (
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col">
      <h1 className="text-xl font-medium mb-4">Souvenir Map</h1>
      
      {souvenirs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No souvenirs to display on the map</p>
        </div>
      ) : (
        <Card className="flex-1 overflow-hidden">
          <div style={{ height: '100%', width: '100%' }}>
            <MapContainer 
              center={defaultCenter}
              zoom={2}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapCenter center={center} />
              {markerElements}
            </MapContainer>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MapView;
