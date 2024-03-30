export interface MapNode {
  NodeID: number;
  SectionID: number;
  Latitude: number;
  Longitude: number;
  Name: string | null;
  isPOI: number | null;
  Description: string | null;
}

export interface POI extends MapNode {
  isFavorite?: boolean;
}
