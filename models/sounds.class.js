class AudioManager {
    constructor() {
       
        this.walkingSound = new Audio('audio/sounds/character/characterRun.mp3');
        this.jumpSound = new Audio('audio/sounds/character/characterJump.wav');
        this.hurtSound = new Audio('audio/sounds/character/characterDamage.mp3');
        this.dieSound = new Audio('audio/sounds/character/characterDead.wav');
        this.snoreSound = new Audio('audio/sounds/character/characterSnoring.mp3');

        this.chickenDeadSound = new Audio('audio/sounds/chicken/chickenDead.mp3');

        this.coinSound = new Audio('audio/sounds/collectibles/collectSound.wav');
        this.bottleCollectSound = new Audio('audio/sounds/collectibles/bottleCollectSound.wav');

        this.endbossHurtSound = new Audio('audio/sounds/chicken/chickenDead2.mp3');
        this.endbossDeadSound = new Audio('audio/sounds/endboss/endboss_dead.mp3');
        this.endbossAttackSound = new Audio('audio/sounds/endboss/endbossApproach.wav');

    
        this.bottleThrowSound = new Audio('audio/sounds/throwable/bottle_throw.mp3');
        this.bottleSplashSound = new Audio('audio/sounds/throwable/bottleBreak.mp3');
        this.isMuted = false;
    }

    playSound(sound) {
        if (!this.isMuted && sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Audio play error:', e));
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
    }
}