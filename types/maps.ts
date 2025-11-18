
export type MarkerCategory = "taxi_terminal" | "microhub" | "node";
export type PointStatus = "active" | "inactive";

export interface MapPoint {
  id: string;
  name: string;
  category: MarkerCategory;
  status: PointStatus;
  lat: number;
  LabelId?: number;
  lng: number;
}

export interface MapComponentProps {
  points: any[];
  initialZones?: [number, number][][]; 
  zoneTitles?: string[];
  onPointClick?: (point: any) => void;
  onZoneClick?: (info: { index: number; coordinates: any}) => void;
  onCreateNodeRequest?: (coords: { lat: number; lng: number }) => void;
}
