import React from 'react';
import { useSouvenirs } from '../../context/souvenir';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView: React.FC = () => {
  const { souvenirs, loading } = useSouvenirs();
  const navigate = useNavigate();
  
  // Group souvenirs by location to avoid duplicate markers
  const locationMap = new Map();
  souvenirs.forEach(souvenir => {
    const key = `${souvenir.location.latitude},${souvenir.location.longitude}`;
    if (!locationMap.has(key)) {
      locationMap.set(key, []);
    }
    locationMap.get(key).push(souvenir);
  });

  // Calculate map bounds or default center
  const getMapCenter = () => {
    if (souvenirs.length === 0) {
      return [20, 0]; // Default center if no souvenirs
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
    
    return [sum.lat / souvenirs.length, sum.lng / souvenirs.length];
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-[calc(100vh-80px)]">
        <p>Loading map data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col">
      <h1 className="text-xl font-medium mb-4">Souvenir Map</h1>
      
      {souvenirs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No souvenirs to display on the map</p>
        </div>
      ) : (
        <Card className="flex-1 overflow-hidden">
          <MapContainer
            center={getMapCenter() as [number, number]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render markers for each unique location */}
            {Array.from(locationMap.entries()).map(([key, locationSouvenirs]) => {
              const [lat, lng] = key.split(',').map(Number);
              return (
                <Marker key={key} position={[lat, lng]}>
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
            })}
          </MapContainer>
        </Card>
      )}
    </div>
  );
};

export default MapView;
