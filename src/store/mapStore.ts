import { create } from "zustand";

export type MarkerCategory = "taxi_terminal" | "microhub" | "node";
export type MarkerStatus = "active" | "inactive";

export interface MapPoint {
  id: string;
  name: string;
  category: MarkerCategory;
  status: MarkerStatus;
  lat: number;
  lng: number;
}

interface MapState {
  searchCoords: { lat: number; lng: number } | null;
  setSearchCoords: (coords: { lat: number; lng: number }) => void;

  points: MapPoint[];
  setPoints: (points: MapPoint[]) => void;
  addPoint: (point: MapPoint) => void;
  updatePointStatus: (id: string, status: MarkerStatus) => void;
}

export const MapStore = create<MapState>((set, get) => ({
  searchCoords: null,
  setSearchCoords: (coords) => set({ searchCoords: coords }),

  points: [],
  setPoints: (points) => set({ points }),
  addPoint: (point) => set({ points: [...get().points, point] }),
  updatePointStatus: (id, status) =>
    set({
      points: get().points.map((p) => (p.id === id ? { ...p, status } : p)),
    }),
}));
