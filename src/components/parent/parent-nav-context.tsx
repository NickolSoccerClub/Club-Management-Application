"use client";

import * as React from "react";

interface ParentNavContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: Array<{ id: string; name: string }>;
  activeChildId: string;
  setActiveChildId: (id: string) => void;
}

const ParentNavContext = React.createContext<ParentNavContextValue | undefined>(
  undefined
);

export function useParentNav() {
  const ctx = React.useContext(ParentNavContext);
  if (!ctx)
    throw new Error("useParentNav must be used within ParentNavProvider");
  return ctx;
}

export function ParentNavProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ParentNavContextValue;
}) {
  return (
    <ParentNavContext.Provider value={value}>
      {children}
    </ParentNavContext.Provider>
  );
}
