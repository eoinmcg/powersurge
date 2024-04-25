import Base from "./base";
import config from '../config.json';

const W = config.width, H = config.height, T = config.tileSize;

const scale = 2, texture = 'switch';

export default class Switch extends Base {

    constructor(scene, opts) {
        super(scene, opts.x, opts.y, texture, scale, false);
    }

    init() {
        this.state = 'on';
        this.setDepth(1);
    }

    deactivate() {
        if (this.state === 'on') {
            this.state = 'off';
            this.sfx('levelComplete');
            this.setFrame(1);
        }
    }


}

