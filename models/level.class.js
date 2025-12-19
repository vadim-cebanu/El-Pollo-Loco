class Level{
    enemies;
    clouds;
    coins;
    bottles;

    backgroundObjects;
    level_end_x = 2200;

    constructor(enemies, clouds,backgroundObjects, coins, bottles){
        this.enemies=enemies;
        this.clouds = clouds;
                this.coins = coins;
        this.bottles = bottles;

        this.backgroundObjects = backgroundObjects;

    }
}