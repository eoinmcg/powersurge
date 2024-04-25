// import * as Phaser from 'phaser';
import Base from "./base";
import config from '../config.json';

const W = config.width, H = config.height, T = config.tileSize;

const scale = 4, texture = 'flame';

export default class Flame extends Base {

    constructor(scene, opts) {
        super(scene, opts.x, opts.y, texture, scale, true);
    }

    init() {

    }
}
