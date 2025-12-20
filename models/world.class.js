class World {

   
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
        endbossBar = new EndbossBar();
    throwableObjects = [];
    collectedCoins = 0;
    collectedBottles = 0;
    audioManager = new AudioManager();


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }


    run() {
      setInterval(() => {
        this.checkCollision();
        this.checkThrowObjects();
        this.checkCoinCollision();
        this.checkBottleCollision();
        this.checkEnemyCollision();
        this.checkBottleEnemyCollision();
    }, 200);
}

checkBottleCollision() {
    this.level.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle)) {
            this.level.bottles.splice(index, 1);
            this.collectedBottles++;
            let percentage = (this.collectedBottles / 5) * 100;
            this.bottleBar.setPercentage(percentage);
                        this.audioManager.playSound(this.audioManager.bottleCollectSound); 

        }
    });
}

 checkCoinCollision() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.collectedCoins++;
                let percentage = (this.collectedCoins / 10) * 100;
                this.coinBar.setPercentage(percentage);
                            this.audioManager.playSound(this.audioManager.coinSound); 

            }
    });
}


    
checkThrowObjects() {
    if (this.keyboard.D && this.collectedBottles > 0) {
        let bottle = new ThwrowableObjects(this.character.x + 100, this.character.y + 100);
        this.throwableObjects.push(bottle);
        this.collectedBottles--;
        let percentage = (this.collectedBottles / 5) * 100; 
        this.bottleBar.setPercentage(percentage);
        this.keyboard.D = false;
        setTimeout(() => {
            this.keyboard.D = false;
        }, 500);
    }
}


    checkCollision() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (!this.character.isAboveGroung() && !this.character.isHurt()) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                 this.audioManager.playSound(this.audioManager.hurtSound);

                }
            }
        });
    }

    checkEnemyCollision() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isColliding(enemy) && this.character.isAboveGroung() && !enemy.isDead) {
                enemy.hit();
                this.character.jump();
                                    this.audioManager.playSound(this.audioManager.chickenDeadSound);

                if (enemy instanceof Chicken) {
                    setTimeout(() => {
                        this.level.enemies.splice(index, 1);
                    }, 500);
                }
            }
        });
    }

      checkBottleEnemyCollision() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding(enemy) && !bottle.hasHit) {
                    bottle.hasHit = true;
                    enemy.hit();
       this.audioManager.playSound(this.audioManager.bottleSplashSound);

                    
                    setTimeout(() => {
                        this.throwableObjects.splice(bottleIndex, 1);
                    }, 300);
                    
                    if (enemy instanceof Chicken) {
                                this.audioManager.playSound(this.audioManager.chickenDeadSound);

                        setTimeout(() => {
                            this.level.enemies.splice(enemyIndex, 1);
                        }, 500);
                    }
                    
                    if (enemy instanceof Endboss) {
                        enemy.hadFirstContact = true;
                        this.endbossBar.setPercentage(enemy.energy);
                    this.audioManager.playSound(this.audioManager.endbossHurtSound);

                    }
                }
            });
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.endbossBar);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}