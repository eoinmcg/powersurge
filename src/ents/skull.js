// import * as Phaser from 'phaser';
import Base from "./base";
import config from '../config.json';

const W = config.width, H = config.height, T = config.tileSize;

const scale = 2.5, texture = 'walker';

// export default class Skull extends Phaser.Physics.Arcade.Sprite {
export default class Skull extends Base {

    constructor(scene, opts) {
        super(scene, opts.x, opts.y, texture, scale, true);
    }

    init() {
        this.moving = false;
        const scene = this.scene;

        this.setOrigin(0.5);
        this.setScale(scale);
        this.setDepth(2) ;


        if (this.x < scene.cameras.main.centerX) {
            this.vx = -1;
            this.flipX = true;
        } else {
            this.vx = 1;
        }

        this.shadow.setScale(3);
        this.shadow.setAlpha(0.25);

        let existingAnims = Object.keys(this.scene.anims.anims.entries);

        if (!existingAnims.includes('walker_idle')) {
            scene.anims.create({
             key: 'walker_idle',
             frames: scene.anims.generateFrameNumbers('walker', {frames: [0]}),
             frameRate: 5,
             repeat: -1
           });
        }
        if (!existingAnims.includes('walker_move')) {
           scene.anims.create({
             key: 'walker_move',
               frames: scene.anims.generateFrameNumbers('walker', {frames: [0,1]}),
             frameRate: 10,
             repeat: -1
           });
        }

        // this.scene.tweens.add({
        //     targets: this,
        //     scale: this.scale * 0.85,
        //     yoyo: true,
        //     duration: 1000,
        //     ease: 'Cubic.InOut',
        //     repeat: -1
        // });

        this.play('walker_idle');
    }


    takeTurn() {
        if (!this.onScreen) { return; }
        if (!this || this.dead) { return; }
        let x = this.x + (this.vx * T);
        let tile = this.scene.map.getTileAtWorldXY(x, this.y);
        if (x < 0 || x > W || !tile || tile.index !== 2) {
            this.vx *= -1;
            this.flipX = !this.flipX;
            x = this.x + (this.vx * T);
        }
        this.movingFrom = [this.x, this.y];
        this.play('walker_move');
        this.activeTween  = this.scene.tweens.add({
            targets: this,
            x: x,
            duration: 200,
            ease: 'linear',
            onComplete: () => {
                if (!this.dead) {
                    this.play('walker_idle');
                    this.x = x
                    this.hurt = false;
                    this.setFrame(0);
                }
                this.moveComplete();
            }
        })
    }


    hit(player) {
        if (this.hurt) return;
        // this.hurt = true;
        // player.hit(this);
        // console.log('HIT', player);
        // this.destroy();
        // this.shadow.destroy();
        // this.dead = true;

    }
}
