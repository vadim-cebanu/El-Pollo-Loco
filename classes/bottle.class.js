/**
 * Represents a collectible bottle on the ground
 * @class Bottle
 * @extends MovableObject
 */
class Bottle extends MovableObject {
    /** @type {number} Bottle height */
    height = 80;
    /** @type {number} Bottle width */
    width = 70;
    /** @type {number} Y position */
    y = 350;
    /** @type {Object} Collision offsets */
    offset = {
        top: 10,
        left: 20,
        right: 20,
        bottom: 10
    };

    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a new Bottle instance
     * @param {number} x - X position
     */
       constructor(x, y) {
        super().loadImage(this.IMAGES_BOTTLE[0]);
        this.loadImages(this.IMAGES_BOTTLE);
        this.x = x;
        this.y = y || 350;
        this.animate();
    }

    /**
     * Starts the bottle animation
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 500);
    }
}