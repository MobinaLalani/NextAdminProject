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
  openPanel: boolean;
  setOpenPanel: (value: boolean) => void;
  points: MapPoint[];
  zoneNodes: MapPoint[];
  mode: "view" | "defineZone" | "createNode";
  zonePoints: MapPoint[];
  setZonePoint: (point: MapPoint) => void;
  clearZonePoints: () => void;
  setPoints: (points: MapPoint[]) => void;
  setZoneNodes: (nodes: MapPoint[]) => void;
  addNode: (node: MapPoint) => void;
  setMode: (mode: "view" | "defineZone" | "createNode") => void;
}

export const MapStore = create<MapState>((set) => ({
  openPanel: false,
  setOpenPanel: (value: boolean) => set({ openPanel: value }),

  points: [],
  zoneNodes: [],
  mode: "view",
  zonePoints: [],

  setZonePoint: (point) =>
    set((state) => ({ zonePoints: [...state.zonePoints, point] })),

  clearZonePoints: () => set({ zonePoints: [] }),

  setPoints: (points) => set({ points }),

  setZoneNodes: (zoneNodes) => set({ zoneNodes }),

  // ✅ جلوگیری از تکرار و حذف در صورت وجود (toggle)
  addNode: (node) =>
    set((state) => {
      const exists = state.zoneNodes.some((n) => n.id === node.id);
      if (exists) {
        // اگر نود از قبل وجود دارد، آن را حذف کن
        return { zoneNodes: state.zoneNodes.filter((n) => n.id !== node.id) };
      } else {
        // در غیر این صورت نود جدید را اضافه کن
        return { zoneNodes: [...state.zoneNodes, node] };
      }
    }),

  setMode: (mode) => set({ mode }),
}));
