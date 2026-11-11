"use client";

import { useCulture } from "@/context/CultureContext";
import Navbar from "./Navbar";

export default function ThemedContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useCulture();

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${theme.bg} ${theme.text} font-sans selection:bg-black selection:text-white`}
    >
      <Navbar />
      {children}
    </div>
  );
}
