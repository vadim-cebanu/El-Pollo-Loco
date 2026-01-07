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
}