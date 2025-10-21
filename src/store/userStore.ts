// stores/useUserStore.ts
import { create } from "zustand";
export type Role = "admin" | "manager" | "user";
interface User {
  id: number;
  username: string;
  role: Role;
}

interface UserStore {
  user: User | null ;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
