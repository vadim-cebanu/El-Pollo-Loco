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
   * @returns {void}
   */
  initSounds() {
    this.initBackgroundMusic();
    this.initCharacterSounds();
    this.initEnemySounds();
    this.initCollectibleSounds();
    this.initEffectSounds();
  }

  /**
   * Initializes background music
   * @returns {void}
   */
  initBackgroundMusic() {
    this.backgroundMusic = new Audio(
      "audio/sounds/effect/background_music.mp3"
    );
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
  }

  /**
   * Initializes character sounds
   * @returns {void}
   */
  initCharacterSounds() {
    this.walkingSound = this.createSound( "audio/sounds/character/characterRun.mp3", 0.5, true);
    this.jumpSound = this.createSound("audio/sounds/character/characterJump.wav", 0.6 );
    this.hurtSound = this.createSound( "audio/sounds/character/characterDamage.mp3", 0.7 );
    this.deadSound = this.createSound( "audio/sounds/character/characterDead.wav", 0.8 );
    this.snoreSound = this.createSound("audio/sounds/character/characterSnoring.mp3", 0.4, true );
  }

  /**
   * Initializes enemy sounds
   * @returns {void}
   */
  initEnemySounds() {
    this.chickenDeadSound = this.createSound( "audio/sounds/chicken/chickenDead.mp3", 0.6 );
    this.endbossApproachSound = this.createSound( "audio/sounds/endboss/endbossApproach.wav", 0.7);
  }

  /**
   * Initializes collectible sounds
   * @returns {void}
   */
  initCollectibleSounds() {
    this.coinSound = this.createSound( "audio/sounds/collectibles/collectSound.wav", 0.5);
    this.bottleCollectSound = this.createSound("audio/sounds/collectibles/bottleCollectSound.wav", 0.5);
    this.bottleBreakSound = this.createSound( "audio/sounds/throwable/bottleBreak.mp3", 0.6);
  }

  /**
   * Initializes effect sounds
   * @returns {void}
   */
  initEffectSounds() {
    this.gameLostSound = this.createSound("audio/sounds/effect/game_lost.mp3",0.6);
    this.surpriseSound = this.createSound("audio/sounds/effect/surprise.mp3", 0.6);
    this.gameWonSound = this.createSound("audio/sounds/effect/win.mp3", 0.6);
  }

  /**
   * Creates a new audio element with volume and loop settings
   * @param {string} src - Audio file path
   * @param {number} volume - Volume level (0-1)
   * @param {boolean} loop - Whether to loop the sound
   * @returns {HTMLAudioElement} Audio element
   */
  createSound(src, volume, loop = false) {
    let sound = new Audio(src);
    sound.volume = volume;
    sound.loop = loop;
    return sound;
  }

  /**
   * Plays a sound if not muted
   * @param {HTMLAudioElement} sound - Sound to play
   * @returns {void}
   */
  play(sound) {
    if (!this.isMuted && sound) {
      sound.currentTime = 0;
      sound.play().catch((e) => {});
    }
  }

  /**
   * Plays background music if not muted
   * @returns {void}
   */
  playBackgroundMusic() {
    if (!this.isMuted && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch((e) => {});
    }
  }

  /**
   * Pauses background music
   * @returns {void}
   */
  pauseBackgroundMusic() {
    this.backgroundMusic.pause();
  }

  /**
   * Stops a single sound
   * @param {HTMLAudioElement} sound - Sound to stop
   * @returns {void}
   */
  stopSound(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Stops ALL game sounds immediately
   * @returns {void}
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
   * @returns {void}
   */
  playChickenDead() {
    if (this.isMuted) return;
    let sound = new Audio("audio/sounds/chicken/chickenDead.mp3");
    sound.volume = 0.6;
    sound.play().catch((e) => {});
  }

  /**
   * Plays jump sound
   * @returns {void}
   */
  playJump() {
    if (this.isMuted) return;
    this.play(this.jumpSound);
  }

  /**
   * Plays hurt sound
   * @returns {void}
   */
  playHurt() {
    if (this.isMuted) return;
    this.play(this.hurtSound);
  }

  /**
   * Plays death sound
   * @returns {void}
   */
  playDead() {
    if (this.isMuted) return;
    this.play(this.deadSound);
  }

  /**
   * Plays bottle throw sound
   * @returns {void}
   */
  playBottleThrow() {
    if (this.isMuted) return;
    let sound = new Audio("audio/sounds/effect/throw.mp3");
    sound.volume = 0.4;
    sound.play().catch((e) => {});
  }

  /**
   * Plays bottle splash/break sound
   * @returns {void}
   */
  playBottleSplash() {
    if (this.isMuted) return;
    let sound = new Audio("audio/sounds/throwable/bottleBreak.mp3");
    sound.volume = 0.6;
    sound.play().catch((e) => {});
  }

  /**
   * Plays coin collect sound
   * @returns {void}
   */
  playCoin() {
    if (this.isMuted) return;
    let sound = new Audio("audio/sounds/collectibles/collectSound.wav");
    sound.volume = 0.5;
    sound.play().catch((e) => {});
  }

  /**
   * Plays bottle collect sound
   * @returns {void}
   */
  playBottleCollect() {
    if (this.isMuted) return;
    let sound = new Audio("audio/sounds/collectibles/bottleCollectSound.wav");
    sound.volume = 0.5;
    sound.play().catch((e) => {});
  }

  /**
   * Plays endboss approach sound
   * @returns {void}
   */
  playEndbossApproach() {
    if (this.isMuted) return;
    this.play(this.endbossApproachSound);
  }

  /**
   * Plays surprise sound
   * @returns {void}
   */
  playSurpriseSound() {
    if (this.isMuted) return;
    this.play(this.surpriseSound);
  }

  /**
   * Plays endboss hurt sound
   * @returns {void}
   */
  playEndbossHurt() {
    if (this.isMuted) return;
    let sound = new Audio("audio/sounds/endboss/endbossApproach.wav");
    sound.volume = 0.5;
    sound.play().catch((e) => {});
  }

  /**
   * Plays endboss death sound
   * @returns {void}
   */
  playEndbossDead() {
    if (this.isMuted) return;
    this.play(this.endbossApproachSound);
  }

  /**
   * Starts snoring sound if not muted
   * @returns {void}
   */
  startSnoring() {
    if (this.isMuted) return;
    if (this.snoreSound.paused) {
      this.snoreSound.play().catch((e) => {});
    }
  }

  /**
   * Stops snoring sound
   * @returns {void}
   */
  stopSnoring() {
    this.stopSound(this.snoreSound);
  }

  /**
   * Plays game lost sound after stopping all other sounds
   * @returns {void}
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
