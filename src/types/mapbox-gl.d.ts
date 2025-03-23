
declare module 'mapbox-gl' {
  export interface MapboxOptions {
    container: string | HTMLElement;
    style: string;
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
    minZoom?: number;
    maxZoom?: number;
    projection?: string;
    interactive?: boolean;
    attributionControl?: boolean;
    customAttribution?: string | string[];
    logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    failIfMajorPerformanceCaveat?: boolean;
    preserveDrawingBuffer?: boolean;
    antialias?: boolean;
    refreshExpiredTiles?: boolean;
    maxBounds?: [[number, number], [number, number]];
    scrollZoom?: boolean;
    boxZoom?: boolean;
    dragRotate?: boolean;
    dragPan?: boolean;
    keyboard?: boolean;
    doubleClickZoom?: boolean;
    touchZoomRotate?: boolean;
    trackResize?: boolean;
    bearing?: number;
    hash?: boolean | string;
  }

  export interface FogOptions {
    'color'?: string;
    'high-color'?: string;
    'horizon-blend'?: number;
    'space-color'?: string;
    'star-intensity'?: number;
    'range'?: [number, number];
  }

  export class NavigationControl {
    constructor(options?: { showCompass?: boolean; showZoom?: boolean; visualizePitch?: boolean });
  }

  export interface TouchZoomRotateHandler {
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
  }

  export interface TouchPitchHandler {
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
  }

  export class Map {
    constructor(options: MapboxOptions);
    addControl(control: any, position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'): this;
    on(type: string, listener: (e?: any) => void): this;
    once(type: string, listener: (e?: any) => void): this;
    off(type: string, listener: (e?: any) => void): this;
    setFog(fog: FogOptions): this;
    getCenter(): { lng: number; lat: number };
    getZoom(): number;
    easeTo(options: { center?: { lng: number; lat: number }; zoom?: number; duration?: number; easing?: (t: number) => number }): this;
    remove(): void;
    loaded(): boolean;
    touchZoomRotate: TouchZoomRotateHandler;
    touchPitch: TouchPitchHandler;
  }

  export class Marker {
    constructor(element?: HTMLElement);
    setLngLat(lnglat: [number, number]): this;
    setPopup(popup: Popup): this;
    addTo(map: Map): this;
    remove(): this;
    getPopup(): Popup;
  }

  export interface PopupOptions {
    offset?: number | Point | { [key: string]: [number, number] };
    closeButton?: boolean;
    closeOnClick?: boolean;
    maxWidth?: string;
  }

  export class Popup {
    constructor(options?: PopupOptions);
    setDOMContent(htmlNode: Node): this;
    on(type: string, listener: (e?: any) => void): this;
  }

  export interface Point {
    x: number;
    y: number;
  }

  export function supported(options?: { failIfMajorPerformanceCaveat?: boolean }): boolean;
  
  // Change the accessToken property to be writeable
  export let accessToken: string;
}
