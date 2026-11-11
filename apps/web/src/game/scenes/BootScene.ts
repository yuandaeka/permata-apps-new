import * as Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    /* ===============================
       TILEMAP & TILESETS
    =============================== */
    this.load.tilemapTiledJSON("houseMap", "/tiles/house_map.json");

    // TILESETS (NAMA HARUS SAMA DENGAN TILED)
    this.load.image("Interior", "/tiles/Interior.png");
    this.load.image("interior", "/tiles/Interior.png");
    this.load.image("walls_floor", "/tiles/walls_floor.png");
    this.load.image(
      "Doors_windows_animation",
      "/tiles/Doors_windows_animation.png",
    );
    this.load.image(
      "Doors_window_animation",
      "/tiles/Doors_windows_animation.png",
    );

    /* ===============================
       AUDIO
    =============================== */
    this.load.audio("quake", "/audio/quake.mp3");
    this.load.audio("bgm", "/audio/bgm.mp3");
  }

  create() {
    this.scene.start("MenuScene");
  }
}
