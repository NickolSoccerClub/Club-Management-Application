import { create } from "zustand";
import type { Profile, UserRole } from "@/types/auth";

interface AuthState {
  user: Profile | null;
  roles: UserRole[];
  isLoading: boolean;
  setUser: (user: Profile | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: string) => boolean;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  roles: [],
  isLoading: true,

  setUser: (user) => set({ user }),
  setRoles: (roles) => set({ roles }),
  setLoading: (isLoading) => set({ isLoading }),

  hasRole: (role) => {
    return get().roles.some((r) => r.role_type === role && r.status === "active");
  },

  clear: () => set({ user: null, roles: [], isLoading: false }),
}));
