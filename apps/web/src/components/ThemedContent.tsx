"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useCulture } from "@/context/CultureContext";
import Navbar from "./Navbar";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import AiCompanion from "./pages/AiCompanion";
import MoodFoodAnalyzer from "./pages/MoodFoodAnalyzer";
import TeleScreening from "./pages/TeleScreening";
import RoleplayPsy from "./pages/RoleplayPsy";
import GameAdventure from "./pages/GameAdventure";
import GameBreathing from "./pages/GameBreathing";
import GameHealing from "./pages/GameHealing";
import GameSiagaMinang from "./pages/GameSiagaMinang";

const GameQuake = dynamic(() => import("./pages/GameQuake"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-black text-lg">
      Memuat Simulasi Sigap Bencana...
    </div>
  ),
});

const KNOWN_ROUTES = new Set([
  "/",
  "/dashboard",
  "/jurnal",
  "/journal",
  "/ai-companion",
  "/mood-food",
  "/tele-screening",
  "/roleplay",
  "/game-adventure",
  "/game-breath",
  "/game-healing",
  "/game-siagaminang",
  "/game-quake",
]);

function normalizePath(path: string): string {
  const clean = path.split("?")[0].split("#")[0];
  if (clean.length > 1 && clean.endsWith("/")) {
    return clean.slice(0, -1);
  }
  return clean || "/";
}

export default function ThemedContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useCulture();
  const nextPathname = usePathname();
  const [clientPath, setClientPath] = useState<string | null>(null);

  useEffect(() => {
    if (nextPathname) {
      setClientPath(normalizePath(nextPathname));
    }
  }, [nextPathname]);

  useEffect(() => {
    const onPopState = () => {
      setClientPath(normalizePath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const currentPath = normalizePath(clientPath ?? nextPathname ?? "/");

  const handleClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    const target = e.target as HTMLElement | null;
    const anchor = target?.closest("a");
    if (!anchor) return;

    if (
      (anchor.target && anchor.target !== "_self") ||
      anchor.hasAttribute("download")
    ) {
      return;
    }

    const href = anchor.getAttribute("href");
    if (!href || !href.startsWith("/")) return;

    const dest = normalizePath(href);
    if (!KNOWN_ROUTES.has(dest)) return;

    e.preventDefault();
    e.stopPropagation();

    if (dest !== normalizePath(window.location.pathname)) {
      window.history.pushState(null, "", dest);
    }
    setClientPath(dest);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case "/":
        return <LandingPage />;
      case "/dashboard":
        return <Dashboard />;
      case "/jurnal":
      case "/journal":
        return <Journal />;
      case "/ai-companion":
        return <AiCompanion />;
      case "/mood-food":
        return <MoodFoodAnalyzer />;
      case "/tele-screening":
        return <TeleScreening />;
      case "/roleplay":
        return <RoleplayPsy />;
      case "/game-adventure":
        return <GameAdventure />;
      case "/game-breath":
        return <GameBreathing />;
      case "/game-healing":
        return <GameHealing />;
      case "/game-siagaminang":
        return <GameSiagaMinang />;
      case "/game-quake":
        return <GameQuake />;
      default:
        return children;
    }
  };

  return (
    <div
      onClickCapture={handleClickCapture}
      className={`min-h-screen transition-colors duration-700 ${theme.bg} ${theme.text} font-sans selection:bg-black selection:text-white`}
    >
      <Navbar />
      {renderPage()}
    </div>
  );
}
