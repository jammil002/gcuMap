export default interface POI {
  NodeID: number;
  SectionID: number;
  Latitude: number;
  Longitude: number;
  Name: string | null;
  isPOI: number | null;
  Description: string | null;
}
