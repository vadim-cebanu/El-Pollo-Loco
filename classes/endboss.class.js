/**
 * Represents the endboss enemy
 * @class Endboss
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /** @type {number} Endboss height */
  height = 400;
  /** @type {number} Endboss width */
  width = 250;
  /** @type {number} Y position */
  y = 55;
  /** @type {number} Energy/health points */
  energy = 100;
  /** @type {boolean} Whether endboss has been activated */
  hadFirstContact = false;
  /** @type {Object} Collision offsets */
  offset = {
    top: 60,
    left: 30,
    right: 30,
    bottom: 20,
  };

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Creates a new Endboss instance
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.speed = 1;
    this.animate();
  }

  /**
   * Starts the animation loops for endboss behavior
   */
  animate() {
    setInterval(() => {
      this.handleMovement();
    }, 1000 / 60);

    setInterval(() => {
      this.handleAnimationState();
    }, 200);
  }

  /**
   * Handles endboss movement towards player
   */
  handleMovement() {
    if (!this.hadFirstContact || this.isDead()) return;

    this.speed = this.energy < 50 ? 2.5 : 1.5;

    const characterX = world.character.x;
    const distance = Math.abs(this.x - characterX);

    if (distance < 50) return;

    if (this.x > characterX) {
      this.moveLeft();
      this.otherDirection = false;
    } else {
      this.moveRight();
      this.otherDirection = true;
    }
  }

  /**
   * Handles animation states based on endboss condition
   */
  handleAnimationState() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.hadFirstContact) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  /**
   * Activates the endboss when player gets close
   */
  activate() {
    this.hadFirstContact = true;
  }

  /**
   * Reduces endboss energy when hit
   */
  hit() {
    this.energy -= 10;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }
}
