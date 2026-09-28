export type LocationCategory = 'terreno' | 'porto' | 'industria' | 'rodovia' | 'logistica';

export interface LocationSpec {
  label: string;
  value: string;
}

export interface StrategicLocation {
  id: string;
  orderNumber: number;
  name: string;
  shortLabel: string;
  category: LocationCategory;
  categoryLabel: string;
  longitude: number;
  latitude: number;
  altitude: number;
  description: string;
  isMainAsset?: boolean;
  distanceToPorts?: string;
  distanceToES010?: string;
  specs?: LocationSpec[];
  camera: {
    heading: number; // in degrees (0 = North, 90 = East)
    pitch: number;   // in degrees (-90 = Nadir, -35 = Oblique)
    range: number;   // distance in meters
  };
}

export interface TourStop {
  order: number;
  locationId: string;
  title: string;
  subtitle: string;
  badge: string;
  durationSeconds: number;
  camera: {
    heading: number;
    pitch: number;
    range: number;
  };
  narration: string;
  highlights?: string[];
}

export type CameraAction =
  | 'pan_forward'
  | 'pan_backward'
  | 'pan_left'
  | 'pan_right'
  | 'rotate_left'
  | 'rotate_right'
  | 'tilt_up'
  | 'tilt_down'
  | 'zoom_in'
  | 'zoom_out'
  | 'reset_north'
  | 'view_topdown'
  | 'view_oblique';
