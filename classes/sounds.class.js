/**
 * Manages all game audio
 * @class AudioManager
 */
class AudioManager {
    /** @type {boolean} Whether audio is muted */
    isMuted = false;

    /**
     * Creates a new AudioManager instance
     */
    constructor() {
        this.initSounds();
    }

    /**
     * Initializes all game sounds
     */
    initSounds() {
        this.backgroundMusic = new Audio('audio/sounds/effect/background_music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;

        this.walkingSound = new Audio('audio/sounds/character/characterRun.mp3');
        this.walkingSound.volume = 0.5;
        this.walkingSound.loop = true;

        this.jumpSound = new Audio('audio/sounds/character/characterJump.wav');
        this.jumpSound.volume = 0.6;

        this.hurtSound = new Audio('audio/sounds/character/characterDamage.mp3');
        this.hurtSound.volume = 0.7;

        this.deadSound = new Audio('audio/sounds/character/characterDead.wav');
        this.deadSound.volume = 0.8;

        this.snoreSound = new Audio('audio/sounds/character/characterSnoring.mp3');
        this.snoreSound.volume = 0.4;
        this.snoreSound.loop = true;

        this.chickenDeadSound = new Audio('audio/sounds/chicken/chickenDead.mp3');
        this.chickenDeadSound.volume = 0.6;

        this.endbossApproachSound = new Audio('audio/sounds/endboss/endbossApproach.wav');
        this.endbossApproachSound.volume = 0.7;

        this.coinSound = new Audio('audio/sounds/collectibles/collectSound.wav');
        this.coinSound.volume = 0.5;

        this.bottleCollectSound = new Audio('audio/sounds/collectibles/bottleCollectSound.wav');
        this.bottleCollectSound.volume = 0.5;

        this.bottleBreakSound = new Audio('audio/sounds/throwable/bottleBreak.mp3');
        this.bottleBreakSound.volume = 0.6;

        this.gameLostSound = new Audio('audio/sounds/effect/game_lost.mp3');
        this.gameLostSound.volume = 0.6;

        this.surpriseSound = new Audio('audio/sounds/effect/surprise.mp3');
        this.surpriseSound.volume = 0.6;


        this.gameWonSound = new Audio('audio/sounds/effect/win.mp3');
        this.gameWonSound.volume = 0.6;
    }

    /**
     * Plays a sound if not muted
     * @param {HTMLAudioElement} sound - Sound to play
     */
    play(sound) {
        if (!this.isMuted && sound) {
            sound.currentTime = 0;
            sound.play().catch(e => { });
        }
    }

    /**
     * Plays background music if not muted
     */
    playBackgroundMusic() {
        if (!this.isMuted && this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(e => { });
        }
    }

    /**
     * Pauses background music
     */
    pauseBackgroundMusic() {
        this.backgroundMusic.pause();
    }

    /**
     * Stops a single sound
     * @param {HTMLAudioElement} sound - Sound to stop
     */
    stopSound(sound) {
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    /**
     * Stops ALL game sounds immediately
     */
    stopAllSounds() {
        this.stopSound(this.backgroundMusic);
        this.stopSound(this.walkingSound);
        this.stopSound(this.snoreSound);
        this.stopSound(this.jumpSound);
        this.stopSound(this.hurtSound);
        this.stopSound(this.deadSound);
        this.stopSound(this.chickenDeadSound);
        this.stopSound(this.endbossApproachSound);
        this.stopSound(this.coinSound);
        this.stopSound(this.bottleCollectSound);
        this.stopSound(this.bottleBreakSound);
        this.stopSound(this.surpriseSound);
    }

    /**
     * Plays chicken death sound
     */
    playChickenDead() {
        if (this.isMuted) return;
        let sound = new Audio('audio/sounds/chicken/chickenDead.mp3');
        sound.volume = 0.6;
        sound.play().catch(e => { });
    }

    /**
     * Plays jump sound
     */
    playJump() {
        if (this.isMuted) return;
        this.play(this.jumpSound);
    }

    /**
     * Plays hurt sound
     */
    playHurt() {
        if (this.isMuted) return;
        this.play(this.hurtSound);
    }

    /**
     * Plays death sound
     */
    playDead() {
        if (this.isMuted) return;
        this.play(this.deadSound);
    }

    /**
     * Plays bottle throw sound
     */
    playBottleThrow() {
        if (this.isMuted) return;
        let sound = new Audio('audio/sounds/effect/throw.mp3');
        sound.volume = 0.4;
        sound.play().catch(e => { });
    }

    /**
     * Plays bottle splash/break sound
     */
    playBottleSplash() {
        if (this.isMuted) return;
        let sound = new Audio('audio/sounds/throwable/bottleBreak.mp3');
        sound.volume = 0.6;
        sound.play().catch(e => { });
    }

    /**
     * Plays coin collect sound
     */
    playCoin() {
        if (this.isMuted) return;
        let sound = new Audio('audio/sounds/collectibles/collectSound.wav');
        sound.volume = 0.5;
        sound.play().catch(e => { });
    }

    /**
     * Plays bottle collect sound
     */
    playBottleCollect() {
        if (this.isMuted) return;
        let sound = new Audio('audio/sounds/collectibles/bottleCollectSound.wav');
        sound.volume = 0.5;
        sound.play().catch(e => { });
    }

    /**
     * Plays endboss approach sound
     */
    playEndbossApproach() {
        if (this.isMuted) return;
        this.play(this.endbossApproachSound);
    }

    /**
     * Plays surprise sound
     */
    playSurpriseSound() {
        if (this.isMuted) return;
        this.play(this.surpriseSound);
    }

    /**
     * Plays endboss hurt sound
     */
    playEndbossHurt() {
        if (this.isMuted) return;
        let sound = new Audio('audio/sounds/endboss/endbossApproach.wav');
        sound.volume = 0.5;
        sound.play().catch(e => { });
    }

    /**
     * Plays endboss death sound
     */
    playEndbossDead() {
        if (this.isMuted) return;
        this.play(this.endbossApproachSound);
    }

    /**
     * Starts snoring sound if not muted
     */
    startSnoring() {
        if (this.isMuted) return;
        if (this.snoreSound.paused) {
            this.snoreSound.play().catch(e => { });
        }
    }

    /**
     * Stops snoring sound
     */
    stopSnoring() {
        this.stopSound(this.snoreSound);
    }

    /**
     * Plays game lost sound after stopping all other sounds
     */
    playGameLost() {
        this.stopAllSounds();
        if (!this.isMuted) {
            this.play(this.gameLostSound);
        }
    }

    /**
        * Plays game won sound after stopping all other sounds
        * @returns {void}
        */
    playGameWon() {
        this.stopAllSounds();
        if (!this.isMuted) {
            this.play(this.gameWonSound);
        }
    }
}