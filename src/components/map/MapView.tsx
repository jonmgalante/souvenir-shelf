import React, { useEffect, useRef, useMemo } from 'react';
import { useSouvenirs } from '../../context/souvenir';
import { Card } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set the Mapbox access token
mapboxgl.accessToken =
  'pk.eyJ1Ijoiam9ubWdhbGFudGUiLCJhIjoiY204a3ltMHh1MHhwczJxcG8yZXRqaDgxZiJ9.mN_EYyrVSLoOB5Pojc_FWQ';

const MapView: React.FC = () => {
  const { souvenirs, loading } = useSouvenirs();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const activePopupRef = useRef<mapboxgl.Popup | null>(null);

  // Group souvenirs by location to avoid duplicate markers
  const locationMap = useMemo(() => {
    const map = new Map<string, any[]>();
    souvenirs.forEach((souvenir) => {
      const key = `${souvenir.location.latitude},${souvenir.location.longitude}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(souvenir);
    });
    return map;
  }, [souvenirs]);

  // Get count of unique countries from all souvenirs
  const uniqueCountriesCount = useMemo(() => {
    return new Set(souvenirs.map((s) => s.location.country)).size;
  }, [souvenirs]);

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Check if mapbox-gl is supported in this browser
    if (!mapboxgl.supported()) {
      console.error('MapboxGL is not supported in this browser');
      return;
    }

    console.log('Initializing Mapbox map with container:', mapContainer.current);

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: 0.9, // Slightly lower zoom level to see more of the globe
        center: [0, 0], // Center the globe in the viewport
        pitch: 0, // Reduced pitch to zero for a centered view
        attributionControl: false,
      });

      console.log('Map created successfully');

      // Add navigation controls to the map
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add atmosphere and fog effects
      map.current.on('style.load', () => {
        console.log('Map style loaded');
        if (map.current) {
          map.current.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });

          // Set the atmosphere property for a globe-style view
          const mapboxMap = map.current as any;
          if (mapboxMap.setTerrain) {
            mapboxMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
          }
          if (mapboxMap.setAtmosphere) {
            mapboxMap.setAtmosphere({
              color: 'rgb(186, 210, 235)',
              'high-color': 'rgb(36, 92, 223)',
              'horizon-blend': 0.02,
              'space-color': 'rgb(11, 11, 25)',
              'star-intensity': 0.4,
            });
          }
        }
      });

      // Optimize for mobile - improve touch handling
      if ('ontouchstart' in window) {
        // Set touch action to allow default touch behavior
        if (mapContainer.current) {
          mapContainer.current.style.touchAction = 'manipulation';
        }

        // Add enhanced touch interactions for mobile
        if ((map.current as any).touchZoomRotate) {
          (map.current as any).touchZoomRotate.enable();
        }
        if ((map.current as any).touchPitch) {
          (map.current as any).touchPitch.enable();
        }
      }

      // Set up automatic globe rotation
      const secondsPerRevolution = 180;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;
      let spinEnabled = true;

      function spinGlobe() {
        if (!map.current) return;

        const zoom = map.current.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng -= distancePerSecond / 60;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      // Set up interaction event handlers
      map.current.on('mousedown', () => {
        userInteracting = true;
      });

      map.current.on('touchstart', () => {
        userInteracting = true;
      });

      map.current.on('dragstart', () => {
        userInteracting = true;
      });

      map.current.on('mouseup', () => {
        userInteracting = false;
        setTimeout(spinGlobe, 1000);
      });

      map.current.on('touchend', () => {
        userInteracting = false;
        setTimeout(spinGlobe, 1000);
      });

      // Start spinning after initial load
      map.current.on('load', () => {
        console.log('Map fully loaded');
        spinGlobe();
        setInterval(spinGlobe, 1000);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      console.log('Cleaning up map');
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (activePopupRef.current) {
        (activePopupRef.current as any).remove();
        activePopupRef.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when souvenirs or map changes
  useEffect(() => {
    if (!map.current || loading) return;

    console.log('Adding markers to map, souvenirs count:', souvenirs.length);

    // Wait for the map to be loaded
    if (!map.current.loaded()) {
      console.log('Map not loaded yet, waiting for load event');
      map.current.once('load', () => addMarkers());
    } else {
      console.log('Map already loaded, adding markers immediately');
      addMarkers();
    }

    function addMarkers() {
      // Clear previous markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Process locations to create clusters or offset markers
      const locationsArray: [string, any[]][] = Array.from(locationMap.entries());
      console.log('Processing', locationsArray.length, 'unique locations');

      // Add new markers
      locationsArray.forEach(([key, locationSouvenirs]) => {
        const [lat, lng] = key.split(',').map(Number);

        // Handle clustering or offsetting for multiple souvenirs at the same location
        if (locationSouvenirs.length === 1) {
          // Single souvenir - create a standard marker
          addSingleMarker(lat, lng, locationSouvenirs[0], locationSouvenirs);
        } else if (locationSouvenirs.length <= 5) {
          // Small cluster - offset markers slightly
          locationSouvenirs.forEach((souvenir: any, i: number) => {
            // Create small offset for each marker
            const offsetLng = lng + i * 0.0005;
            const offsetLat = lat + i * 0.0005;
            addSingleMarker(offsetLat, offsetLng, souvenir, [souvenir]);
          });
        } else {
          // Large cluster - create a cluster marker
          addClusterMarker(lat, lng, locationSouvenirs);
        }
      });
    }

    function addSingleMarker(
      lat: number,
      lng: number,
      firstSouvenir: any,
      souvenirsAtLocation: any[],
    ) {
      // Create a custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#ffffff';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid #ffffff';
      el.style.overflow = 'hidden';

      // Add thumbnail image if available
      if (firstSouvenir.images && firstSouvenir.images.length > 0) {
        el.style.backgroundImage = `url(${firstSouvenir.images[0]})`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
      } else {
        // Default style for markers without images
        el.style.backgroundColor = '#3b82f6';
        el.innerHTML = `<span style="color: white; font-size: 12px; font-weight: bold; display: flex; justify-content: center; align-items: center; height: 100%;">${souvenirsAtLocation.length}</span>`;
      }

      createMarkerWithPopup(el, lng, lat, souvenirsAtLocation);
    }

    function addClusterMarker(lat: number, lng: number, souvenirsAtLocation: any[]) {
      // Create a cluster marker for many souvenirs at same location
      const el = document.createElement('div');
      el.className = 'cluster-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#3b82f6';
      el.style.color = 'white';
      el.style.fontWeight = 'bold';
      el.style.display = 'flex';
      el.style.justifyContent = 'center';
      el.style.alignItems = 'center';
      el.style.boxShadow = '0 3px 6px rgba(0,0,0,0.3)';
      el.style.border = '2px solid #ffffff';
      el.style.cursor = 'pointer';
      el.innerHTML = `${souvenirsAtLocation.length}`;

      createMarkerWithPopup(el, lng, lat, souvenirsAtLocation);
    }

    function createMarkerWithPopup(
      el: HTMLElement,
      lng: number,
      lat: number,
      souvenirsAtLocation: any[],
    ) {
      const firstSouvenir = souvenirsAtLocation[0];

      // Create the popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'popup-content';
      popupContent.style.width = '200px';

      popupContent.innerHTML = `
        <h3 style="font-weight: 600; margin-bottom: 4px;">${firstSouvenir.location.city}, ${firstSouvenir.location.country}</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${souvenirsAtLocation.length} souvenir(s)</p>
        <ul style="max-height: 150px; overflow-y: auto; margin: 0; padding-left: 0; list-style: none;">
          ${souvenirsAtLocation
            .map(
              (s: any) => `
            <li style="padding: 4px 0; border-bottom: 1px solid #eee;">
              <a href="#" class="souvenir-link" data-id="${s.id}" style="text-decoration: none; color: #3b82f6; font-size: 14px; display: block;">
                ${s.name}
              </a>
            </li>
          `,
            )
            .join('')}
        </ul>
      `;

      // Create the marker and popup - optimize popup for touch
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setDOMContent(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Store marker for cleanup
      markersRef.current.push(marker);

      // When this popup opens, close any previously open popup and set this as active
      popup.on('open', () => {
        if (activePopupRef.current && activePopupRef.current !== popup) {
            (activePopupRef.current as any).remove();
        }
        activePopupRef.current = popup;

        // Add click event listeners to souvenir links within this popup
        popupContent.querySelectorAll('.souvenir-link').forEach((link) => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
            if (id) navigate(`/souvenir/${id}`);
          });
        });
      });

      // When this popup closes, clear the active ref if it was this popup
      popup.on('close', () => {
        if (activePopupRef.current === popup) {
          activePopupRef.current = null;
        }
      });
    }
  }, [locationMap, navigate, loading]);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-[calc(100vh-80px)]">
        <p>Loading map data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col">
      <div>
        <h1 className="text-xl font-medium">Souvenir Map</h1>
        <p className="text-muted-foreground text-sm">
          Memories from {uniqueCountriesCount}{' '}
          {uniqueCountriesCount === 1 ? 'country' : 'countries'} around the world
        </p>
      </div>

      {souvenirs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-500">No souvenirs to display on the map</p>
        </div>
      ) : (
        <Card className="flex-1 overflow-hidden relative mt-4">
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
          <div className="absolute bottom-4 left-4 z-10 bg-white p-2 rounded-md shadow-md text-xs">
            <p className="text-gray-600">⟲ Drag to stop auto-rotation</p>
          </div>
          {/* Attribution that would normally be provided by the map control */}
          <div className="absolute bottom-1 right-1 z-10 text-[10px] text-gray-500">
            © Mapbox © OpenStreetMap
          </div>
        </Card>
      )}
    </div>
  );
};

export default MapView;