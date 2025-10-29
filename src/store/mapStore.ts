import { create } from "zustand";

export type MarkerCategory = "taxi_terminal" | "microhub" | "node";

export interface MapPoint {
  id: string;
  name: string;
  category: MarkerCategory;
  status: "active" | "inactive";
  lat: number;
  lng: number;
}

export interface MapState {
  points: MapPoint[];
  mode: "view" | "defineZone";
  zonePoints: MapPoint[];
  addZonePoint: (point: MapPoint) => void;
  clearZonePoints: () => void;
  setPoints: (points: MapPoint[]) => void;
  setMode: (mode: "view" | "defineZone") => void;
}

export const MapStore = create<MapState>((set) => ({
  points: [],
  mode: "view",
  zonePoints: [],

  addZonePoint: (point) =>
    set((state) => ({
      zonePoints: [...state.zonePoints, point],
    })),

  clearZonePoints: () =>
    set(() => ({
      zonePoints: [],
    })),

  setPoints: (points) => set({ points }),
  setMode: (mode) => set({ mode }),
}));
