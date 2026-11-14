import * as Phaser from "phaser";
import { gameTokens } from "../tokens";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.add
      .text(450, 200, "PERMATA: EVAKUASI GEMPA", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const start = this.add
      .text(450, 300, "▶ MULAI EVAKUASI", {
        fontSize: "24px",
        backgroundColor: gameTokens.action,
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    start.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
