import Base from "./base";
import config from '../config.json';

const W = config.width, H = config.height, T = config.tileSize;

const scale = 2.5, texture = 'eye';

export default class Eye extends Base {

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
        this.shadow.offY = this.h;

        let existingAnims = Object.keys(this.scene.anims.anims.entries);
        if (!existingAnims.includes('spin')) {
            scene.anims.create({
             key: 'spin',
             frames: scene.anims.generateFrameNumbers('eye', {frames: [0,1,2]}),
             frameRate: 5,
             repeat: -1
           });
        }

        this.scene.tweens.add({
            targets: this,
            scale: this.scale * 0.85,
            yoyo: true,
            duration: 1000,
            ease: 'Cubic.InOut',
            repeat: -1
        });

        this.vy = -1;
        this.play('spin');
    }


    takeTurn() {
        if (!this || this.dead || !this.onScreen()) { return; }
        let p = this.scene.player;
        let x = this.x;
        if (p.x - 10 > this.x) {
            x += T;
        } else if(p.x + 10 < this.x) {
            x -= T;
        }
        let y = this.y + (this.vy * T);
        let tile = this.scene.map.getTileAtWorldXY(this.x, y);


        this.movingFrom = [this.x, this.y];
        this.activeTween  = this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 200,
            ease: 'Ease.InOut',
            onComplete: () => {
                if (!this.dead) {
                    this.y = y;
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
