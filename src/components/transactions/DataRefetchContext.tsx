// DataRefetchContext.tsx
import React, { createContext, useContext, useState } from "react";

type RefetchContextType = {
  refetchFlag: boolean;
  triggerRefetch: () => void;
};

const DataRefetchContext = createContext<RefetchContextType | undefined>(undefined);

export const DataRefetchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refetchFlag, setRefetchFlag] = useState(false);

  const triggerRefetch = () => {
    console.log("rfresh call");
    
    setRefetchFlag(prev => !prev); // Toggle to trigger effect
  };

  return (
    <DataRefetchContext.Provider value={{ refetchFlag, triggerRefetch }}>
      {children}
    </DataRefetchContext.Provider>
  );
};

export const useDataRefetch = () => {
  const context = useContext(DataRefetchContext);
  if (!context) throw new Error("useDataRefetch must be used within DataRefetchProvider");
  return context;
};
