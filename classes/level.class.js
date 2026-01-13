/**
 * Represents a game level with all its objects
 * @class Level
 */
class Level {
  /** @type {MovableObject[]} Array of enemies */
  enemies;
  /** @type {Cloud[]} Array of clouds */
  clouds;
  /** @type {BackgroundObject[]} Array of background objects */
  backgroundObjects;
  /** @type {Coin[]} Array of coins */
  coins;
  /** @type {Bottle[]} Array of bottles */
  bottles;
  /** @type {number} X position where level ends */
  level_end_x = 2700;

  /**
   * Creates a new Level instance
   * @param {MovableObject[]} enemies - Array of enemies
   * @param {Cloud[]} clouds - Array of clouds
   * @param {BackgroundObject[]} backgroundObjects - Array of background objects
   * @param {Coin[]} coins - Array of coins
   * @param {Bottle[]} bottles - Array of bottles
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
