/**
 * Base class for all movable objects
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /**
  * Applies gravity and vertical movement to the object.
  *
  * The method also stores the object's previous Y position
  * before applying gravity. This allows precise detection
  * of vertical collision transitions (e.g. landing on enemies),
  * avoiding unreliable checks based on speed or timing.
  *
  * Gravity is applied only while the object is above ground
  * or moving upwards. Once the object reaches the ground,
  * its vertical speed is reset.
  *
  * @returns {void}
  */
    applyGravity() {
        setInterval(() => {
            this.previousY = this.y;

            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

            if (!this.isAboveGround() && !(this instanceof ThrowableObject)) {
                this.y = 145;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if object is above ground
     * @returns {boolean} True if above ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 145;
        }
    }

    /**
 * Checks if the character landed on top of an enemy.
 *
 * @param {MovableObject} enemy
 * @returns {boolean}
 */
isLandingOnEnemy(enemy) {
    const characterBottomBefore =
        this.character.previousY + this.character.height;

    const enemyTop =
        enemy.y + enemy.offset.top;

    return (
        characterBottomBefore <= enemyTop &&
        this.character.speedY < 0
    );
}

    /**
     * Checks collision with another object
     * @param {MovableObject} mo - The object to check collision with
     * @returns {boolean} True if colliding
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Reduces energy when hit
     * @returns {void}
     */
    hit() {
        this.energy -= 15;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if object was recently hurt
     * @returns {boolean} True if hurt
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 1000;
    }

    /**
     * Checks if object is dead
     * @returns {boolean} True if dead
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Plays an animation sequence
     * @param {string[]} images - Array of image paths
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump
     * @returns {void}
     */
    jump() {
        this.speedY = 30;
    }
}