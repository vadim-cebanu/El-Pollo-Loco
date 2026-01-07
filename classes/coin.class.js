/**
 * Represents a collectible coin
 * @class Coin
 * @extends MovableObject
 */
class Coin extends MovableObject {
    /** @type {number} Coin height */
    height = 100;
    /** @type {number} Coin width */
    width = 100;
    /** @type {Object} Collision offsets */
    offset = {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30
    };

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a new Coin instance
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Starts the coin animation
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 300);
    }
}