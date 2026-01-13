/**
 * Small chicken enemy
 * @class SmallChicken
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
  /** @type {number} Vertical position on ground */
  y = 385;
  /** @type {number} Sprite height */
  height = 40;
  /** @type {number} Sprite width */
  width = 40;
  /** @type {boolean} Whether the chicken is dead */
  dead = false;

  /**
   * Collision box offsets
   * @type {{top:number,left:number,right:number,bottom:number}}
   */
  offset = {
    top: -15,
    left: 8,
    right: 5,
    bottom: 5,
  };

  /** @type {string[]} Walking animation frames */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  /** @type {string[]} Dead frame */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 300 + Math.random() * 2000;
    this.speed = 0.15 + Math.random() * 0.3;
    this.animate();
  }

  /**
   * Starts movement and animation loops
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.dead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (this.dead) {
        this.loadImage(this.IMAGES_DEAD[0]);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }
  /**
   * Marks chicken dead and shows the dead sprite
   */
  die() {
    this.dead = true;
    this.speed = 0;
    this.loadImage(this.IMAGES_DEAD[0]);
  }
}
