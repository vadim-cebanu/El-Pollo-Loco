/**
 * Represents the main playable character
 * @class Character
 * @extends MovableObject
 */
class Character extends MovableObject {
    /** @type {number} Character height in pixels */
    height = 280;
    /** @type {number} Character width in pixels */
    width = 130;
    /** @type {number} Y position (ground level) */
    y = 145;
    /** @type {number} Movement speed */
    speed = 5;
    /** @type {boolean} Whether character is scared */
    isScared = false;
    /** @type {boolean} Whether walking sound is currently playing */
    isWalkingSoundPlaying = false;
    /** @type {boolean} Whether character has died (prevents multiple death sounds) */
    hasDied = false;
    /** @type {number} Timestamp of last movement */
    lastMove = new Date().getTime();

    /** @type {Object} Collision box offsets */
    offset = {
        top: 105,
        left: 25,
        right: 35,
        bottom: 3
    };

    /** @type {string[]} Idle animation images */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /** @type {string[]} Long idle (sleeping) animation images */
    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /** @type {string[]} Walking animation images */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /** @type {string[]} Jumping animation images */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    /** @type {string[]} Hurt animation images */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /** @type {string[]} Dead animation images */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /** @type {string[]} Scared animation images */
    IMAGES_SCARED = [
        'img/2_character_pepe/scarry/1.png',
        'img/2_character_pepe/scarry/2.png',
        'img/2_character_pepe/scarry/3.png',
        'img/2_character_pepe/scarry/4.png',
        'img/2_character_pepe/scarry/5.png',
        'img/2_character_pepe/scarry/6.png',
        'img/2_character_pepe/scarry/7.png'
    ];

    /** @type {World} Reference to the game world */
    world;

    /**
     * Creates a new Character instance
     */
    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_SCARED);
        this.applyGravity();
        this.animate();
    }

    /**
     * Starts character animation loops
     */
    animate() {
        setInterval(() => {
            this.handleMovement();
        }, 1000 / 60);

        setInterval(() => {
            this.handleAnimationState();
        }, 100);
    }

    /**
     * Checks if game is over
     * @returns {boolean} True if game is over
     */
    isGameOver() {
        return this.world && this.world.gameOver;
    }

    /**
     * Handles character movement based on keyboard input
     */
    handleMovement() {
        if (this.isGameOver()) {
            this.stopAllCharacterSounds();
            return;
        }

        if (this.isDead()) {
            this.stopAllCharacterSounds();
            return;
        }

        let isMoving = false;

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.lastMove = new Date().getTime();
            isMoving = true;
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.lastMove = new Date().getTime();
            isMoving = true;
        }

        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.lastMove = new Date().getTime();
            this.world.audioManager.playJump();
            this.stopWalkingSound();
            this.stopSnoreSound();
        }

        if (this.world.keyboard.D) {
            this.lastMove = new Date().getTime();
            this.stopSnoreSound();
        }

        this.handleWalkingSound(isMoving);
        let endboss = this.world.level.enemies.find(e => e instanceof Endboss);
        let targetCameraX = -this.x + 100;
        if (
            endboss &&
            endboss.hadFirstContact &&
            endboss.x < this.x &&
            endboss.otherDirection
        ) {
            targetCameraX = -this.x + 300;
        }
        this.world.camera_x += (targetCameraX - this.world.camera_x) * 0.05;
    }


    /**
     * Stops all character-related sounds
     */
    stopAllCharacterSounds() {
        this.stopWalkingSound();
        this.stopSnoreSound();
    }

    /**
     * Handles walking sound based on movement state
     * @param {boolean} isMoving - Whether character is currently moving
     */
    handleWalkingSound(isMoving) {
        if (this.isGameOver() || this.world.audioManager.isMuted) {
            this.stopWalkingSound();
            return;
        }

        if (isMoving && !this.isAboveGround() && !this.isDead()) {
            this.playWalkingSound();
        } else {
            this.stopWalkingSound();
        }
    }

    /**
     * Handles animation state based on character status
     */
    handleAnimationState() {
        if (this.isGameOver()) {
            return;
        }

        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.handleDeathState();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.stopSnoreSound();
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
            this.stopSnoreSound();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
            this.stopSnoreSound();
        } else if (this.isScared) {
            this.playAnimation(this.IMAGES_SCARED);
            this.stopSnoreSound();
        } else if (this.isLongIdle()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            this.playSnoreSound();
        } else {
            this.playAnimation(this.IMAGES_IDLE);
            this.stopSnoreSound();
        }
    }

    /**
     * Handles death state - plays sound and stops all other sounds
     */
    handleDeathState() {
        if (!this.hasDied) {
            this.hasDied = true;
            this.stopAllCharacterSounds();
            this.world.audioManager.playDead();
        }
    }

    /**
     * Checks if character has been idle for more than 5 seconds
     * @returns {boolean} True if character is in long idle state
     */
    isLongIdle() {
        let timePassed = new Date().getTime() - this.lastMove;
        return timePassed > 5000;
    }

    /**
     * Makes the character jump
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Plays walking sound if not muted and game is running
     */
    playWalkingSound() {
        if (this.isGameOver() || this.world.audioManager.isMuted) {
            this.stopWalkingSound();
            return;
        }

        if (!this.isWalkingSoundPlaying && this.world.audioManager.walkingSound) {
            this.world.audioManager.walkingSound.loop = true;
            this.world.audioManager.walkingSound.play().catch(e => { });
            this.isWalkingSoundPlaying = true;
        }
    }

    /**
     * Stops walking sound
     */
    stopWalkingSound() {
        if (this.world && this.world.audioManager && this.world.audioManager.walkingSound) {
            this.world.audioManager.walkingSound.pause();
            this.world.audioManager.walkingSound.currentTime = 0;
            this.isWalkingSoundPlaying = false;
        }
    }

    /**
     * Plays snoring sound if not muted, game is running and not already playing
     */
    playSnoreSound() {
        if (this.isGameOver() || this.world.audioManager.isMuted) {
            this.stopSnoreSound();
            return;
        }

        if (this.world.audioManager.snoreSound && this.world.audioManager.snoreSound.paused) {
            this.world.audioManager.snoreSound.loop = true;
            this.world.audioManager.snoreSound.play().catch(e => { });
        }
    }

    /**
     * Stops snoring sound
     */
    stopSnoreSound() {
        if (this.world && this.world.audioManager && this.world.audioManager.snoreSound) {
            this.world.audioManager.snoreSound.pause();
            this.world.audioManager.snoreSound.currentTime = 0;
        }
    }

    /**
     * Sets the scared state and plays surprise sound
     * @param {boolean} value - Whether character should be scared
     */
    setScared(value) {
        this.isScared = value;
        if (value && !this.isGameOver()) {
            this.world.audioManager.playSurpriseSound();
            setTimeout(() => {
                this.isScared = false;
            }, 2000);
        }
    }
}