import Base from "./base";
import config from '../config.json';
import Bullet from "./bullet";

const W = config.width, H = config.height, T = config.tileSize;


const scale = 2.7, texture = 'beastie';

export default class Player extends Base {

    constructor(scene, opts) {
        super(scene, opts.x, opts.y, texture, scale, true);
    }


    init() {
        this.moving = false;
        const scene = this.scene;

        this.setOrigin(0.5);

        scene.anims.create({
          key: 'blink',
          frames: scene.anims.generateFrameNumbers('beastie', {frames: [1,1,1,1,1,1,0]}),
          frameRate: 5,
          repeat: -1
        });
        scene.anims.create({
          key: 'run',
          frames: scene.anims.generateFrameNumbers('beastie', {start: 1, end: 3}),
          frameRate: 10,
          repeat: -1
        });
        scene.anims.create({
          key: 'shock',
          frames: scene.anims.generateFrameNumbers('beastie', {frames: [4,5]}),
          frameRate: 5,
          repeat: -1
        });

        this.play('blink', true);
        this.movingTo = false;

        this.body.setSize(4, 4);
        this.turns = 0;
        this.moves = 0;
        this.skips = 0;
        this.shots = 0;
        this.kills = 0;

    }


    takeTurn(x, y, skip = false, shoot = false) {
        let duration = 200;
        this.scene.updateTiles();
        this.turns += 1;
        if (skip) {
            this.skips += 1;
            return this.skipTurn(duration);
        } else if (shoot) {
            this.shots += 1;
            return this.shoot(duration);
        } else {
            this.moves += 1;
            return this.moveTo(x, y, duration);
        }
    }

    moveTo(x, y, duration) {
        return new Promise((resolve, reject) => {

            x = Math.floor(this.x + (x * T));
            y = Math.floor(this.y + (y * T));

            let minY = this.scene.cameras.main.scrollY;
            let maxY = this.scene.map.height * this.scene.map.tileHeight;
            if (x > W || x < 0 || y < minY || y > maxY) {
                return resolve(false);
            }

            this.moving = true;
            this.movingFrom = [this.x, this.y];
            this.movingTo = [x, y];


            this.sfx('cut');
            this.play('run', true);
            this.activeTween = this.scene.tweens.add({
                targets: this,
                x: x,
                y: y,
                duration: duration,
                ease: 'linear',
                onComplete: () => {

                    if (this.dead) { return resolve(true); }
                    this.lastX = this.x;
                    this.lastY = this.y;

                    this.x = x; this.y = y;
                    this.play('blink', true);
                    this.movingTo = false;
                    this.movingFrom = false;
                    this.moveComplete();
                    return resolve(true);
                }
            })
        });
    }

    skipTurn() {
        console.log('skiping');

        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    hit(baddie) {
        this.scene.boom(this, 6);
        this.kill();
        baddie.kill();
    }

    shoot() {

        let coords = this.coordsToGrid(
            this.x, this.y
        )

        const burst = this.scene.add.image(this.x, this.y + this.h / 2, 'circle')
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


        const bullet = new Bullet(this.scene, {x: coords[0], y: coords[1]});
        bullet.id = Date.now() + '-' + Math.random() * 1000;
        this.scene.bullets.push(bullet, coords);
        this.sfx('jump');
        this.scene.tweens.add({
            targets: this,
            yoyo: true,
            y: this.y - 6,
            ease: 'linear',
            duration: 50
        })

        let bulletLimit = this.y + config.height

        return new Promise((resolve, reject) => {
            this.scene.tweens.add({
                targets: bullet,
                // y: this.y + 300,
                y: bulletLimit,
                scale: bullet.scaleX + 2,
                duration: 300,
                ease: 'linear',
                onComplete: () => {
                    bullet.destroy();
                    resolve(true);
                }
            });
        });
    }

    fall() {
        this.sfx('gameover');
        if (this.dead) return;
        this.dead = true;
        return new Promise((resolve, reject) => {
            this.activeTween = this.scene.tweens.add({
                targets: this,
                scale: 0,
                duration: 300,
                ease: 'linear',
                onComplete: () => {
                    return resolve(true);
                }
            })
        })
    }

    shock() {
        const scene = this.scene
        this.moving = true;
        this.play('shock');
        scene.time.delayedCall(300, () => { this.sfx('shock'); });
        scene.time.delayedCall(1000, () => {
          scene.boom(this, 6);
          this.kill();
        });
    }

    stats() {
        return {
            turns: this.turns,
            moves: this.moves,
            shots: this.shots,
            kills: this.kills,
        }
    }
}
