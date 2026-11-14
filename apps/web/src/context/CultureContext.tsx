"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Culture = "aceh" | "sumbar";

interface CultureContextType {
  culture: Culture;
  setCulture: (c: Culture) => void;
}

const CultureContext = createContext<CultureContextType>({
  culture: "aceh",
  setCulture: () => {},
});

export function CultureProvider({ children }: { children: React.ReactNode }) {
  const [culture, setCultureState] = useState<Culture>("aceh");

  useEffect(() => {
    // Baca dari cookie atau localStorage saat mount
    const stored =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("culture="))
        ?.split("=")[1] as Culture | undefined;
    const initial: Culture = stored === "sumbar" ? "sumbar" : "aceh";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCultureState(initial);
    document.documentElement.dataset.culture = initial;
  }, []);

  const setCulture = (next: Culture) => {
    document.documentElement.dataset.culture = next;
    document.cookie = `culture=${next}; path=/; max-age=31536000; samesite=lax`;
    setCultureState(next);
  };

  return (
    <CultureContext.Provider value={{ culture, setCulture }}>
      {children}
    </CultureContext.Provider>
  );
}

export function useCulture() {
  return useContext(CultureContext);
}

export { CultureContext };
