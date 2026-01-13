/**
 * Represents a moving cloud in the background
 * @class Cloud
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  /** @type {number} Y position */
  y = 20;
  /** @type {number} Cloud height */
  height = 250;
  /** @type {number} Cloud width */
  width = 500;

  /**
   * Creates a new Cloud instance
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 3000;
    this.animate();
  }

  /**
   * Starts the cloud movement animation
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Moves cloud to the left
   */
  moveLeft() {
    this.x -= 0.15;
  }
}
