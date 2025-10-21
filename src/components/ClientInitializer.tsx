"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export default function ClientInitializer() {
  const { setUser } = useUserStore();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        console.warn("User data in localStorage is invalid.");
        localStorage.removeItem("user");
      }
    }
  }, [setUser]);

  return null; 
}
