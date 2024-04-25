import * as Phaser from 'phaser';
import Base from "./base";
import config from '../config.json';

const W = config.width, H = config.height, T = config.tileSize;
const scale = 2.5, texture = 'spark';

export default class Shock extends Base {

    constructor(scene, opts) {
        super(scene, opts.x, opts.y, texture, scale, false);
    }

    init() {

        this.setFrame(0);
        this.setDepth(2);
        this.setTint(0xe98537);
        this.count = 0;
        this.x -= this.w / 2;
        this.y -= this.h / 2;

        this.scene.tweens.add({
            targets: this,
            scale: 4,
            tint: 0xf3a833,
            duration: 1000,
            ease: 'Bounce.In.Out',
            yoyo: true,
            repeat: -1
        });



    }


    preUpdate(time, delta) {
        this.count += (delta / 100);

        let frame = Math.floor(this.count);
        if(frame > 4) {
            this.count = 0;
            frame = 0;
        } else {
            this.setFrame(frame);
        }
        this.rotation += 0.1;

    }
}
