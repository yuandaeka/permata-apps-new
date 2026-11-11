"use client";

import React, { createContext, useContext, useState } from "react";

interface Theme {
  bg: string;
  text: string;
  btn: string;
  accent: string;
}

interface CultureContextType {
  culture: string;
  setCulture: (c: string | ((prev: string) => string)) => void;
  theme: Theme;
}

export const CultureContext = createContext<CultureContextType>({
  culture: "Aceh",
  setCulture: () => {},
  theme: {
    bg: "bg-[#F0F4F2]",
    text: "text-[#1B4332]",
    btn: "bg-[#1B4332]",
    accent: "text-[#D4AF37]",
  },
});

export function CultureProvider({ children }: { children: React.ReactNode }) {
  const [culture, setCulture] = useState("Aceh");

  const theme: Theme =
    culture === "Aceh"
      ? {
          bg: "bg-[#F0F4F2]",
          text: "text-[#1B4332]",
          btn: "bg-[#1B4332]",
          accent: "text-[#D4AF37]",
        }
      : {
          bg: "bg-[#FDF5E6]",
          text: "text-[#7B0000]",
          btn: "bg-[#7B0000]",
          accent: "text-[#FFD700]",
        };

  return (
    <CultureContext.Provider value={{ culture, setCulture, theme }}>
      {children}
    </CultureContext.Provider>
  );
}

export function useCulture() {
  return useContext(CultureContext);
}
