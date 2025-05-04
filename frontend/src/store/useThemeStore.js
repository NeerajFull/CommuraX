import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("commuraX-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("commuraX-theme", theme);
    set({ theme });
  },
}));
