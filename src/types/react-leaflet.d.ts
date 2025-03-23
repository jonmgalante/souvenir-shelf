
import { ReactNode } from 'react';
import L from 'leaflet';

declare module 'react-leaflet' {
  export interface MapContainerProps {
    center: L.LatLngExpression;
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  export interface TileLayerProps {
    url: string;
    attribution?: string;
  }

  export interface MarkerProps {
    position: L.LatLngExpression;
    children?: ReactNode;
    key?: string | number;
  }

  export interface PopupProps {
    children?: ReactNode;
  }
  
  export function useMap(): L.Map;
  
  export const MapContainer: React.FC<MapContainerProps>;
  export const TileLayer: React.FC<TileLayerProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Popup: React.FC<PopupProps>;
}
