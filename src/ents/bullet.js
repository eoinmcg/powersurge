import Base from "./base";
import config from '../config.json';

const scale = 2, texture = 'flame';

export default class Bullet extends Base {
    constructor(scene, opts) {
        super(scene, opts.x, opts.y, texture, scale, false);
    }

    init() {
        this.setOrigin(0.5);
        this.setScale(scale);
        this.setDepth(2) ;
        this.x = this.scene.player.x;
        this.y = this.scene.player.y + this.scene.player.w;
    }

    preUpdate() {
        if (!this.onScreen()) {
            this.kill();
        }
    }
}
