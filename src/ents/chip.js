import Base from "./base";
import config from '../config.json';

const W = config.width, H = config.height, T = config.tileSize;

const scale = 2.5, texture = 'chip';

export default class Chip extends Base {

    constructor(scene, opts) {
        super(scene, opts.x, opts.y, texture, scale, true);
        this.startY = opts.y;
    }

    init() {
        this.moving = false;
        const scene = this.scene;

        this.setOrigin(0.5);
        this.setScale(scale);
        this.setDepth(2) ;


        this.vy = -1;

        if (this.shadow) {
            this.shadow.setScale(this.scale);
            this.shadow.setAlpha(0.25);
        }

        let existingAnims = Object.keys(this.scene.anims.anims.entries);

        if (!existingAnims.includes('chip_idle')) {
            scene.anims.create({
             key: 'chip_idle',
             frames: scene.anims.generateFrameNumbers('chip', {frames: [1]}),
             frameRate: 5,
             repeat: -1
           });
        }
        if (!existingAnims.includes('chip_move')) {
           scene.anims.create({
             key: 'chip_move',
               frames: scene.anims.generateFrameNumbers('chip', {frames: [0,1]}),
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

        this.play('chip_idle');
    }


    takeTurn() {
        if (!this.onScreen) { return; }
        let y = this.y + (this.vy * T);
        let tile = this.scene.map.getTileAtWorldXY(this.x, y);
        if (y < 0 || y > H || tile.index !== 2) {
            this.vy *= -1;
            this.flipY = !this.flipY;
            y = this.y + (this.vy * T);
        }
        this.movingFrom = [this.x, this.y];
        this.play('chip_move');
        this.activeTween  = this.scene.tweens.add({
            targets: this,
            y: y,
            duration: 200,
            ease: 'linear',
            onComplete: () => {
                if (!this.dead) {
                    this.play('chip_idle');
                    this.y = y
                    this.hurt = false;
                }
                this.moveComplete();
            }
        })
    }


    hit(player) {
        if (this.hurt) return;
        this.hurt = true;
        player.hit(this);
        console.log('HIT', player);
    }
}

