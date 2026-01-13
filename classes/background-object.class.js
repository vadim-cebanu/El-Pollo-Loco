/**
 * Represents a background layer object
 * @class BackgroundObject
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /** @type {number} Background width */
  width = 720;
  /** @type {number} Background height */
  height = 480;

  /**
   * Creates a new BackgroundObject instance
   * @param {string} imagePath - Path to the background image
   * @param {number} x - X position of the background
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }

  /**
   * Draws the background with NO gaps using floor positioning
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @override
   */
  draw(ctx) {
    if (this.img && this.img.complete) {
      let drawX = Math.floor(this.x);
      let drawY = Math.floor(this.y);
      ctx.drawImage(
        this.img, 0, 0,
        this.img.width,
        this.img.height,
        drawX,
        drawY,
        this.width + 1,
        this.height
      );
    }
  }
}
