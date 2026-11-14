"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

// Phaser must only run in browser - dynamic import with SSR disabled
function GameQuakeInner() {
  useEffect(() => {
    let isMounted = true;
    let gameInstance: import("phaser").Game | null = null;

    const initGame = async () => {
      const Phaser = await import("phaser");
      const { default: config } = await import("@/game/config");
      if (!isMounted) return;
      gameInstance = new Phaser.Game(config);
    };

    initGame();

    return () => {
      isMounted = false;
      if (gameInstance) {
        gameInstance.destroy(true);
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-canvas">
      <div id="game-container" />
    </div>
  );
}

export default GameQuakeInner;
