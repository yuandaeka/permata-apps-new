import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    /* ===============================
       AUDIO
    =============================== */
    this.bgm = this.sound.add("bgm", { loop: true, volume: 0.4 });
    this.quakeSound = this.sound.add("quake", { loop: true, volume: 0.6 });

    this.bgm.play();
    this.quakeSound.play();

    /* ===============================
       TILEMAP
    =============================== */
    const map = this.make.tilemap({ key: "houseMap" });

    // 🔥 AMBIL SEMUA TILESET OTOMATIS (ANTI SALAH NAMA)
    const tilesets = map.tilesets.map((tileset) =>
      map.addTilesetImage(tileset.name, tileset.name)
    );

    // LAYERS (NAMA ASLI DARI TILED)
    const floorLayer = map.createLayer("Floor", tilesets);
    const wallLayer = map.createLayer("Walls", tilesets);

    // DECOR (NO COLLISION)
    map.createLayer("Windows", tilesets);
    map.createLayer("Boxes", tilesets);
    map.createLayer("Objects1", tilesets);
    map.createLayer("Objects2", tilesets);
    map.createLayer("Tile Layer 6", tilesets);

    // COLLISION
    if (floorLayer) floorLayer.setCollisionByProperty({ collides: true });
    if (wallLayer) wallLayer.setCollisionByProperty({ collides: true });

    /* ===============================
       WORLD & CAMERA
    =============================== */
    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    );

    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    );

    this.cameras.main.shake(1200, 0.01);

    /* ===============================
       PLAYER
    =============================== */
    this.player = this.physics.add.sprite(100, 300, "__DEFAULT");
    this.player.setDisplaySize(32, 48);
    this.player.setTint(0x38bdf8);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, floorLayer);
    this.physics.add.collider(this.player, wallLayer);

    /* ===============================
       FIRE (QUIZ TRIGGER)
    =============================== */
    const fire = this.add.rectangle(600, 400, 48, 48, 0xef4444);
    this.physics.add.existing(fire, true);
    this.fire = fire;

    this.hitFire = false;

    this.physics.add.overlap(this.player, fire, () => {
      if (this.hitFire) return;

      this.hitFire = true;
      this.scene.pause();
      this.scene.launch("UIScene", { parent: this });
    });

    /* ===============================
       EXIT
    =============================== */
    const exit = this.add.rectangle(
      map.widthInPixels - 100,
      400,
      64,
      96,
      0x22c55e
    );
    this.physics.add.existing(exit, true);
    this.exit = exit;

    this.physics.add.overlap(this.player, exit, () => {
      this.bgm.stop();
      this.quakeSound.stop();
      this.scene.start("ResultScene", { win: true });
    });

    /* ===============================
       CAMERA FOLLOW
    =============================== */
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    /* ===============================
       INPUT
    =============================== */
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-420);
    }
  }

  resumeGame(correct) {
    if (correct) {
      this.fire.destroy();
      this.scene.resume();
    } else {
      this.bgm.stop();
      this.quakeSound.stop();
      this.scene.start("ResultScene", { win: false });
    }
  }
}