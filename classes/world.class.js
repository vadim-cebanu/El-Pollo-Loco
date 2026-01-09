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
 * Stores the vertical position from the previous frame.
 * Used to detect vertical movement direction and
 * to determine whether the object was above another object
 * before a collision occurred.
 *
 * This is essential for reliable "jump-on-enemy" detection,
 * independent of frame rate or vertical speed values.
 *
 * @type {number}
 */
    previousY = 0;

    /**
     * Creates a new World instance
     * @param {HTMLCanvasElement} canvas - Game canvas element
     * @param {Keyboard} keyboard - Keyboard input handler
     * @param {AudioManager} audioManager - Audio manager instance
     */
    constructor(canvas, keyboard, audioManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.audioManager = audioManager;
        this.setWorld();
        this.draw();
        this.run();
    }

    /**
     * Sets the world reference in character
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Main game loop - runs every 100ms
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
        }, 100);
    }

    /**
     * Removes dead enemies and broken bottles after delay
     */
    cleanupDeadObjects() {
        this.level.enemies = this.level.enemies.filter(enemy => {
            if (enemy.dead && enemy.removeTime) {
                return new Date().getTime() - enemy.removeTime < 1000;
            }
            return true;
        });

        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.isRemoved);
    }

    /**
     * Checks if player wants to throw a bottle
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.collectedBottles > 0 && this.canThrow && !this.character.isDead()) {
            let bottle = new ThrowableObject(
                this.character.x + 50,
                this.character.y + 100,
                this.character.otherDirection
            );
            this.throwableObjects.push(bottle);
            this.collectedBottles--;
            this.bottleBar.setPercentage(this.collectedBottles * 10);
            this.audioManager.playBottleThrow();
            this.canThrow = false;

            setTimeout(() => {
                this.canThrow = true;
            }, 500);
        }
    }

    /**
     * Checks collision between character and enemies
     */
    checkCollision() {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.dead && this.character.isColliding(enemy)) {
                if (this.isJumpingOnEnemy(enemy)) {
                    this.handleEnemyJumpKill(enemy);
                } else {
                    this.handleCharacterHit();
                }
            }
        });
    }

    /**
  * Determines whether the character is jumping on top of an enemy.
  *
  * A valid "jump-on-enemy" occurs only if:
  * - The character was above the enemy in the previous frame
  * - A collision is currently happening
  * - The character is in the air (not sliding or walking)
  * - The enemy is not an endboss
  *
  * This approach ensures stable and deterministic collision
  * behavior, independent of frame rate and vertical speed.
  *
  * @param {MovableObject} enemy - The enemy to check collision against
  * @returns {boolean} True if the character is landing on the enemy
  */
    isJumpingOnEnemy(enemy) {
        return (
            this.character.previousY + this.character.height - this.character.offset.bottom <= enemy.y + enemy.offset.top &&
            this.character.isColliding(enemy) &&
            this.character.isAboveGround() &&
            !(enemy instanceof Endboss)
        );
    }

    /**
     * Handles killing an enemy by jumping on it
     * @param {MovableObject} enemy - The enemy to kill
     */
    handleEnemyJumpKill(enemy) {
        enemy.dead = true;
        enemy.speed = 0;
        enemy.removeTime = new Date().getTime();
        if (enemy.die) enemy.die();
        this.audioManager.playChickenDead();
        this.character.speedY = 15;
    }

    /**
     * Handles character getting hit by enemy
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
     * Checks if endboss should be activated
     */
    checkEndbossActivation() {
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && !endboss.hadFirstContact && this.character.x > 2000) {
            endboss.activate();
            this.endbossActivated = true;
            this.character.setScared(true);
            this.audioManager.playEndbossApproach();
        }
    }

    /**
     * Checks if game is over (character dead)
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
     * Checks if game is won (endboss dead)
     */
    checkGameWon() {
        let endboss = this.level.enemies.find(e => e instanceof Endboss);
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
     * Main draw loop - renders all game objects
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.restore();

        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.endbossActivated) {
            this.addToMap(this.endbossBar);
        }

        if (!this.gameOver) {
            requestAnimationFrame(() => this.draw());
        }
    }

    /**
     * Adds multiple objects to the map
     * @param {DrawableObject[]} objects - Array of objects to draw
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

    /**
     * Adds a single object to the map
     * @param {DrawableObject} mo - Object to draw
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
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}