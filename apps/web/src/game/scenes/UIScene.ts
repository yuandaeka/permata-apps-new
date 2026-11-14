import * as Phaser from "phaser";
import { gameTokens } from "../tokens";

export default class UIScene extends Phaser.Scene {
  private parentScene!: Phaser.Scene & {
    resumeGame: (correct: boolean) => void;
  };

  constructor() {
    super("UIScene");
  }

  init(data: {
    parent: Phaser.Scene & { resumeGame: (correct: boolean) => void };
  }) {
    this.parentScene = data.parent;
  }

  create() {
    this.add.rectangle(450, 300, 700, 400, 0x1c1917, 0.9);

    this.add
      .text(
        450,
        200,
        "Apa yang harus dilakukan saat terjadi kebakaran kecil?",
        {
          fontSize: "20px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: 600 },
        },
      )
      .setOrigin(0.5);

    const benar = this.add
      .text(450, 290, "Gunakan APAR / matikan sumber api", {
        fontSize: "18px",
        backgroundColor: gameTokens.success,
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive();

    const salah = this.add
      .text(450, 350, "Panik dan lari tanpa matikan api", {
        fontSize: "18px",
        backgroundColor: gameTokens.warning,
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive();

    benar.on("pointerdown", () => {
      this.parentScene.resumeGame(true);
      this.scene.stop();
    });

    salah.on("pointerdown", () => {
      this.parentScene.resumeGame(false);
      this.scene.stop();
    });
  }
}
