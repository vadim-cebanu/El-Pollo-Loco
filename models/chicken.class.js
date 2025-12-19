class Chicken extends MovableObject {
    y = 360;
    height = 60;
    width = 60;

    offset = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    };
    
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    isDead = false;

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.img_dead = new Image();
    this.img_dead.src = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
    }

animate() {
    let walkInterval = setInterval(() => {
        if (!this.isDead) {
            this.moveLeft();
        } else {
            clearInterval(walkInterval);
        }
    }, 1000 / 60);
    
    setInterval(() => {
        if (this.isDead) {
            this.img = this.img_dead;
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }, 200);
}

    hit() {
        this.isDead = true;
    }
}