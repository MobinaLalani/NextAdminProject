
export type MarkerCategory = "taxi_terminal" | "microhub" | "node";
export type PointStatus = "active" | "inactive";

export interface MapPoint {
  id: string;
  name: string;
  category: MarkerCategory;
  status: PointStatus;
  lat: number;
  lng: number;
}

export interface MapComponentProps {
  points: any[];
  initialZones?: [number, number][][]; // آرایه‌ای از زون‌ها، هر زون خودش آرایه‌ای از نقاط [lng, lat]
  zoneTitles?: string[]; // عنوان هر زون همراستا با ایندکس initialZones
  onPointClick?: (point: any) => void;
  onZoneClick?: (info: { index: number; coordinates: any}) => void; // ✅ تغییر این خط
  onCreateNodeRequest?: (coords: { lat: number; lng: number }) => void;
}
