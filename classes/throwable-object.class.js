/**
 * Throwable salsa bottle object. Spins while flying and plays a splash animation on impact.
 * @class ThrowableObject
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /** Flag set when a collision was registered (not used for splash start) */
  hasHit = false;

  /** True after the bottle has broken (splash started) */
  isBroken = false;

  /**
   * Interval ID for the throw loop (requested via setInterval)
   * @type {number|undefined}
   */
  throwInterval;

  /**
   * Direction flag: true if thrown to the left, false if to the right.
   * @type {boolean}
   */
  throwLeft;

  /**
   * Rotation animation frames while the bottle is in the air.
   * @type {string[]}
   */
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Splash animation frames after the bottle breaks.
   * @type {string[]}
   */
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a throwable bottle at the given position and direction.
   * @param {number} x - Initial X coordinate.
   * @param {number} y - Initial Y coordinate.
   * @param {boolean} throwLeft - True to throw left, false to throw right.
   */
  constructor(x, y, throwLeft) {
    super().loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throwLeft = throwLeft;
    this.throw();
  }

  /**
   * Starts the throw: applies gravity, moves horizontally and plays rotation frames.
   * Uses a 25ms interval until the bottle breaks.
   * @returns {void}
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      if (!this.isBroken) {
        if (this.throwLeft) {
          this.x -= 10;
        } else {
          this.x += 10;
        }
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 25);
  }

  /**
   * Triggers the splash/break animation, clears the throw interval,
   * and swaps through splash frames. Interval auto-clears when finished.
   * @returns {void}
   */
  splash() {
    this.isBroken = true;
    clearInterval(this.throwInterval);
    let splashIndex = 0;
    const splashInterval = setInterval(() => {
      if (splashIndex < this.IMAGES_SPLASH.length) {
        this.loadImage(this.IMAGES_SPLASH[splashIndex]);
        splashIndex++;
      } else {
        clearInterval(splashInterval);
      }
    }, 50);
  }
}
