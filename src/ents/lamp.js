import Base from "./base";
import config from '../config.json';
import Lazer from "./lazer";

const W = config.width, H = config.height, T = config.tileSize;

const scale = 2.5, texture = 'lamp';

export default class Lamp extends Base {

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
        this.shadow.offY = this.h / 2;

        let pos = {
            x: this.initCoords.x-1,
            y: this.initCoords.y-1
        };
        this.scene.map.putTileAt(2, pos.x, pos.y);
        let tileBelow = this.scene.map.getTileAt(pos.x, pos.y + 1);
        if (tileBelow && tileBelow.index === 0) {
            this.scene.map.putTileAt(1, pos.x, pos.y+1);
        }

        this.maxFrame = 3;
        window.L = this;
        this.currFrame = 2;
        this.maxFrames = 3;
        this.setFrame(this.currFrame);

    }


    takeTurn() {
        if (!this.onScreen) { return; }
        this.currFrame += 1;
        if (this.currFrame > this.maxFrames) {
            this.currFrame = 0;
        }
        this.setFrame(this.currFrame);
        if (this.onScreen() && this.currFrame === this.maxFrame) {
            let [x, y] = this.coordsToGrid(this.x, this.y);
            x += 1;
            y += 1;
            this.scene.lazers.push(
                new Lazer(this.scene, {x: x, y: y})
            )
        }
    }

}

