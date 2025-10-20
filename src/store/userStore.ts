"use client";

import { create } from "zustand";

type Role = "admin" | "operator" | "viewer";

interface UserState {
  name: string;
  role: Role;
  setUser: (name: string, role: Role) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "",
  role: "viewer",
  setUser: (name, role) => set({ name, role }),
}));
