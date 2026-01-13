/**
 * Represents the game world containing all game objects
 * @class World
 */
class World {
  /** @type {Character} The main character */
  character = new Character();
  /** @type {Level} Current game level */
  level = level1;
  /** @type {HTMLCanvasElement} Game canvas */
  canvas;
  /** @type {CanvasRenderingContext2D} Canvas 2D context */
  ctx;
  /** @type {Keyboard} Keyboard input handler */
  keyboard;
  /** @type {AudioManager} Audio manager */
  audioManager;
  /** @type {number} Camera X position */
  camera_x = 0;
  /** @type {StatusBar} Health status bar */
  statusBar = new StatusBar();
  /** @type {CoinBar} Coin collection bar */
  coinBar = new CoinBar();
  /** @type {BottleBar} Bottle collection bar */
  bottleBar = new BottleBar();
  /** @type {EndbossBar} Endboss health bar */
  endbossBar = new EndbossBar();
  /** @type {ThrowableObject[]} Array of thrown bottles */
  throwableObjects = [];
  /** @type {number} Number of collected coins */
  collectedCoins = 0;
  /** @type {number} Number of collected bottles */
  collectedBottles = 0;
  /** @type {boolean} Whether game is over */
  gameOver = false;
  /** @type {boolean} Whether player can throw */
  canThrow = true;
  /** @type {boolean} Whether endboss has been activated */
  endbossActivated = false;

