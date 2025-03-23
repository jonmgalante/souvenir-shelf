
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
  }

  export interface PopupProps {
    children?: ReactNode;
  }
  
  export function useMap(): L.Map;
}
