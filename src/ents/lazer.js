// import * as Phaser from 'phaser';
import Base from "./base";
import config from '../config.json';

const W = config.width, H = config.height, T = config.tileSize;

const scale = 2.5, texture = 'charge_icon';

export default class Lazer extends Base {

    constructor(scene, opts) {
        super(scene, opts.x, opts.y, texture, scale, false);
    }

    init() {
        this.moving = false;
        this.sfx('blip');

        this.setOrigin(0.5);
        this.setScale(scale);
        this.setDepth(2);
        this.setAngle(45);

        this.speed = 1000;
        this.speedX = this.speed;
        this.speedY = 0;

        this.vx = this.x > W / 2 ? -1 : 1;
        if (this.initCoords.x === 10) {
            this.flipX = true;
            this.speedX *= -1;
        } else if (this.initCoords.x > 1 && this.initCoords.x < 10) {
            this.setAngle(0);
            this.speedX = 0;
            this.speedY = this.speed * -1;
            this.x -= this.w / 2;
        }

        this.setVelocityX(this.speedX);
        this.setVelocityY(this.speedY);

        const burst = this.scene.add.image(this.x - this.w / 2, this.y, 'circle')
            .setOrigin(0.5).setScale(1).setDepth(6);
        const startY = this.y;
        this.scene.tweens.add({
            targets: burst,
            scale: 4,
            alpha: 0.5,
            rotation: 4,
            ease: 'linear',
            duration: 100,
            onComplete: () => {
                this.y = startY;
                burst.destroy();
            }
        })

    }

    preUpdate() {
        if (this.x < 0 || this.x > 320) {
            this.dead = true;
        }

    }
}
