class MovableObject extends DrawableObject{
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

  offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };



    applyGravity() {
        setInterval(() => {
            if (this.isAboveGroung() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGroung() {
        if ( this instanceof ThwrowableObjects){
            return true;
        } else {
        return this.y < 180;
    }
}


 



isColliding(mo){
    return this.x + this.offset.left+this.width - this.offset.right - this.offset.left > mo.x + mo.offset.left &&
            this.y + this.offset.top + this.height- this.offset.top - this.offset.bottom > mo.y +mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.offset.left + mo.width - mo.offset.left - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.offset.top + mo.height - mo.offset.top - mo.offset.bottom;

}

hit(){

    this.energy -=5 ;
    if(this.energy < 0 ){
        this.energy = 0;
    } else  {
        this.lastHit = new Date().getTime();
    }
}
 
isHurt(){
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed < 1000;
}


isDead(){
    return this.energy == 0;
}

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }



    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;

    }


    moveLeft() {

        this.x -= this.speed;
    }

    jump() {
        this.speedY = 30;
    }
}