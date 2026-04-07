import Phaser from "phaser";

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  init(data) {
    this.win = data.win;
  }

  create() {
    const text = this.win
      ? "🏆 KAMU BERHASIL KELUAR!"
      : "💀 GAME OVER";

    this.add.text(450, 300, text, {
      fontSize: "40px",
      color: "#000",
    }).setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}