import { useEffect } from "react";
import Phaser from "phaser";
import config from "../game/config";

export default function GameQuake() {
  useEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div id="game-container" />
    </div>
  );
}