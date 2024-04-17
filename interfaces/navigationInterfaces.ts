export interface MapNode {
  NodeID: number;
  SectionID: number;
  latitude: number;
  longitude: number;
  Name: string | null;
  isPOI: number | null;
  Description: string | null;
}

export interface POI extends MapNode {
  isFavorite?: boolean;
}

export interface UserPosition {
  latitude: number;
  longitude: number;
  heading: number | null;
}

export interface DistanceAndBearing {
  distance: number;
  bearing: number;
}
