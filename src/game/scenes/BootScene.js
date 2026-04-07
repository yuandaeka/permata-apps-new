import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    /* ===============================
       TILEMAP & TILESETS
    =============================== */
    this.load.tilemapTiledJSON(
      "houseMap",
      "/src/assets/tiles/house_map.json"
    );

    // TILESETS (NAMA HARUS SAMA DENGAN TILED)
    this.load.image("interior", "/src/assets/tiles/interior.png");
    this.load.image("walls_floor", "/src/assets/tiles/walls_floor.png");
    this.load.image(
      "Doors_window_animation",
      "/src/assets/tiles/Doors_window_animation.png"
    );

    /* ===============================
       AUDIO
    =============================== */
    this.load.audio("quake", "/src/assets/audio/quake.mp3");
    this.load.audio("bgm", "/src/assets/audio/bgm.mp3");
  }

  create() {
    this.scene.start("MenuScene");
  }
}