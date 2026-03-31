"use client";

import { createContext, useContext } from "react";

export interface ParentChild {
  id: string;
  name: string;
  initials: string;
  ageGroup: string;
  team: string;
  color: string;
}

export const MOCK_CHILDREN: ParentChild[] = [
  { id: "c1", name: "Emma", initials: "EC", ageGroup: "U9", team: "Nickol Thunder", color: "#1D4ED8" },
  { id: "c2", name: "Jack", initials: "JC", ageGroup: "U12", team: "Nickol Titans", color: "#7C3AED" },
];

export interface ActiveChildContextValue {
  activeChild: ParentChild;
  setActiveChildId: (id: string) => void;
  children: ParentChild[];
}

export const ActiveChildContext = createContext<ActiveChildContextValue | undefined>(undefined);

export function useActiveChild() {
  const ctx = useContext(ActiveChildContext);
  if (!ctx) throw new Error("useActiveChild must be used within ParentLayout");
  return ctx;
}