  /**
   * Creates a new World instance
   * @param {HTMLCanvasElement} canvas - Game canvas element
   * @param {Keyboard} keyboard - Keyboard input handler
   * @param {AudioManager} audioManager - Audio manager instance
   */
  constructor(canvas, keyboard, audioManager) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audioManager = audioManager;
    this.setWorld();
    this.draw();
    this.run();
  }

  /**
   * Sets the world reference in character
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Main game loop - runs collision checks and updates every 100ms
   * @returns {void}
   */
  run() {
    setInterval(() => {
      if (!this.gameOver) {
        this.checkCollision();
        this.checkCoinCollision();
        this.checkBottleCollision();
        this.checkThrowObjects();
        this.checkBottleEnemyCollision();
        this.checkEndbossActivation();
        this.checkGameOver();
        this.checkGameWon();
        this.cleanupDeadObjects();
      }
    }, 25);
  }

  /**
   * Removes dead enemies and broken bottles after delay
   * @returns {void}
   */
  cleanupDeadObjects() {
    this.level.enemies = this.level.enemies.filter((enemy) => {
      if (enemy.dead && enemy.removeTime) {
        return new Date().getTime() - enemy.removeTime < 1000;
      }
      return true;
    });

    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.isRemoved
    );
  }

  /**
   * Checks if player wants to throw a bottle and executes throw
   * @returns {void}
   */
  checkThrowObjects() {
    if (this.canThrowBottle()) {
      this.throwBottle();
      this.updateBottleUI();
      this.audioManager.playBottleThrow();
      this.setThrowCooldown();
    }
  }

  /**
   * Checks if character can throw a bottle
   * @returns {boolean} True if all throw conditions are met
   */
  canThrowBottle() {
    return (
      this.keyboard.D &&
      this.collectedBottles > 0 &&
      this.canThrow &&
      !this.character.isDead()
    );
  }

  /**
   * Creates and throws a new bottle
   * @returns {void}
   */
  throwBottle() {
    let bottle = new ThrowableObject(
      this.character.x + 50,
      this.character.y + 100,
      this.character.otherDirection
    );
    this.throwableObjects.push(bottle);
  }

  /**
   * Updates bottle count and UI bar
   * @returns {void}
   */
  updateBottleUI() {
    this.collectedBottles--;
    this.bottleBar.setPercentage(this.collectedBottles * 10);
  }

  /**
   * Sets cooldown timer for throwing bottles
   * @returns {void}
   */
  setThrowCooldown() {
    this.canThrow = false;
    setTimeout(() => {
      this.canThrow = true;
    }, 500);
  }
  /**
   * Checks for collisions between the character and all enemies.
   * Solves the "double chicken" bug by prioritizing jump kills and
   * verifying the dead state immediately.
   */
  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.dead) {
        return;
      }
      if (this.character.isColliding(enemy)) {
        if (this.isJumpingOnEnemy(enemy)) {
          this.handleEnemyJumpKill(enemy);
        } else if (!enemy.dead) {
          this.handleCharacterHit();
        }
      }
    });
  }

  /**
   * Determines whether the character is jumping on top of an enemy
   * @param {MovableObject} enemy - The enemy to check collision against
   * @returns {boolean} True if the character is landing on the enemy
   */
  isJumpingOnEnemy(enemy) {
    return (
      this.character.isAboveGround() &&
      (this.character.speedY <= 0 ||
        this.character.lastStompTime > new Date().getTime() - 50) &&
      !(enemy instanceof Endboss)
    );
  }

  /**
   * Handles killing an enemy by jumping on it
   * @param {MovableObject} enemy - The enemy to kill
   * @returns {void}
   */
  handleEnemyJumpKill(enemy) {
    enemy.dead = true;
    enemy.speed = 0;
    enemy.removeTime = new Date().getTime();
    this.character.lastStompTime = new Date().getTime();

    if (enemy.die) enemy.die();
    this.audioManager.playChickenDead();
    this.character.speedY = 15;
  }

  /**
   * Handles character getting hit by enemy
   * @returns {void}
   */
  handleCharacterHit() {
    if (!this.character.isHurt() && !this.character.isDead()) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
      this.audioManager.playHurt();
    }
  }

  /**
   * Checks collision between character and coins
   * @returns {void}
   */
  checkCoinCollision() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        this.coinBar.setPercentage(this.collectedCoins * 10);
        this.audioManager.playCoin();
      }
    });
  }

  /**
   * Checks collision between character and bottles on ground
   * @returns {void}
   */
  checkBottleCollision() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.level.bottles.splice(index, 1);
        this.collectedBottles++;
        this.bottleBar.setPercentage(this.collectedBottles * 10);
        this.audioManager.playBottleCollect();
      }
    });
  }

  /**
   * Checks collision between thrown bottles and enemies
   * @returns {void}
   */
  checkBottleEnemyCollision() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !bottle.isBroken) {
          bottle.splash();
          this.audioManager.playBottleSplash();
          this.handleBottleHit(enemy);
        }
      });
    });
  }

  /**
   * Handles bottle hitting an enemy
   * @param {MovableObject} enemy - The enemy that was hit
   * @returns {void}
   */
  handleBottleHit(enemy) {
    if (enemy instanceof Endboss) {
      enemy.hit();
      this.endbossBar.setPercentage(enemy.energy);
      this.audioManager.playEndbossHurt();
    } else {
      enemy.dead = true;
      enemy.speed = 0;
      enemy.removeTime = new Date().getTime();
      if (enemy.die) enemy.die();
      this.audioManager.playChickenDead();
    }
  }

  /**
   * Checks if endboss should be activated when character reaches certain position
   * @returns {void}
   */
  checkEndbossActivation() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && !endboss.hadFirstContact && this.character.x > 2000) {
      endboss.activate();
      this.endbossActivated = true;
      this.character.setScared(true);
      this.audioManager.playEndbossApproach();
    }
  }

  /**
   * Checks if game is over (character dead) and triggers end screen
   * @returns {void}
   */
  checkGameOver() {
    if (this.character.isDead() && !this.gameOver) {
      this.gameOver = true;
      this.character.stopAllCharacterSounds();
      this.audioManager.stopAllSounds();
      this.audioManager.playGameLost();

      setTimeout(() => {
        showEndScreen(false);
      }, 2000);
    }
  }

  /**
   * Checks if game is won (endboss dead) and triggers victory screen
   * @returns {void}
   */
  checkGameWon() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.isDead() && !this.gameOver) {
      this.gameOver = true;
      this.character.stopAllCharacterSounds();
      this.audioManager.stopAllSounds();
      this.audioManager.playGameWon();

      setTimeout(() => {
        showEndScreen(true);
      }, 2000);
    }
  }

  /**
   * Main draw loop - renders all game objects using requestAnimationFrame
   * @returns {void}
   */
  draw() {
    this.clearAndSetupCanvas();
    this.ctx.save();
    this.ctx.translate(Math.floor(this.camera_x), 0);
    this.drawWorldObjects();
    this.ctx.restore();
    this.drawUIElements();
    if (!this.gameOver) {
      requestAnimationFrame(() => this.draw());
    }
  }

  /**
   * Clears canvas and disables image smoothing for pixel-perfect rendering
   * @returns {void}
   */
  clearAndSetupCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.oImageSmoothingEnabled = false;
  }

  /**
   * Draws all world objects affected by camera position
   * @returns {void}
   */
  drawWorldObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
  }

  /**
   * Draws UI elements fixed on screen (not affected by camera)
   * @returns {void}
   */
  drawUIElements() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    if (this.endbossActivated) {
      this.addToMap(this.endbossBar);
    }
  }

  /**
   * Adds multiple objects to the map
   * @param {DrawableObject[]} objects - Array of objects to draw
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
  }

  /**
   * Adds a single object to the map with proper transformations
   * @param {DrawableObject} mo - Object to draw
   * @returns {void}
   */
  addToMap(mo) {
    if (!mo) return;
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips image horizontally for left-facing sprites
   * @param {DrawableObject} mo - Object to flip
   * @returns {void}
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores image after flipping
   * @param {DrawableObject} mo - Object to restore
   * @returns {void}
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
