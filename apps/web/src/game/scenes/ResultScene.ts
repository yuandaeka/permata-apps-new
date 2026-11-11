import * as Phaser from "phaser";

export default class ResultScene extends Phaser.Scene {
  private win: boolean = false;

  constructor() {
    super("ResultScene");
  }

  init(data: { win: boolean }) {
    this.win = data.win;
  }

  create() {
    const text = this.win ? "KAMU BERHASIL KELUAR!" : "GAME OVER";

    this.add
      .text(450, 300, text, {
        fontSize: "40px",
        color: "#000",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
