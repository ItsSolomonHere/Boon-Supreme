import { create } from "zustand";
import { api } from "../api/client";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  async fetchMe() {
    set({ loading: true });
    try {
      const { data } = await api.get("/api/auth/me");
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  setUser(user) {
    set({ user });
  },
  async logoutRemote() {
    try {
      await api.post("/api/auth/logout");
    } catch {
      /* ignore */
    }
    set({ user: null });
  },
}));
