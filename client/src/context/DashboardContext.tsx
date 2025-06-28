import { createContext, useContext, useState, type ReactNode } from "react";
import type { QueryKey } from "../constants/dashboardCards";

interface DashboardContextType {
  selectedCard: QueryKey | null;
  setSelectedCard: (value: QueryKey | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCard, setSelectedCard] = useState<QueryKey | null>(null);

  return (
    <DashboardContext.Provider value={{ selectedCard, setSelectedCard }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
