import { create } from "zustand";

interface MapStoreState {
  searchText: string;
  setSearchText: (text: string) => void;
}

export const MapStore = create<MapStoreState>((set) => ({
  searchText: "",
  setSearchText: (text) => set({ searchText: text }),
}));
